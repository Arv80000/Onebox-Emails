import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { Email, SuggestedReply } from '../types/email.types';

export class RAGService {
  private static instance: RAGService;
  private pinecone?: Pinecone;
  private openai?: OpenAI;
  private indexName: string;
  private isConfigured: boolean;

  private constructor() {
    this.isConfigured = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key';
    
    if (this.isConfigured) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
    
    this.indexName = process.env.PINECONE_INDEX || 'email-replies';
    
    if (process.env.PINECONE_API_KEY && process.env.PINECONE_API_KEY !== 'your-pinecone-api-key') {
      this.pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
      });
    }
  }

  static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  async initializeKnowledgeBase(): Promise<void> {
    if (!this.pinecone) {
      console.log('Pinecone not configured, using fallback mode');
      return;
    }

    try {
      const productContext = process.env.PRODUCT_CONTEXT || '';
      const meetingLink = process.env.MEETING_LINK || '';
      
      const knowledgeBase = [
        {
          id: 'context-1',
          text: productContext,
          metadata: { type: 'context' }
        },
        {
          id: 'meeting-link',
          text: `Meeting booking link: ${meetingLink}`,
          metadata: { type: 'meeting_link', link: meetingLink }
        },
        {
          id: 'interested-response',
          text: 'When someone shows interest, thank them and share the meeting booking link',
          metadata: { type: 'template' }
        }
      ];

      const index = this.pinecone.index(this.indexName);

      for (const item of knowledgeBase) {
        const embedding = await this.createEmbedding(item.text);
        await index.upsert([{
          id: item.id,
          values: embedding,
          metadata: item.metadata
        }]);
      }

      console.log('Knowledge base initialized');
    } catch (error) {
      console.error('Knowledge base initialization error:', error);
    }
  }

  private async createEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      return Array(1536).fill(0); // Return zero vector if not configured
    }
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  }

  async suggestReply(email: Email): Promise<SuggestedReply> {
    try {
      let context = '';
      
      if (this.pinecone && this.openai) {
        // Query vector database for relevant context
        const queryEmbedding = await this.createEmbedding(
          `${email.subject} ${email.body}`
        );
        
        const index = this.pinecone.index(this.indexName);
        const queryResponse = await index.query({
          vector: queryEmbedding,
          topK: 3,
          includeMetadata: true
        });

        context = queryResponse.matches
          .map(match => match.metadata?.text || '')
          .join('\n');
      } else {
        // Fallback to environment variables
        context = `${process.env.PRODUCT_CONTEXT}\nMeeting Link: ${process.env.MEETING_LINK}`;
      }

      if (!this.openai) {
        // Simple fallback reply
        return {
          email,
          suggestedReply: `Thank you for your email regarding "${email.subject}". I appreciate your interest. You can book a meeting with me here: ${process.env.MEETING_LINK || 'https://cal.com/example'}`,
          confidence: 0.5
        };
      }

      const prompt = `You are an AI assistant helping to draft email replies.

Context and Guidelines:
${context}

Email Received:
From: ${email.from}
Subject: ${email.subject}
Body: ${email.body}

Generate a professional, contextually appropriate reply. If the email shows interest or asks for a meeting, include the meeting booking link naturally in your response.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 400
      });

      const suggestedReply = response.choices[0]?.message?.content?.trim() || '';

      return {
        email,
        suggestedReply,
        confidence: 0.85
      };
    } catch (error) {
      console.error('Reply suggestion error:', error);
      
      // Fallback reply
      return {
        email,
        suggestedReply: `Thank you for your email regarding "${email.subject}". I appreciate your interest. You can book a meeting with me here: ${process.env.MEETING_LINK || 'https://cal.com/example'}`,
        confidence: 0.5
      };
    }
  }
}
