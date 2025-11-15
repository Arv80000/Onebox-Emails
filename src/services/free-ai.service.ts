import { Email, EmailCategory } from '../types/email.types';

export class FreeAIService {
  private static instance: FreeAIService;

  private constructor() {}

  static getInstance(): FreeAIService {
    if (!FreeAIService.instance) {
      FreeAIService.instance = new FreeAIService();
    }
    return FreeAIService.instance;
  }

  async categorizeEmail(email: Email): Promise<EmailCategory> {
    const text = `${email.subject} ${email.body}`.toLowerCase();
    
    // Advanced keyword-based AI categorization
    const patterns = {
      interested: [
        /\b(interested|would like|keen|excited|looking forward)\b/i,
        /\b(discuss|explore|learn more|tell me more)\b/i,
        /\b(sounds good|sounds great|sounds interesting)\b/i,
        /\b(yes|sure|absolutely|definitely)\b.*\b(interested|discuss)\b/i,
      ],
      meetingBooked: [
        /\b(meeting|call|interview)\b.*\b(scheduled|confirmed|booked)\b/i,
        /\b(confirmed|booked)\b.*\b(meeting|call|interview)\b/i,
        /\b(calendar invite|meeting invite|zoom link)\b/i,
        /\b(see you|talk to you)\b.*\b(tomorrow|monday|tuesday|wednesday|thursday|friday)\b/i,
      ],
      notInterested: [
        /\b(not interested|no longer interested|pass|decline)\b/i,
        /\b(no thank you|not at this time|not right now)\b/i,
        /\b(already have|already using|satisfied with)\b/i,
        /\b(unsubscribe|remove me|stop sending)\b/i,
      ],
      spam: [
        /\b(buy now|click here|limited time|act now)\b/i,
        /\b(congratulations|you've won|claim your|free gift)\b/i,
        /\b(discount|sale|offer|deal)\b.*\b(today|now|limited)\b/i,
        /\b(viagra|casino|lottery|prize)\b/i,
        /\$\$\$|!!!/,
      ],
      outOfOffice: [
        /\b(out of office|away from office|on vacation)\b/i,
        /\b(automatic reply|auto-reply|automated response)\b/i,
        /\b(will return|back on|returning on)\b/i,
        /\b(limited access to email|not checking email)\b/i,
      ],
    };

    // Check patterns with scoring
    let scores = {
      interested: 0,
      meetingBooked: 0,
      notInterested: 0,
      spam: 0,
      outOfOffice: 0,
    };

    // Score each category
    for (const pattern of patterns.interested) {
      if (pattern.test(text)) scores.interested += 1;
    }
    for (const pattern of patterns.meetingBooked) {
      if (pattern.test(text)) scores.meetingBooked += 1;
    }
    for (const pattern of patterns.notInterested) {
      if (pattern.test(text)) scores.notInterested += 1;
    }
    for (const pattern of patterns.spam) {
      if (pattern.test(text)) scores.spam += 1;
    }
    for (const pattern of patterns.outOfOffice) {
      if (pattern.test(text)) scores.outOfOffice += 1;
    }

    // Find highest score
    const maxScore = Math.max(...Object.values(scores));
    
    if (maxScore === 0) {
      return EmailCategory.UNCATEGORIZED;
    }

    // Return category with highest score
    if (scores.outOfOffice === maxScore) return EmailCategory.OUT_OF_OFFICE;
    if (scores.spam === maxScore) return EmailCategory.SPAM;
    if (scores.meetingBooked === maxScore) return EmailCategory.MEETING_BOOKED;
    if (scores.notInterested === maxScore) return EmailCategory.NOT_INTERESTED;
    if (scores.interested === maxScore) return EmailCategory.INTERESTED;

    return EmailCategory.UNCATEGORIZED;
  }

  async generateReply(email: Email): Promise<string> {
    const category = await this.categorizeEmail(email);
    const meetingLink = process.env.MEETING_LINK || 'https://cal.com/example';
    
    // Generate contextual replies based on category
    const templates: { [key: string]: string[] } = {
      [EmailCategory.INTERESTED]: [
        `Thank you for your interest in my profile! I'm excited about the opportunity to discuss this further.\n\nI'm available for a conversation at your convenience. You can book a time that works for you here: ${meetingLink}\n\nLooking forward to connecting!`,
        `I appreciate you reaching out! I'm definitely interested in learning more about this opportunity.\n\nWould you like to schedule a call? You can pick a time here: ${meetingLink}\n\nBest regards,`,
        `Thanks for considering my profile! I'd love to discuss this opportunity in more detail.\n\nPlease feel free to book a meeting slot here: ${meetingLink}\n\nI look forward to our conversation!`,
      ],
      [EmailCategory.MEETING_BOOKED]: [
        `Thank you for confirming! I've added it to my calendar and I'm looking forward to our meeting.\n\nSee you then!`,
        `Perfect! I've noted the meeting details and will be there.\n\nLooking forward to our discussion!`,
        `Great! The meeting is confirmed on my end. I'm excited to connect.\n\nSee you soon!`,
      ],
      [EmailCategory.NOT_INTERESTED]: [
        `Thank you for letting me know. I appreciate you taking the time to respond.\n\nBest wishes!`,
        `I understand. Thank you for considering my profile.\n\nAll the best!`,
      ],
      [EmailCategory.OUT_OF_OFFICE]: [
        `Thank you for your auto-reply. I'll follow up when you're back.\n\nEnjoy your time away!`,
      ],
      [EmailCategory.UNCATEGORIZED]: [
        `Thank you for your email regarding "${email.subject}".\n\nI appreciate you reaching out. If you'd like to discuss this further, you can schedule a time here: ${meetingLink}\n\nBest regards,`,
      ],
    };

    // Get templates for category
    const categoryTemplates = templates[category] || templates[EmailCategory.UNCATEGORIZED];
    
    // Return random template
    const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
    return categoryTemplates[randomIndex];
  }
}
