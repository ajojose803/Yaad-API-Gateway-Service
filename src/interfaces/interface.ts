export interface AuthResponse {
  message: string;
  name: string;
  email: string;
  refreshToken: string;
  token: string;
  _id: string;
  service: string;
  userImage: string;
  phone: string;
}

export interface AdminAuthResponse {
  message: string;
  name: string;
  token: string;
}

export interface UpdateUser {
  message: string;
  name: string;
  phone: string;
  userImage: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserCredentials {
  userId: string;
  role: string;
}

export interface User {
  message: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  userImage: string;
  password?: string;
  accountStatus?: string;
  eventsHosted?: string[]; // Array of IDs of events hosted by the user
  eventsAttended?: string[]; // Array of IDs of events attended by the user
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomUser {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}
export interface Attendee {
    userId: string;
    status: 'invited' | 'confirmed' | 'declined';
    plusOnes?: number;
    category: 'Family' | 'Friends' | 'VIP';
    preferences?: Record<string, string | number | boolean>;
    invitedAt: Date;
    respondedAt?: Date;
  }

export interface Reminder {
  _id: string;
  type: "email" | "sms" | "push";
  timeBefore: number;
  message?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  status?: "pending" | "sent" | "failed";
}

export interface VendorEvent {
  vendorId: string;
  eventId: string;
  quoteApproved: boolean;
  assignedAt: Date;
}

export interface Question {
  questionId: string;
  question: string;
  answer?: string;
  required?: boolean;
}


export interface Quotation {
  vendorId: string;  
  eventId: string;   
  quote: number;  
  message?: string;  
  questions?: Question[]; 
  quotedAt: Date;    
}


export interface IEvent {
  _id: string;
  title: string;
  description?: string;
  hostId: string;
  date: Date;
  venue: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  expectedGuests: number;
  privacy: "public" | "private";
  attendees?: Attendee[];
  quotations?: Quotation[];
  vendors?: VendorEvent[];
  reminders?: Reminder[];
  status: "draft" | "published" | "completed";
  createdAt: Date;
  updatedAt: Date;
  customQuestions?: {
    questionId: string;
    question: string;
    options?: string[]; 
    type?: "text" | "multiple-choice" | "boolean";
  }[];
  
}
