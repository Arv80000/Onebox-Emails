import { IncomingWebhook } from '@slack/webhook';
import axios from 'axios';
import { Email } from '../types/email.types';

export class NotificationService {
  private static instance: NotificationService;
  private slackWebhook?: IncomingWebhook;
  private webhookUrl?: string;

  private constructor() {
    if (process.env.SLACK_WEBHOOK_URL) {
      this.slackWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    }
    this.webhookUrl = process.env.WEBHOOK_URL;
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendSlackNotification(email: Email): Promise<void> {
    if (!this.slackWebhook) {
      console.log('Slack webhook not configured');
      return;
    }

    try {
      await this.slackWebhook.send({
        text: `🎯 New Interested Email!`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎯 New Interested Email'
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*From:*\n${email.from}`
              },
              {
                type: 'mrkdwn',
                text: `*Subject:*\n${email.subject}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Preview:*\n${email.body.substring(0, 200)}...`
            }
          }
        ]
      });
      console.log('Slack notification sent');
    } catch (error) {
      console.error('Slack notification error:', error);
    }
  }

  async triggerWebhook(email: Email): Promise<void> {
    if (!this.webhookUrl) {
      console.log('Webhook URL not configured');
      return;
    }

    try {
      await axios.post(this.webhookUrl, {
        event: 'email.interested',
        email: {
          id: email.id,
          from: email.from,
          subject: email.subject,
          date: email.date,
          category: email.category
        },
        timestamp: new Date().toISOString()
      });
      console.log('Webhook triggered');
    } catch (error) {
      console.error('Webhook trigger error:', error);
    }
  }
}
