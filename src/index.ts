import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { emailRouter } from './routes/email.routes';
import { ImapService } from './services/imap.service';
import { ElasticsearchService } from './services/elasticsearch.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/emails', emailRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email Onebox API is running' });
});

async function startServer() {
  try {
    console.log('🚀 Starting Email Onebox Server...\n');

    // Initialize Elasticsearch
    const esService = ElasticsearchService.getInstance();
    await esService.initialize();
    console.log('✓ Elasticsearch initialized');

    // Start IMAP sync for all accounts
    const imapService = ImapService.getInstance();
    await imapService.startSync();
    console.log('✓ IMAP sync started for all accounts');

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log('='.repeat(50));
      console.log('\n📧 Email Onebox is ready!');
      console.log(`\n🌐 Open your browser: http://localhost:${PORT}`);
      console.log(`📡 API Health Check: http://localhost:${PORT}/health`);
      console.log(`📊 View Emails: http://localhost:${PORT}/api/emails\n`);
      
      if (!process.env.EMAIL1_USER || process.env.EMAIL1_USER === 'your-email1@gmail.com') {
        console.log('⚠️  WARNING: Email accounts not configured!');
        console.log('   Edit .env file with your email credentials to enable sync\n');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.log('\n💡 TIP: Make sure Docker Desktop is running for Elasticsearch');
    console.log('   Or the server will run in demo mode without search\n');
    process.exit(1);
  }
}

startServer();
