export interface EmailAccount {
  id: string;
  user: string;
  password: string;
  host: string;
  port: number;
}

export interface Email {
  id: string;
  accountId: string;
  messageId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  date: Date;
  folder: string;
  category?: EmailCategory;
  read: boolean;
  attachments?: string[];
}

export enum EmailCategory {
  INTERESTED = 'Interested',
  MEETING_BOOKED = 'Meeting Booked',
  NOT_INTERESTED = 'Not Interested',
  SPAM = 'Spam',
  OUT_OF_OFFICE = 'Out of Office',
  UNCATEGORIZED = 'Uncategorized'
}

export interface SearchQuery {
  query?: string;
  accountId?: string;
  folder?: string;
  category?: EmailCategory;
  from?: number;
  size?: number;
}

export interface SuggestedReply {
  email: Email;
  suggestedReply: string;
  confidence: number;
}
