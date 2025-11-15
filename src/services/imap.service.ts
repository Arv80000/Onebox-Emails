import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { getEmailAccounts } from '../config/accounts.config';
import { Email, EmailAccount } from '../types/email.types';
import { ElasticsearchService } from './elasticsearch.service';
import { AIService } from './ai.service';
import { NotificationService } from './notification.service';
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class ImapService {
  private static instance: ImapService;
  private connections: Map<string, Imap> = new Map();
  private esService: ElasticsearchService;
  private aiService: AIService;
  private notificationService: NotificationService;

  private constructor() {
    this.esService = ElasticsearchService.getInstance();
    this.aiService = AIService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  static getInstance(): ImapService {
    if (!ImapService.instance) {
      ImapService.instance = new ImapService();
    }
    return ImapService.instance;
  }

  async startSync(): Promise<void> {
    const accounts = getEmailAccounts();
    
    if (accounts.length === 0) {
      console.warn('⚠️  No email accounts configured - running in demo mode');
      console.warn('   Configure EMAIL1_USER and EMAIL2_USER in .env to enable email sync');
      return;
    }

    for (const account of accounts) {
      await this.connectAccount(account);
    }
  }

  private async connectAccount(account: EmailAccount): Promise<void> {
    const imap = new Imap({
      user: account.user,
      password: account.password,
      host: account.host,
      port: account.port,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    imap.once('ready', () => {
      console.log(`✓ Connected to ${account.user}`);
      this.openInbox(imap, account);
    });

    imap.once('error', (err: Error) => {
      console.error(`IMAP error for ${account.user}:`, err);
    });

    imap.once('end', () => {
      console.log(`Connection ended for ${account.user}`);
      // Reconnect after 5 seconds
      setTimeout(() => this.connectAccount(account), 5000);
    });

    imap.connect();
    this.connections.set(account.id, imap);
  }

  private openInbox(imap: Imap, account: EmailAccount): void {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return;
      }

      // Fetch last 30 days of emails
      this.fetchRecentEmails(imap, account);

      // Start IDLE mode for real-time updates
      this.startIdleMode(imap, account);
    });
  }

  private fetchRecentEmails(imap: Imap, account: EmailAccount): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    imap.search(['ALL', ['SINCE', thirtyDaysAgo]], (err, results) => {
      if (err) {
        console.error('Search error:', err);
        return;
      }

      if (results.length === 0) {
        console.log(`No emails found for ${account.user}`);
        return;
      }

      console.log(`Fetching ${results.length} emails for ${account.user}`);
      this.fetchEmails(imap, account, results);
    });
  }

  private fetchEmails(imap: Imap, account: EmailAccount, uids: number[]): void {
    const fetch = imap.fetch(uids, { bodies: '', markSeen: false });

    fetch.on('message', (msg, seqno) => {
      msg.on('body', (stream) => {
        simpleParser(stream, async (err, parsed) => {
          if (err) {
            console.error('Parse error:', err);
            return;
          }

          const email: Email = {
            id: uuidv4(),
            accountId: account.id,
            messageId: parsed.messageId || uuidv4(),
            from: parsed.from?.text || '',
            to: parsed.to?.text ? [parsed.to.text] : [],
            subject: parsed.subject || '',
            body: parsed.text || parsed.html || '',
            date: parsed.date || new Date(),
            folder: 'INBOX',
            read: false,
            attachments: parsed.attachments?.map(a => a.filename || '') || []
          };

          // Categorize with AI
          const category = await this.aiService.categorizeEmail(email);
          email.category = category;

          // Index in Elasticsearch
          await this.esService.indexEmail(email);

          // Send notifications if interested
          if (category === 'Interested') {
            await this.notificationService.sendSlackNotification(email);
            await this.notificationService.triggerWebhook(email);
          }
        });
      });
    });

    fetch.once('error', (err) => {
      console.error('Fetch error:', err);
    });

    fetch.once('end', () => {
      console.log(`Finished fetching emails for ${account.user}`);
    });
  }

  private startIdleMode(imap: Imap, account: EmailAccount): void {
    imap.on('mail', (numNewMsgs) => {
      console.log(`${numNewMsgs} new email(s) for ${account.user}`);
      
      // Fetch new emails
      imap.search(['UNSEEN'], (err, results) => {
        if (err || results.length === 0) return;
        this.fetchEmails(imap, account, results);
      });
    });

    // Check for new emails periodically as fallback
    setInterval(() => {
      if (imap.state === 'authenticated') {
        imap.search(['UNSEEN'], (err, results) => {
          if (err || results.length === 0) return;
          this.fetchEmails(imap, account, results);
        });
      }
    }, 30000); // Check every 30 seconds
  }

  async syncAccount(accountId: string): Promise<void> {
    const accounts = getEmailAccounts();
    const account = accounts.find(a => a.id === accountId);
    
    if (!account) {
      throw new Error('Account not found');
    }

    await this.connectAccount(account);
  }
}
