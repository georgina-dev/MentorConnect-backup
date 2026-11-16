export type UserRole = 'STUDENT' | 'MENTOR' | 'EXPERT' | 'ADMIN';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  verification_notes?: string;
  headline: string;
  bio: string;
  institution_or_company: string;
  degree_or_title: string;
  avatar_url: string;
  domains: string[];
  skills: string[];
  github_profile?: string;
  linkedin_profile?: string;
  portfolio_url?: string;
  years_of_experience?: number;
  rating?: number;
  total_reviews?: number;
  sessions_completed?: number;
  students_mentored?: number;
  is_available_for_mentorship?: boolean;
  hourly_rate?: number;
  created_at?: string;
}

export interface AuthResponse {
  message?: string;
  access: string;
  refresh: string;
  user: User;
}

export interface IdentityVerificationRequest {
  id: number;
  user?: number;
  user_details?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: UserRole;
    current_verification_status: VerificationStatus;
    institution_or_company: string;
  };
  document_type: string;
  document_number_or_info: string;
  document_file_url: string;
  institution_name: string;
  notes: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface MentorshipSession {
  id: number;
  mentor: User;
  mentee: User;
  topic: string;
  domain: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  meetingLink?: string;
  notes?: string;
  milestoneTitle?: string;
}

export interface MentorshipRequest {
  id: number;
  mentor: User;
  mentee: User;
  domain: string;
  message: string;
  goals: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface DiscussionChannel {
  id: string;
  name: string;
  domain: string;
  description: string;
  memberCount: number;
  isGeneral?: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  senderVerified: boolean;
  content: string;
  timestamp: string;
  codeSnippet?: string;
  channelId?: string;
  recipientId?: number;
}

export interface SharedWorkspace {
  id: string;
  title: string;
  domain: string;
  description: string;
  members: User[];
  activeTasks: { id: string; title: string; assignee: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE' }[];
  sharedNotes: string;
  createdAt: string;
}

export interface CuratedResource {
  id: number;
  title: string;
  domain: string;
  type: 'Guide' | 'Template' | 'Video' | 'Code Repository' | 'Research Paper';
  author: string;
  authorRole: UserRole;
  authorVerified: boolean;
  description: string;
  link: string;
  likes: number;
  tags: string[];
}
