import OpenAI from 'openai';
import { Email, EmailCategory } from '../types/email.types';
import { FreeAIService } from './free-ai.service';

export class AIService {
  private static instance: AIService;
  private openai?: OpenAI;
  private isConfigured: boolean;
  private freeAI: FreeAIService;

  private constructor() {
    this.isConfigured = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key';
    this.freeAI = FreeAIService.getInstance();
    
    if (this.isConfigured) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log('✓ OpenAI API configured - Using GPT-3.5 for categorization');
    } else {
      console.log('✓ Using FREE Advanced AI categorization (no API key needed)');
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async categorizeEmail(email: Email): Promise<EmailCategory> {
    if (!this.isConfigured || !this.openai) {
      // Use FREE Advanced AI
      return this.freeAI.categorizeEmail(email);
    }

    try {
      const prompt = `Categorize the following email into one of these categories:
- Interested: The sender shows interest in the proposal/product/service
- Meeting Booked: The email confirms or schedules a meeting
- Not Interested: The sender declines or shows no interest
- Spam: Promotional, unsolicited, or irrelevant content
- Out of Office: Automated out-of-office reply

Email Subject: ${email.subject}
Email Body: ${email.body.substring(0, 500)}

Respond with only the category name.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 50
      });

      const category = response.choices[0]?.message?.content?.trim() || 'Uncategorized';
      
      // Map response to enum
      const categoryMap: { [key: string]: EmailCategory } = {
        'Interested': EmailCategory.INTERESTED,
        'Meeting Booked': EmailCategory.MEETING_BOOKED,
        'Not Interested': EmailCategory.NOT_INTERESTED,
        'Spam': EmailCategory.SPAM,
        'Out of Office': EmailCategory.OUT_OF_OFFICE
      };

      return categoryMap[category] || EmailCategory.UNCATEGORIZED;
    } catch (error) {
      console.error('AI categorization error:', error);
      return this.fallbackCategorization(email);
    }
  }

  private fallbackCategorization(email: Email): EmailCategory {
    const text = `${email.subject} ${email.body}`.toLowerCase();
    
    // Simple keyword matching
    if (text.includes('interested') || text.includes('would like to') || text.includes('discuss')) {
      return EmailCategory.INTERESTED;
    }
    if (text.includes('meeting') || text.includes('scheduled') || text.includes('confirmed')) {
      return EmailCategory.MEETING_BOOKED;
    }
    if (text.includes('not interested') || text.includes('no longer') || text.includes('decline')) {
      return EmailCategory.NOT_INTERESTED;
    }
    if (text.includes('out of office') || text.includes('away') || text.includes('vacation')) {
      return EmailCategory.OUT_OF_OFFICE;
    }
    if (text.includes('buy now') || text.includes('limited time') || text.includes('click here')) {
      return EmailCategory.SPAM;
    }
    
    return EmailCategory.UNCATEGORIZED;
  }

  async generateReply(email: Email, context: string): Promise<string> {
    if (!this.isConfigured || !this.openai) {
      // Use FREE Advanced AI
      return this.freeAI.generateReply(email);
    }

    try {
      const prompt = `Context: ${context}

I received this email:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Generate a professional and contextually appropriate reply based on the context provided.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('Reply generation error:', error);
      return `Thank you for your email regarding "${email.subject}". I appreciate your interest and will get back to you shortly.`;
    }
  }
}
