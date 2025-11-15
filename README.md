# 📧 Email Onebox - Feature-Rich Email Aggregator

> A production-ready email onebox aggregator with AI-powered categorization, real-time IMAP sync, Elasticsearch integration, and RAG-based reply suggestions.

**🎯 All 6 Required Features Implemented + Bonus Features**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-8.11-orange)](https://www.elastic.co/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple)](https://openai.com/)

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start Elasticsearch
docker-compose up -d

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Run the application
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## 📤 Submission Instructions

### 1. Create GitHub Repository
- Go to https://github.com and create a **PRIVATE** repository
- Name: `email-onebox-assignment`
- Do NOT initialize with README

### 2. Push Code to GitHub
```bash
git init
git add .
git commit -m "Complete Email Onebox Assignment"
git remote add origin https://github.com/YOUR_USERNAME/email-onebox-assignment.git
git branch -M main
git push -u origin main
```

### 3. Grant Access to Reviewers
- Go to repository Settings → Collaborators
- Add: **Mitrajit**
- Add: **sarvagya-chaudhary**

### 4. Record Demo Video (Max 5 minutes)
- Show all 6 features working
- Demo frontend at http://localhost:3000
- Test API endpoints in Postman
- Upload to YouTube (unlisted) or Loom

### 5. Submit Form
- Fill form: https://forms.gle/DqF27M4Sw1dJsf4j6
- Include GitHub repository link
- Include demo video link

---

A highly functional email onebox aggregator with AI-powered categorization, real-time IMAP sync, Elasticsearch integration, and RAG-based reply suggestions.

## 🚀 Features Implemented

### ✅ 1. Real-Time Email Synchronization
- Syncs multiple IMAP accounts (minimum 2) in real-time
- Fetches last 30 days of emails on startup
- Uses persistent IMAP connections with IDLE mode (no cron jobs!)
- Automatic reconnection on connection loss

### ✅ 2. Searchable Storage using Elasticsearch
- Locally hosted Elasticsearch instance via Docker
- Full-text search across subject, body, sender, and recipients
- Advanced filtering by folder, account, and category
- Optimized indexing for fast queries

### ✅ 3. AI-Based Email Categorization
- OpenAI GPT-3.5 powered categorization
- Categories: Interested, Meeting Booked, Not Interested, Spam, Out of Office
- Automatic categorization on email receipt
- High accuracy with contextual understanding

### ✅ 4. Slack & Webhook Integration
- Slack notifications for "Interested" emails with rich formatting
- Webhook triggers to webhook.site for external automation
- Configurable notification settings

### ✅ 5. Frontend Interface
- Clean, modern UI with real-time updates
- Email search powered by Elasticsearch
- Filter by folder, account, and AI category
- Email preview and full view modal
- Statistics dashboard

### ✅ 6. AI-Powered Suggested Replies (RAG)
- Vector database (Pinecone) for storing product context
- RAG (Retrieval-Augmented Generation) with GPT-4
- Context-aware reply suggestions
- Automatic meeting link inclusion

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- OpenAI API key
- (Optional) Pinecone account for RAG features
- (Optional) Slack webhook URL
- Email accounts with IMAP access enabled

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Start Elasticsearch

```bash
docker-compose up -d
```

Wait for Elasticsearch to be ready (check with `curl http://localhost:9200`).

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Email Account 1 (Gmail example)
EMAIL1_USER=your-email1@gmail.com
EMAIL1_PASSWORD=your-app-password1
EMAIL1_HOST=imap.gmail.com
EMAIL1_PORT=993

# Email Account 2
EMAIL2_USER=your-email2@gmail.com
EMAIL2_PASSWORD=your-app-password2
EMAIL2_HOST=imap.gmail.com
EMAIL2_PORT=993

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# OpenAI (required for AI features)
OPENAI_API_KEY=sk-...

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Webhook (optional)
WEBHOOK_URL=https://webhook.site/your-unique-url

# Pinecone (optional, for RAG)
PINECONE_API_KEY=your-key
PINECONE_ENVIRONMENT=your-env
PINECONE_INDEX=email-replies

# Product Context for RAG
PRODUCT_CONTEXT=I am applying for a job position. If the lead is interested, share the meeting booking link.
MEETING_LINK=https://cal.com/example
```

### 4. Gmail Setup (if using Gmail)

1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Enable IMAP in Gmail settings
4. Use the App Password in `.env`

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`.

## 📡 API Endpoints (Postman Testing)

### 1. Get All Emails
```
GET http://localhost:3000/api/emails
```

### 2. Search Emails
```
GET http://localhost:3000/api/emails/search?q=meeting&category=Interested&accountId=account1
```

Query Parameters:
- `q`: Search query
- `category`: Filter by category
- `accountId`: Filter by account
- `folder`: Filter by folder
- `from`: Pagination offset
- `size`: Results per page

### 3. Get Email by ID
```
GET http://localhost:3000/api/emails/:id
```

### 4. Update Email Category
```
PATCH http://localhost:3000/api/emails/:id/category
Content-Type: application/json

{
  "category": "Interested"
}
```

### 5. Get AI Suggested Reply
```
POST http://localhost:3000/api/emails/:id/suggest-reply
```

### 6. Initialize RAG Knowledge Base
```
POST http://localhost:3000/api/emails/rag/initialize
```

### 7. Sync Specific Account
```
POST http://localhost:3000/api/emails/sync/:accountId
```

### 8. Health Check
```
GET http://localhost:3000/health
```

## 🎨 Frontend Usage

Open `http://localhost:3000` in your browser.

Features:
- View all emails with AI categorization
- Search emails in real-time
- Filter by category and account
- Click email to view full content
- Get AI-powered reply suggestions
- Auto-refresh every 30 seconds

## 🏗️ Architecture

```
src/
├── config/
│   └── accounts.config.ts      # Email account configuration
├── services/
│   ├── imap.service.ts         # Real-time IMAP sync with IDLE
│   ├── elasticsearch.service.ts # Search and indexing
│   ├── ai.service.ts           # Email categorization
│   ├── notification.service.ts # Slack & webhook integration
│   └── rag.service.ts          # RAG-based reply suggestions
├── routes/
│   └── email.routes.ts         # API endpoints
├── types/
│   └── email.types.ts          # TypeScript interfaces
└── index.ts                    # Application entry point
```

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Start the server
3. Test each endpoint sequentially:
   - Health check
   - Get all emails (verify sync is working)
   - Search emails
   - Get suggested reply
   - Update category

## 🎯 Feature Completion Checklist

- [x] Real-time IMAP sync with IDLE mode (2+ accounts)
- [x] 30-day email history fetch
- [x] Elasticsearch integration with Docker
- [x] Full-text search with filters
- [x] AI email categorization (5 categories)
- [x] Slack notifications for interested emails
- [x] Webhook triggers for automation
- [x] Frontend UI with search and filters
- [x] AI categorization display
- [x] RAG-based suggested replies with vector DB
- [x] Context-aware reply generation

## 🔧 Troubleshooting

### Elasticsearch Connection Issues
```bash
# Check if Elasticsearch is running
curl http://localhost:9200

# Restart Elasticsearch
docker-compose restart
```

### IMAP Connection Issues
- Verify IMAP is enabled in email settings
- Check firewall/antivirus blocking port 993
- For Gmail, ensure App Password is used (not regular password)
- Check credentials in `.env`

### AI Features Not Working
- Verify OpenAI API key is valid
- Check API quota/billing
- For RAG features, ensure Pinecone is configured

## 📊 Performance Optimizations

- Persistent IMAP connections reduce overhead
- Elasticsearch indexing for sub-second searches
- Efficient email parsing with streaming
- Connection pooling and retry logic
- Automatic reconnection on failures

## 🔐 Security Best Practices

- Environment variables for sensitive data
- No credentials in code
- TLS/SSL for IMAP connections
- Input validation on all endpoints
- Rate limiting recommended for production

## 📈 Scalability

- Horizontal scaling with multiple instances
- Elasticsearch cluster for large datasets
- Queue system for email processing (future)
- Microservices architecture ready

## 🎓 Technologies Used

- **Backend**: Node.js, TypeScript, Express
- **Email**: IMAP with IDLE mode
- **Search**: Elasticsearch
- **AI**: OpenAI GPT-3.5/GPT-4
- **Vector DB**: Pinecone
- **Notifications**: Slack Webhooks
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Infrastructure**: Docker, Docker Compose

## 📝 License

MIT

## 👨‍💻 Author

Built for the Backend Engineering Assignment - Reachinbox

---

**Note**: This implementation includes all 6 required features plus additional optimizations for production readiness.
