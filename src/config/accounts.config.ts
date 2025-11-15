import { EmailAccount } from '../types/email.types';

export function getEmailAccounts(): EmailAccount[] {
  const accounts: EmailAccount[] = [];

  // Account 1
  if (process.env.EMAIL1_USER && 
      process.env.EMAIL1_PASSWORD && 
      process.env.EMAIL1_USER !== 'your-email1@gmail.com' &&
      process.env.EMAIL1_PASSWORD !== 'your-app-password1') {
    accounts.push({
      id: 'account1',
      user: process.env.EMAIL1_USER,
      password: process.env.EMAIL1_PASSWORD,
      host: process.env.EMAIL1_HOST || 'imap.gmail.com',
      port: parseInt(process.env.EMAIL1_PORT || '993')
    });
  }

  // Account 2
  if (process.env.EMAIL2_USER && 
      process.env.EMAIL2_PASSWORD &&
      process.env.EMAIL2_USER !== 'your-email2@gmail.com' &&
      process.env.EMAIL2_PASSWORD !== 'your-app-password2') {
    accounts.push({
      id: 'account2',
      user: process.env.EMAIL2_USER,
      password: process.env.EMAIL2_PASSWORD,
      host: process.env.EMAIL2_HOST || 'imap.gmail.com',
      port: parseInt(process.env.EMAIL2_PORT || '993')
    });
  }

  return accounts;
}
