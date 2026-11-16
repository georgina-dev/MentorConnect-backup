import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MentorshipRequest, MentorshipSession, User } from '../models/user.model';
import { AuthService } from './auth.service';

export interface CareerMilestone {
  id: string;
  domain: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  mentorFeedback?: string;
  category: 'Foundation' | 'System Architecture' | 'Professional Portfolio' | 'Interview Prep';
}

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private sessionsSubject = new BehaviorSubject<MentorshipSession[]>([
    {
      id: 101,
      mentor: {
        id: 3,
        username: 'maya_mentor',
        first_name: 'Maya',
        last_name: 'Patel',
        full_name: 'Maya Patel',
        role: 'MENTOR',
        verification_status: 'VERIFIED',
        headline: 'Senior Systems Engineer @ Stripe',
        institution_or_company: 'Stripe',
        degree_or_title: 'M.S. Software Engineering',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science', 'Distributed Systems'],
        skills: ['System Design', 'Django', 'Go'],
        email: 'maya.patel@alumni.cmu.edu',
        bio: ''
      },
      mentee: {
        id: 2,
        username: 'alex_student',
        first_name: 'Alex',
        last_name: 'Chen',
        full_name: 'Alex Chen',
        role: 'STUDENT',
        verification_status: 'PENDING',
        headline: 'CS Undergrad @ UC Berkeley',
        institution_or_company: 'UC Berkeley',
        degree_or_title: 'B.S. CS 2027',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science', 'AI'],
        skills: ['Python', 'Angular'],
        email: 'alex.chen@berkeley.edu',
        bio: ''
      },
      topic: 'Distributed Caching Strategies & Redis vs Memcached',
      domain: 'Computer Science',
      date: 'Tomorrow, 4:00 PM',
      time: '16:00 - 17:00 UTC',
      durationMinutes: 60,
      status: 'SCHEDULED',
      meetingLink: 'https://meet.mentorconnect.org/room/sys-cache-402',
      notes: 'Review LRU cache implementation and consistency models.',
      milestoneTitle: 'System Design: Tier 2 Caching Architecture'
    },
    {
      id: 102,
      mentor: {
        id: 4,
        username: 'dr_marcus',
        first_name: 'Dr. Marcus',
        last_name: 'Rossi',
        full_name: 'Dr. Marcus Rossi',
        role: 'EXPERT',
        verification_status: 'VERIFIED',
        headline: 'Principal AI Scientist @ DeepMind',
        institution_or_company: 'Oxford / DeepMind',
        degree_or_title: 'Ph.D. ML & Genomics',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        domains: ['Artificial Intelligence', 'Academic Research'],
        skills: ['Deep Learning', 'PyTorch'],
        email: 'marcus.rossi@oxford.ac.uk',
        bio: ''
      },
      mentee: {
        id: 2,
        username: 'alex_student',
        first_name: 'Alex',
        last_name: 'Chen',
        full_name: 'Alex Chen',
        role: 'STUDENT',
        verification_status: 'PENDING',
        headline: 'CS Undergrad @ UC Berkeley',
        institution_or_company: 'UC Berkeley',
        degree_or_title: 'B.S. CS 2027',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science', 'AI'],
        skills: ['Python', 'Angular'],
        email: 'alex.chen@berkeley.edu',
        bio: ''
      },
      topic: 'Attention Mechanisms & Transformer Latency Optimization',
      domain: 'Artificial Intelligence',
      date: 'Thursday, 2:30 PM',
      time: '14:30 - 15:15 UTC',
      durationMinutes: 45,
      status: 'SCHEDULED',
      meetingLink: 'https://meet.mentorconnect.org/room/ai-transformers-981',
      notes: 'Discuss FlashAttention kernels and kv-cache compression benchmarks.'
    }
  ]);
  public sessions$ = this.sessionsSubject.asObservable();

  private requestsSubject = new BehaviorSubject<MentorshipRequest[]>([
    {
      id: 201,
      mentor: {
        id: 3,
        username: 'maya_mentor',
        first_name: 'Maya',
        last_name: 'Patel',
        full_name: 'Maya Patel',
        role: 'MENTOR',
        verification_status: 'VERIFIED',
        headline: 'Senior Systems Engineer @ Stripe',
        institution_or_company: 'Stripe',
        degree_or_title: 'M.S. Software Engineering',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science'],
        skills: ['System Design'],
        email: 'maya@example.com',
        bio: ''
      },
      mentee: {
        id: 2,
        username: 'alex_student',
        first_name: 'Alex',
        last_name: 'Chen',
        full_name: 'Alex Chen',
        role: 'STUDENT',
        verification_status: 'PENDING',
        headline: 'Junior CS @ UC Berkeley',
        institution_or_company: 'UC Berkeley',
        degree_or_title: 'B.S. CS',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science'],
        skills: ['Python'],
        email: 'alex@example.com',
        bio: ''
      },
      domain: 'Computer Science',
      message: 'Hi Maya, I loved your write-up on high-throughput database sharding. I am preparing for my backend internship interviews and would value your guidance on distributed consensus!',
      goals: 'Master Raft/Paxos fundamentals and mock architectural interviews.',
      status: 'ACCEPTED',
      createdAt: '2 days ago'
    },
    {
      id: 202,
      mentor: {
        id: 3,
        username: 'maya_mentor',
        first_name: 'Maya',
        last_name: 'Patel',
        full_name: 'Maya Patel',
        role: 'MENTOR',
        verification_status: 'VERIFIED',
        headline: 'Senior Systems Engineer',
        institution_or_company: 'Stripe',
        degree_or_title: 'M.S. CMU',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science'],
        skills: [],
        email: '',
        bio: ''
      },
      mentee: {
        id: 5,
        username: 'devon_wong',
        first_name: 'Devon',
        last_name: 'Wong',
        full_name: 'Devon Wong',
        role: 'STUDENT',
        verification_status: 'VERIFIED',
        headline: 'Sophomore CS Student @ Cornell',
        institution_or_company: 'Cornell University',
        degree_or_title: 'B.S. CS',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        domains: ['Computer Science', 'Distributed Systems'],
        skills: ['C++', 'Rust', 'Linux'],
        email: 'devon.w@cornell.edu',
        bio: ''
      },
      domain: 'Distributed Systems',
      message: 'Seeking mentorship for concurrent programming in Go and preparing a portfolio project on distributed key-value storage.',
      goals: 'Complete production-grade Raft storage engine.',
      status: 'PENDING',
      createdAt: '4 hours ago'
    }
  ]);
  public requests$ = this.requestsSubject.asObservable();

  private milestonesSubject = new BehaviorSubject<CareerMilestone[]>([
    {
      id: 'm1',
      domain: 'Computer Science',
      title: 'Foundational Data Structures & Algorithmic Complexity',
      description: 'Implement AVL trees, Red-Black balancing, and Trie prefix graphs with rigorous complexity bounds.',
      completed: true,
      dueDate: 'Nov 10, 2026',
      mentorFeedback: 'Excellent complexity proofs and clean modular code!',
      category: 'Foundation'
    },
    {
      id: 'm2',
      domain: 'Computer Science',
      title: 'Distributed System Design: Sharding & Replication',
      description: 'Design a scalable multi-region URL shortening and analytics pipeline handling 100K write QPS.',
      completed: true,
      dueDate: 'Nov 14, 2026',
      mentorFeedback: 'Great separation of write master vs read replicas.',
      category: 'System Architecture'
    },
    {
      id: 'm3',
      domain: 'Computer Science',
      title: 'Production Full-Stack Application Deployment',
      description: 'Deploy containerized Angular + Django + PostgreSQL stack with SSL, JWT auth, and database connection pooling.',
      completed: false,
      dueDate: 'Nov 25, 2026',
      category: 'Professional Portfolio'
    },
    {
      id: 'm4',
      domain: 'Career Navigation',
      title: 'Technical Whiteboard Mock Interview & Resume Audit',
      description: 'Complete 2 mock technical screenings with a verified senior mentor focusing on communication and edge cases.',
      completed: false,
      dueDate: 'Dec 02, 2026',
      category: 'Interview Prep'
    }
  ]);
  public milestones$ = this.milestonesSubject.asObservable();

  constructor(private authService: AuthService) {}

  scheduleSession(session: Partial<MentorshipSession>): Observable<MentorshipSession> {
    const current = this.sessionsSubject.value;
    const newSession: MentorshipSession = {
      id: Math.floor(Math.random() * 1000) + 300,
      mentor: session.mentor || current[0].mentor,
      mentee: session.mentee || (this.authService.currentUser || current[0].mentee),
      topic: session.topic || 'Mentorship 1-on-1 Session',
      domain: session.domain || 'Computer Science',
      date: session.date || 'Upcoming Monday, 3:00 PM',
      time: session.time || '15:00 UTC',
      durationMinutes: session.durationMinutes || 45,
      status: 'SCHEDULED',
      meetingLink: `https://meet.mentorconnect.org/room/mc-${Date.now().toString().slice(-4)}`,
      notes: session.notes || ''
    };
    this.sessionsSubject.next([newSession, ...current]);
    return of(newSession);
  }

  sendMentorshipRequest(mentor: User, domain: string, message: string, goals: string): Observable<MentorshipRequest> {
    const current = this.requestsSubject.value;
    const currentUser = this.authService.currentUser || {
      id: 99,
      username: 'guest_user',
      first_name: 'Guest',
      last_name: 'User',
      role: 'STUDENT',
      verification_status: 'UNVERIFIED',
      headline: 'Aspiring Mentee',
      institution_or_company: 'Independent',
      degree_or_title: 'Student',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      domains: [domain],
      skills: [],
      email: '',
      bio: ''
    };

    const newReq: MentorshipRequest = {
      id: Math.floor(Math.random() * 1000) + 400,
      mentor,
      mentee: currentUser,
      domain,
      message,
      goals,
      status: 'PENDING',
      createdAt: 'Just now'
    };

    this.requestsSubject.next([newReq, ...current]);
    return of(newReq);
  }

  respondToRequest(requestId: number, action: 'ACCEPTED' | 'DECLINED'): Observable<boolean> {
    const current = this.requestsSubject.value.map(req => {
      if (req.id === requestId) {
        return { ...req, status: action };
      }
      return req;
    });
    this.requestsSubject.next(current);
    return of(true);
  }

  toggleMilestone(milestoneId: string): void {
    const current = this.milestonesSubject.value.map(m => {
      if (m.id === milestoneId) {
        return { ...m, completed: !m.completed };
      }
      return m;
    });
    this.milestonesSubject.next(current);
  }
}
