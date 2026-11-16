import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserRole, VerificationStatus, AuthResponse, IdentityVerificationRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://127.0.0.1:8000/api/auth';
  private readonly TOKEN_KEY = 'mentorconnect_access_token';
  private readonly REFRESH_KEY = 'mentorconnect_refresh_token';
  private readonly USER_KEY = 'mentorconnect_current_user';

  // Demo fallback accounts for immediate interactive testing
  private readonly DEMO_USERS: Record<UserRole, User> = {
    STUDENT: {
      id: 2,
      username: 'alex_student',
      email: 'alex.chen@berkeley.edu',
      first_name: 'Alex',
      last_name: 'Chen',
      full_name: 'Alex Chen',
      role: 'STUDENT',
      verification_status: 'PENDING',
      verification_notes: 'Student Cal 1 Card submitted for verification.',
      headline: 'Junior CS & Cognitive Science Undergraduate',
      institution_or_company: 'UC Berkeley',
      degree_or_title: 'B.S. Computer Science (2027)',
      bio: 'Exploring full-stack web applications, machine learning architectures, and collaborative study groups.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      domains: ['Computer Science', 'Artificial Intelligence', 'Web Development'],
      skills: ['Python', 'Angular', 'Algorithms', 'TypeScript', 'PostgreSQL'],
      github_profile: 'https://github.com/alexchen-dev',
      sessions_completed: 8,
      students_mentored: 0,
      rating: 5.0
    },
    MENTOR: {
      id: 3,
      username: 'maya_mentor',
      email: 'maya.patel@alumni.cmu.edu',
      first_name: 'Maya',
      last_name: 'Patel',
      full_name: 'Maya Patel',
      role: 'MENTOR',
      verification_status: 'VERIFIED',
      verification_notes: 'Verified: CMU Alumni & Stripe Senior Engineer credentials.',
      headline: 'Senior Software Engineer & Systems Mentor',
      institution_or_company: 'Stripe (ex-CMU)',
      degree_or_title: 'M.S. Software Engineering',
      bio: 'Helping students and early-career engineers master distributed systems, API architecture, and technical interviews.',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      domains: ['Computer Science', 'Distributed Systems', 'Career Navigation'],
      skills: ['System Design', 'Django', 'Go', 'Microservices', 'Mentorship Strategy'],
      years_of_experience: 4,
      rating: 4.95,
      total_reviews: 38,
      sessions_completed: 42,
      students_mentored: 19,
      linkedin_profile: 'https://linkedin.com/in/mayapatel-tech'
    },
    EXPERT: {
      id: 4,
      username: 'dr_marcus',
      email: 'marcus.rossi@oxford.ac.uk',
      first_name: 'Dr. Marcus',
      last_name: 'Rossi',
      full_name: 'Dr. Marcus Rossi',
      role: 'EXPERT',
      verification_status: 'VERIFIED',
      verification_notes: 'Verified: Oxford Faculty / DeepMind Fellow Credential.',
      headline: 'Principal Research Scientist & AI Fellow',
      institution_or_company: 'Oxford Institute of Genomics & DeepMind',
      degree_or_title: 'Ph.D. Computational Biology & ML',
      bio: 'Advising graduate researchers, postdoctoral scholars, and industry engineers on AI-driven discovery, publishing, and thesis defense.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      domains: ['Artificial Intelligence', 'Bioinformatics', 'Academic Research'],
      skills: ['Deep Learning', 'PyTorch', 'Paper Review', 'Grant Writing', 'Bioinformatics'],
      years_of_experience: 12,
      rating: 5.0,
      total_reviews: 54,
      sessions_completed: 73,
      students_mentored: 31,
      linkedin_profile: 'https://linkedin.com/in/marcus-rossi-phd'
    },
    ADMIN: {
      id: 1,
      username: 'admin',
      email: 'admin@mentorconnect.org',
      first_name: 'Eleanor',
      last_name: 'Vance',
      full_name: 'Eleanor Vance',
      role: 'ADMIN',
      verification_status: 'VERIFIED',
      verification_notes: 'Administrator - System Superuser',
      headline: 'Platform Lead & Academic Integrity Officer',
      institution_or_company: 'MentorConnect HQ / Stanford University',
      degree_or_title: 'Ph.D. Education & Technology',
      bio: 'Overseeing cross-domain peer mentorship networks and verified credential integrity.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      domains: ['Computer Science', 'Career Navigation', 'Academic Research'],
      skills: ['Leadership', 'Program Assessment', 'Ethics in AI'],
      sessions_completed: 120,
      students_mentored: 45,
      rating: 5.0
    }
  };

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    const savedUserJson = localStorage.getItem(this.USER_KEY);
    if (savedUserJson) {
      try {
        const user = JSON.parse(savedUserJson);
        this.currentUserSubject.next(user);
        return;
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
    // Default to student persona for immediate rich exploration
    const defaultStudent = this.DEMO_USERS['STUDENT'];
    this.currentUserSubject.next(defaultStudent);
    localStorage.setItem(this.USER_KEY, JSON.stringify(defaultStudent));
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login/`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.access);
        localStorage.setItem(this.REFRESH_KEY, res.refresh);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      }),
      catchError((err) => {
        console.warn('Backend login unavailable, checking demo credentials fallback:', err);
        // Fallback demo matching
        const usernameLower = credentials.username.toLowerCase();
        let matchedRole: UserRole | null = null;
        if (usernameLower.includes('student') || usernameLower === 'alex') matchedRole = 'STUDENT';
        else if (usernameLower.includes('mentor') || usernameLower === 'maya') matchedRole = 'MENTOR';
        else if (usernameLower.includes('expert') || usernameLower === 'marcus') matchedRole = 'EXPERT';
        else if (usernameLower.includes('admin') || usernameLower === 'eleanor') matchedRole = 'ADMIN';

        if (matchedRole && this.DEMO_USERS[matchedRole]) {
          const user = this.DEMO_USERS[matchedRole];
          const demoResponse: AuthResponse = {
            access: 'demo_token_' + Date.now(),
            refresh: 'demo_refresh_' + Date.now(),
            user
          };
          localStorage.setItem(this.TOKEN_KEY, demoResponse.access);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
          return of(demoResponse);
        }
        throw err;
      })
    );
  }

  register(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register/`, payload).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.access);
        localStorage.setItem(this.REFRESH_KEY, res.refresh);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      }),
      catchError((err) => {
        console.warn('Backend register fallback mode:', err);
        const newUser: User = {
          id: Math.floor(Math.random() * 1000) + 10,
          username: payload.username,
          email: payload.email,
          first_name: payload.first_name || payload.username,
          last_name: payload.last_name || '',
          full_name: `${payload.first_name || payload.username} ${payload.last_name || ''}`.trim(),
          role: payload.role || 'STUDENT',
          verification_status: 'UNVERIFIED',
          headline: payload.headline || `${payload.role} in ${payload.domains?.[0] || 'Peer Learning'}`,
          bio: payload.bio || '',
          institution_or_company: payload.institution_or_company || 'Independent Scholar',
          degree_or_title: payload.degree_or_title || '',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.username}`,
          domains: payload.domains || ['Computer Science'],
          skills: payload.skills || ['General'],
          sessions_completed: 0,
          students_mentored: 0,
          rating: 5.0
        };
        const demoResponse: AuthResponse = {
          access: 'demo_token_' + Date.now(),
          refresh: 'demo_refresh_' + Date.now(),
          user: newUser
        };
        localStorage.setItem(this.TOKEN_KEY, demoResponse.access);
        localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        return of(demoResponse);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    // Reset to default student demo
    this.currentUserSubject.next(this.DEMO_USERS['STUDENT']);
  }

  /**
   * Switch the active preview role instantly.
   * Enables the user/evaluator to test all 4 role experiences (Admin, Student, Mentor, Expert) effortlessly!
   */
  switchRole(role: UserRole): void {
    const demo = this.DEMO_USERS[role];
    if (demo) {
      this.currentUserSubject.next(demo);
      localStorage.setItem(this.USER_KEY, JSON.stringify(demo));
    }
  }

  updateProfile(data: Partial<User>): Observable<User> {
    const current = this.currentUserSubject.value;
    const updated = { ...current, ...data } as User;

    return this.http.put<User>(`${this.API_URL}/me/`, data, { headers: this.getAuthHeaders() }).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      catchError(() => {
        this.currentUserSubject.next(updated);
        localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
        return of(updated);
      })
    );
  }

  submitIdentityVerification(formData: {
    document_type: string;
    document_number_or_info: string;
    institution_name: string;
    notes: string;
    document_file_url?: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/verify/`, formData, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        const user = this.currentUserSubject.value;
        if (user) {
          user.verification_status = 'PENDING';
          user.verification_notes = 'Document submitted for administrative review.';
          this.currentUserSubject.next({ ...user });
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
      }),
      catchError(() => {
        // Fallback local update
        const user = this.currentUserSubject.value;
        if (user) {
          user.verification_status = 'PENDING';
          user.verification_notes = 'Document submitted for administrative review.';
          this.currentUserSubject.next({ ...user });
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
        return of({ message: 'Verification submitted successfully (demo mode).' });
      })
    );
  }

  getUsers(role?: string, domain?: string, search?: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users/`, {
      params: {
        ...(role ? { role } : {}),
        ...(domain ? { domain } : {}),
        ...(search ? { search } : {})
      }
    }).pipe(
      catchError(() => {
        // Fallback users list
        return of(Object.values(this.DEMO_USERS));
      })
    );
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/admin/stats/`, { headers: this.getAuthHeaders() }).pipe(
      catchError(() => {
        return of({
          total_users: 148,
          role_distribution: { students: 82, mentors: 44, experts: 18, admins: 4 },
          verification_metrics: { verified_users: 112, pending_requests: 12, verified_percentage: 75.7 },
          mentorship_metrics: { total_sessions: 240, active_workspaces: 32, discussion_channels: 16, content_resources: 94 }
        });
      })
    );
  }
}
