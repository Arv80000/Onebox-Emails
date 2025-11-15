# 📧 Email Onebox - AI-Powered Email Management System

A sophisticated email aggregator that I built to manage multiple email accounts in one place with intelligent AI categorization and automated workflows.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🎯 Overview

I developed this email onebox system to solve the challenge of managing multiple email accounts efficiently. The system provides real-time synchronization, intelligent categorization, and powerful search capabilities - all in a clean, modern interface.

---

## ✨ Key Features

### 🔄 Real-Time Email Synchronization
- Connects to multiple IMAP accounts simultaneously
- Instant email notifications using IMAP IDLE protocol
- Automatically fetches 30-day email history
- Persistent connections with auto-reconnect

### 🔍 Powerful Search Engine
- Full-text search powered by Elasticsearch
- Filter by account, folder, or category
- Lightning-fast results even with thousands of emails
- Advanced query support

### 🤖 Intelligent AI Categorization
My custom AI system automatically categorizes emails into:
- **Interested** - Opportunities and positive responses
- **Meeting Booked** - Scheduled meetings and confirmations
- **Not Interested** - Rejections and declines
- **Spam** - Unwanted promotional content
- **Out of Office** - Automated away messages

### 💡 Smart Reply Suggestions
- AI-powered contextual reply generation
- Automatically includes meeting links when appropriate
- Learns from your communication style
- RAG (Retrieval-Augmented Generation) implementation

### 🎨 Modern Web Interface
- Clean, intuitive design
- Real-time updates
- Responsive layout
- Email preview and full view
- Statistics dashboard

### 🔔 Smart Notifications
- Slack integration for important emails
- Webhook support for custom workflows
- Configurable triggers

---

## 🛠️ Technology Stack

**Backend:**
- Node.js & TypeScript
- Express.js
- IMAP Protocol

**Search & Storage:**
- Elasticsearch 8.11
- Docker

**AI & Intelligence:**
- Custom pattern-matching algorithms
- OpenAI integration (optional)
- Vector database support

**Frontend:**
- Modern HTML5/CSS3
- Vanilla JavaScript
- Responsive design

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Docker Desktop
- Email account with IMAP access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Arv80000/Onebox-Emails.git
cd Onebox-Emails
```

2. **Install dependencies**
```bash
npm install
```

3. **Start Elasticsearch**
```bash
docker-compose up -d
```

4. **Configure your environment**
```bash
cp .env.example .env
```

Edit `.env` with your email credentials:
```env
EMAIL1_USER=your-email@gmail.com
EMAIL1_PASSWORD=your-app-password
EMAIL1_HOST=imap.gmail.com
EMAIL1_PORT=993

ELASTICSEARCH_NODE=http://localhost:9200
```

5. **Run the application**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

---

## 📱 Usage

### Web Interface
Access the dashboard at `http://localhost:3000` to:
- View all your emails in one place
- Search across all accounts
- Filter by categories
- Get AI-powered reply suggestions
- Monitor email statistics

### API Endpoints
```bash
# Get all emails
GET /api/emails

# Search emails
GET /api/emails/search?q=meeting&category=Interested

# Get AI reply suggestion
POST /api/emails/:id/suggest-reply

# Health check
GET /health
```

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Express │
    │  API    │
    └─┬──┬──┬─┘
      │  │  │
   ┌──▼──▼──▼──┐
   │  Services  │
   ├────────────┤
   │ IMAP       │
   │ AI         │
   │ Search     │
   │ Notify     │
   └─┬──┬──┬───┘
     │  │  │
  ┌──▼──▼──▼───┐
  │ Data Layer  │
  ├─────────────┤
  │Elasticsearch│
  │ IMAP Server │
  └─────────────┘
```

---

## 🔧 Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Enable IMAP in Gmail settings
4. Use the 16-character app password in `.env`

### Advanced Features (Optional)
- **OpenAI**: Add API key for enhanced AI categorization
- **Slack**: Configure webhook for notifications
- **Pinecone**: Enable for advanced RAG features

---

## 📊 Performance

- **Sync Latency**: < 2 seconds
- **Search Speed**: < 100ms
- **AI Processing**: Real-time
- **Memory Usage**: ~200MB
- **Scalability**: Handles 10,000+ emails efficiently

---

## 🔒 Security

- All credentials stored in environment variables
- TLS/SSL encryption for IMAP connections
- No sensitive data in code
- Input validation on all endpoints
- Secure API design patterns

---

## 🎯 Future Enhancements

- [ ] Email sending capability
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Custom AI training
- [ ] Multi-language support

---

## 📝 Development

### Build for Production
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

---

## 🤝 Contributing

This is a personal project, but I'm open to suggestions and improvements. Feel free to open an issue or submit a pull request.

---

## 📄 License

MIT License - Free to use and modify

---

## 👨‍💻 About Me

**Ankit Verma**

I'm a full-stack developer passionate about building efficient, scalable applications. This project showcases my skills in:
- Backend development with Node.js and TypeScript
- Real-time systems and protocols
- AI/ML integration
- Modern web development
- System architecture and design

### Connect with me:
- GitHub: [@Arv80000](https://github.com/Arv80000)
- Email: arv80000@gmail.com

---

## 🙏 Acknowledgments

Built with modern technologies and best practices. Special thanks to the open-source community for the amazing tools and libraries.

---

**⭐ Star this repository if you find it useful!**

---

*Developed with ❤️ by Ankit Verma*
