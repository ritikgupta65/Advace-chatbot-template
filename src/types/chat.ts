
export interface BaseMessage {
  id: string;
}

export interface RegularMessage extends BaseMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface TypingMessage extends BaseMessage {
  isTyping: true;
}

export type Message = RegularMessage | TypingMessage;

export type ChatState = 'welcome' | 'chatting' | 'history' | 'faq';

export interface QuickAction {
  label: string;
  message?: string;
  action?: () => void;
}
