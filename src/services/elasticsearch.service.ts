import { Client } from '@elastic/elasticsearch';
import { Email, SearchQuery } from '../types/email.types';

export class ElasticsearchService {
  private static instance: ElasticsearchService;
  private client: Client;
  private readonly indexName = 'emails';

  private constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
    });
  }

  static getInstance(): ElasticsearchService {
    if (!ElasticsearchService.instance) {
      ElasticsearchService.instance = new ElasticsearchService();
    }
    return ElasticsearchService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Test connection first
      await this.client.ping();
      
      const indexExists = await this.client.indices.exists({ index: this.indexName });
      
      if (!indexExists) {
        await this.client.indices.create({
          index: this.indexName,
          body: {
            mappings: {
              properties: {
                accountId: { type: 'keyword' },
                messageId: { type: 'keyword' },
                from: { type: 'text' },
                to: { type: 'text' },
                subject: { type: 'text' },
                body: { type: 'text' },
                date: { type: 'date' },
                folder: { type: 'keyword' },
                category: { type: 'keyword' },
                read: { type: 'boolean' },
                attachments: { type: 'keyword' }
              }
            }
          }
        });
        console.log('Elasticsearch index created');
      }
    } catch (error) {
      console.warn('⚠️  Elasticsearch not available - running in demo mode without search');
      console.warn('   To enable search: Start Docker Desktop and run "docker-compose up -d"');
    }
  }

  async indexEmail(email: Email): Promise<void> {
    try {
      await this.client.index({
        index: this.indexName,
        id: email.id,
        document: email
      });
    } catch (error) {
      console.warn('Elasticsearch not available - email not indexed');
    }
  }

  async searchEmails(query: SearchQuery): Promise<Email[]> {
    try {
      const must: any[] = [];

      if (query.query) {
        must.push({
          multi_match: {
            query: query.query,
            fields: ['subject^2', 'body', 'from', 'to']
          }
        });
      }

      if (query.accountId) {
        must.push({ term: { accountId: query.accountId } });
      }

      if (query.folder) {
        must.push({ term: { folder: query.folder } });
      }

      if (query.category) {
        must.push({ term: { category: query.category } });
      }

      const response = await this.client.search({
        index: this.indexName,
        body: {
          query: must.length > 0 ? { bool: { must } } : { match_all: {} },
          from: query.from || 0,
          size: query.size || 50,
          sort: [{ date: { order: 'desc' } }]
        }
      });

      return response.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
    } catch (error) {
      console.warn('Elasticsearch not available - returning empty results');
      return [];
    }
  }

  async updateEmailCategory(emailId: string, category: string): Promise<void> {
    try {
      await this.client.update({
        index: this.indexName,
        id: emailId,
        doc: { category }
      });
    } catch (error) {
      console.error('Error updating email category:', error);
      throw error;
    }
  }

  async getEmailById(emailId: string): Promise<Email | null> {
    try {
      const response = await this.client.get({
        index: this.indexName,
        id: emailId
      });
      return { id: response._id, ...response._source } as Email;
    } catch (error) {
      return null;
    }
  }
}
