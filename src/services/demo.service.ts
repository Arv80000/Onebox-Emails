import { Email, EmailCategory } from '../types/email.types';

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class DemoService {
  private static instance: DemoService;
  private demoEmails: Email[] = [];

  private constructor() {
    this.generateDemoEmails();
  }

  static getInstance(): DemoService {
    if (!DemoService.instance) {
      DemoService.instance = new DemoService();
    }
    return DemoService.instance;
  }

  private generateDemoEmails(): void {
    const demoData = [
      {
        from: 'recruiter@techcorp.com',
        subject: 'Interview Invitation - Senior Developer Position',
        body: 'Hi, Your resume has been shortlisted for the Senior Developer position. When would be a good time for you to attend a technical interview?',
        category: EmailCategory.INTERESTED
      },
      {
        from: 'hr@startup.io',
        subject: 'Meeting Scheduled for Tomorrow',
        body: 'This is to confirm our meeting scheduled for tomorrow at 2 PM. Looking forward to discussing the opportunity with you.',
        category: EmailCategory.MEETING_BOOKED
      },
      {
        from: 'noreply@company.com',
        subject: 'Thank you for your application',
        body: 'Thank you for your interest in our company. Unfortunately, we have decided to move forward with other candidates at this time.',
        category: EmailCategory.NOT_INTERESTED
      },
      {
        from: 'marketing@deals.com',
        subject: 'AMAZING OFFER - 50% OFF TODAY ONLY!!!',
        body: 'Click here now to claim your exclusive discount! Limited time offer! Buy now and save big!',
        category: EmailCategory.SPAM
      },
      {
        from: 'john.doe@company.com',
        subject: 'Out of Office: Re: Project Discussion',
        body: 'I am currently out of office and will return on Monday. I will respond to your email when I return.',
        category: EmailCategory.OUT_OF_OFFICE
      },
      {
        from: 'cto@innovate.tech',
        subject: 'Interested in Your Profile',
        body: 'We came across your profile and are impressed with your experience. Would you be interested in discussing a potential opportunity with our team?',
        category: EmailCategory.INTERESTED
      },
      {
        from: 'talent@bigtech.com',
        subject: 'Follow-up on Your Application',
        body: 'Thank you for applying to our Software Engineer position. We would like to schedule a call to discuss your background and the role in more detail.',
        category: EmailCategory.INTERESTED
      },
      {
        from: 'calendar@company.com',
        subject: 'Meeting Confirmation: Technical Interview',
        body: 'Your interview has been confirmed for Friday, November 17th at 10:00 AM. Please join via the link provided.',
        category: EmailCategory.MEETING_BOOKED
      }
    ];

    this.demoEmails = demoData.map((data, index) => ({
      id: uuidv4(),
      accountId: index % 2 === 0 ? 'account1' : 'account2',
      messageId: `demo-${index}@example.com`,
      from: data.from,
      to: ['your-email@example.com'],
      subject: data.subject,
      body: data.body,
      date: new Date(Date.now() - index * 3600000), // Stagger by hours
      folder: 'INBOX',
      category: data.category,
      read: false,
      attachments: []
    }));
  }

  getDemoEmails(): Email[] {
    return this.demoEmails;
  }

  searchDemoEmails(query?: string, category?: string, accountId?: string): Email[] {
    let results = [...this.demoEmails];

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(email => 
        email.subject.toLowerCase().includes(lowerQuery) ||
        email.body.toLowerCase().includes(lowerQuery) ||
        email.from.toLowerCase().includes(lowerQuery)
      );
    }

    if (category) {
      results = results.filter(email => email.category === category);
    }

    if (accountId) {
      results = results.filter(email => email.accountId === accountId);
    }

    return results;
  }

  getEmailById(id: string): Email | null {
    return this.demoEmails.find(email => email.id === id) || null;
  }
}
