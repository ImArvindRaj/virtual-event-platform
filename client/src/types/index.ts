export interface User {
  _id: string;
  name: string;
  email: string;
  role: "host" | "attendee";
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  hostId: string; // MongoDB ObjectId as string
  scheduledAt: string;
  status: "upcoming" | "live" | "ended";
  agoraChannel: string;
  attendees?: string[]; // Array of user IDs
  maxAttendees?: number;
  organizer?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
