export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

export type Conversation = Message[];
