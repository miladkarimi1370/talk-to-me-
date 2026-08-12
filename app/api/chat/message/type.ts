export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  password?: string;        // معمولاً تو فرانت نمی‌فرستیم
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;          // ارتباط با User
  is_favorite: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;  // ارتباط با Conversation
  role: "admin" | "client" | "system" | "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  message_id: string;       // ارتباط با Message
  name: string;
  url: string;
  type: string;
  size: number;             // تو دیتابیس int4 هست
  created_at: string;
}