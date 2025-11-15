import { Router } from 'express';
import { ElasticsearchService } from '../services/elasticsearch.service';
import { ImapService } from '../services/imap.service';
import { RAGService } from '../services/rag.service';
import { DemoService } from '../services/demo.service';
import { SearchQuery } from '../types/email.types';

export const emailRouter = Router();

const esService = ElasticsearchService.getInstance();
const imapService = ImapService.getInstance();
const ragService = RAGService.getInstance();
const demoService = DemoService.getInstance();

// Search emails
emailRouter.get('/search', async (req, res) => {
  try {
    const query: SearchQuery = {
      query: req.query.q as string,
      accountId: req.query.accountId as string,
      folder: req.query.folder as string,
      category: req.query.category as any,
      from: parseInt(req.query.from as string) || 0,
      size: parseInt(req.query.size as string) || 50
    };

    let emails = await esService.searchEmails(query);
    
    // Fallback to demo data if Elasticsearch returns empty
    if (emails.length === 0) {
      emails = demoService.searchDemoEmails(query.query, query.category, query.accountId);
    }
    
    res.json({ success: true, count: emails.length, emails, demo: emails.length > 0 && emails[0].id.startsWith('demo') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get email by ID
emailRouter.get('/:id', async (req, res) => {
  try {
    let email = await esService.getEmailById(req.params.id);
    
    // Fallback to demo data
    if (!email) {
      email = demoService.getEmailById(req.params.id);
    }
    
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }
    res.json({ success: true, email });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update email category
emailRouter.patch('/:id/category', async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }

    await esService.updateEmailCategory(req.params.id, category);
    res.json({ success: true, message: 'Category updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sync specific account
emailRouter.post('/sync/:accountId', async (req, res) => {
  try {
    await imapService.syncAccount(req.params.accountId);
    res.json({ success: true, message: 'Sync started' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get suggested reply for an email
emailRouter.post('/:id/suggest-reply', async (req, res) => {
  try {
    const email = await esService.getEmailById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }

    const suggestion = await ragService.suggestReply(email);
    res.json({ success: true, suggestion });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize RAG knowledge base
emailRouter.post('/rag/initialize', async (req, res) => {
  try {
    await ragService.initializeKnowledgeBase();
    res.json({ success: true, message: 'Knowledge base initialized' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all emails (for frontend)
emailRouter.get('/', async (req, res) => {
  try {
    let emails = await esService.searchEmails({
      from: 0,
      size: 100
    });
    
    // Fallback to demo data if Elasticsearch returns empty
    if (emails.length === 0) {
      emails = demoService.getDemoEmails();
    }
    
    res.json({ success: true, count: emails.length, emails, demo: emails.length > 0 && emails[0].id.includes('demo') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
