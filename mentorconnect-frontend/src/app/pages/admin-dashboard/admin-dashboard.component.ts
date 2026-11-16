import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, IdentityVerificationRequest, VerificationStatus, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="container">
        <!-- Admin Header -->
        <div class="admin-header">
          <div class="admin-header-title">
            <span class="admin-badge">Platform Governance & Audit System</span>
            <h1>Administrator Command Console</h1>
            <p>Manage identity verifications, user role governance, cross-domain integrity, and system health.</p>
          </div>
          <div class="admin-actions">
            <button (click)="loadData()" class="btn btn-secondary btn-sm">↻ Refresh Data</button>
          </div>
        </div>

        <div *ngIf="actionNotice" class="alert success-alert">{{ actionNotice }}</div>

        <!-- KPI Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">🛡️</div>
            <div class="metric-data">
              <span class="m-value">{{ pendingRequestsCount }} Pending</span>
              <span class="m-label">Verification Audit Queue</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-data">
              <span class="m-value">{{ stats?.total_users || 148 }}</span>
              <span class="m-label">Registered Accounts</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">✅</div>
            <div class="metric-data">
              <span class="m-value">{{ stats?.verification_metrics?.verified_percentage || 75.7 }}%</span>
              <span class="m-label">Verified Compliance Rate</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📂</div>
            <div class="metric-data">
              <span class="m-value">{{ stats?.mentorship_metrics?.active_workspaces || 32 }}</span>
              <span class="m-label">Active Study Workspaces</span>
            </div>
          </div>
        </div>

        <!-- Section 1: Verification Queue (Objective 1) -->
        <div class="card mb-5">
          <div class="card-header">
            <div>
              <h3>Identity Verification Audit Queue ({{ verificationRequests.length }})</h3>
              <p class="card-subtitle">Review institutional credentials and authenticate verified status.</p>
            </div>
            <span class="badge badge-gold">Immediate Review</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Role</th>
                    <th>Institution</th>
                    <th>Document Type</th>
                    <th>Identifier / Proof</th>
                    <th>Status</th>
                    <th>Audit Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let req of verificationRequests">
                    <td>
                      <div class="user-cell">
                        <img [src]="req.user_details?.username === 'alex_student' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'" class="table-avatar" />
                        <div>
                          <strong>{{ req.user_details?.full_name || req.institution_name }}</strong>
                          <span class="sub-email">{{ req.user_details?.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="role-pill" [ngClass]="'role-' + (req.user_details?.role || 'student').toLowerCase()">
                        {{ req.user_details?.role || 'STUDENT' }}
                      </span>
                    </td>
                    <td>{{ req.institution_name }}</td>
                    <td>
                      <span class="doc-pill">{{ req.document_type }}</span>
                    </td>
                    <td>
                      <code>{{ req.document_number_or_info }}</code>
                      <div *ngIf="req.notes" class="table-note">"{{ req.notes }}"</div>
                    </td>
                    <td>
                      <span class="status-pill" [ngClass]="req.status.toLowerCase()">
                        {{ req.status }}
                      </span>
                    </td>
                    <td>
                      <div *ngIf="req.status === 'PENDING'" class="table-actions">
                        <button (click)="approveVerification(req)" class="btn btn-primary btn-sm">
                          ✓ Approve
                        </button>
                        <button (click)="rejectVerification(req)" class="btn btn-secondary btn-sm">
                          ✕ Reject
                        </button>
                      </div>
                      <span *ngIf="req.status !== 'PENDING'" class="text-muted" style="font-size: 0.8rem;">
                        {{ req.status === 'APPROVED' ? 'Cleared & Verified' : 'Rejected' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Section 2: User Directory & Role Governance -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3>User Directory & Role Governance</h3>
              <p class="card-subtitle">All registered mentors, experts, students, and system admins.</p>
            </div>
            <div class="filter-mini">
              <select [(ngModel)]="roleFilter" (ngModelChange)="filterUsers()" class="mini-select">
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="MENTOR">Mentors</option>
                <option value="EXPERT">Experts</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Verification</th>
                    <th>Institution / Company</th>
                    <th>Domains</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of displayedUsers">
                    <td>
                      <div class="user-cell">
                        <img [src]="u.avatar_url" class="table-avatar" />
                        <div>
                          <strong>{{ u.first_name }} {{ u.last_name }}</strong>
                          <span class="sub-email">&#64;{{ u.username }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="role-pill" [ngClass]="'role-' + u.role.toLowerCase()">
                        {{ u.role }}
                      </span>
                    </td>
                    <td>
                      <span class="status-pill" [ngClass]="u.verification_status.toLowerCase()">
                        {{ u.verification_status }}
                      </span>
                    </td>
                    <td>{{ u.institution_or_company }}</td>
                    <td>
                      <div class="domain-pills-cell">
                        <span *ngFor="let d of u.domains" class="d-pill">{{ d }}</span>
                      </div>
                    </td>
                    <td>
                      <button (click)="toggleUserVerification(u)" class="btn btn-secondary btn-sm">
                        Toggle Verification
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 40px 0 70px;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .admin-badge {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--color-danger);
      background: rgba(192, 57, 43, 0.12);
      border: 1px solid var(--color-danger);
      padding: 3px 10px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-block;
      margin-bottom: 6px;
    }

    .admin-header h1 {
      font-size: 2.2rem;
      color: var(--color-forest);
      margin-bottom: 6px;
    }

    .admin-header p {
      font-size: 0.95rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    /* Metrics */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .metric-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
    }

    .metric-icon {
      font-size: 2rem;
      background: var(--color-cream);
      width: 52px;
      height: 52px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metric-data {
      display: flex;
      flex-direction: column;
    }

    .m-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--color-forest);
      line-height: 1.2;
    }

    .m-label {
      font-size: 0.78rem;
      color: var(--color-charcoal-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .card-subtitle {
      font-size: 0.85rem;
      color: var(--color-charcoal-muted);
      margin: 2px 0 0;
    }

    .p-0 { padding: 0 !important; }
    .mb-5 { margin-bottom: 40px; }

    /* Tables */
    .table-responsive {
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .admin-table th {
      background: var(--color-cream-light);
      padding: 14px 20px;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-forest);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--color-border);
    }

    .admin-table td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border-subtle);
      font-size: 0.88rem;
      vertical-align: middle;
    }

    .admin-table tr:hover {
      background: var(--color-cream-light);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .table-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--color-gold);
    }

    .sub-email {
      display: block;
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
    }

    .doc-pill {
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--color-cream);
      color: var(--color-forest);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--color-border);
    }

    .table-note {
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
      font-style: italic;
      margin-top: 4px;
    }

    .role-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .role-student { background: #E8F0FE; color: #1967D2; }
    .role-mentor { background: var(--color-forest-subtle); color: var(--color-forest); }
    .role-expert { background: var(--color-gold-subtle); color: #7A5C13; }
    .role-admin { background: #FFCDD2; color: #C62828; }

    .status-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .status-pill.pending { background: #FFE082; color: #795548; }
    .status-pill.approved, .status-pill.verified { background: #C8E6C9; color: #2E7D32; }
    .status-pill.rejected { background: #FFCDD2; color: #C62828; }
    .status-pill.unverified { background: #EEEEEE; color: #757575; }

    .table-actions {
      display: flex;
      gap: 8px;
    }

    .mini-select {
      padding: 6px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }

    .domain-pills-cell {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .d-pill {
      font-size: 0.7rem;
      background: var(--color-cream);
      color: var(--color-forest);
      padding: 1px 6px;
      border-radius: 3px;
    }

    .alert.success-alert {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  users: User[] = [];
  displayedUsers: User[] = [];
  roleFilter = 'ALL';

  verificationRequests: IdentityVerificationRequest[] = [
    {
      id: 1,
      document_type: 'STUDENT_ID',
      document_number_or_info: 'UCB-2027-891024',
      document_file_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      institution_name: 'University of California, Berkeley',
      notes: 'Spring 2026 Cal 1 card with active registration.',
      status: 'PENDING',
      submitted_at: '2026-11-16T10:00:00Z',
      user_details: {
        id: 2,
        username: 'alex_student',
        full_name: 'Alex Chen',
        email: 'alex.chen@berkeley.edu',
        role: 'STUDENT',
        current_verification_status: 'PENDING',
        institution_or_company: 'UC Berkeley'
      }
    },
    {
      id: 2,
      document_type: 'EMPLOYMENT_PROOF',
      document_number_or_info: 'BLK-CORP-ID-4421',
      document_file_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
      institution_name: 'BlackRock / Wharton School',
      notes: 'Corporate email audit & MBA diploma verification.',
      status: 'PENDING',
      submitted_at: '2026-11-16T08:30:00Z',
      user_details: {
        id: 6,
        username: 'jordan_finance',
        full_name: 'Jordan Lee',
        email: 'jordan.lee@wharton.upenn.edu',
        role: 'EXPERT',
        current_verification_status: 'PENDING',
        institution_or_company: 'BlackRock'
      }
    }
  ];

  actionNotice = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.authService.getAdminStats().subscribe(st => this.stats = st);
    this.authService.getUsers().subscribe(us => {
      this.users = us;
      this.filterUsers();
    });
  }

  get pendingRequestsCount(): number {
    return this.verificationRequests.filter(r => r.status === 'PENDING').length;
  }

  filterUsers(): void {
    if (this.roleFilter === 'ALL') {
      this.displayedUsers = [...this.users];
    } else {
      this.displayedUsers = this.users.filter(u => u.role === this.roleFilter);
    }
  }

  approveVerification(req: IdentityVerificationRequest): void {
    req.status = 'APPROVED';
    this.actionNotice = `Approved verification for ${req.user_details?.full_name || 'applicant'}! Status updated to VERIFIED.`;

    // Also update target user in directory
    this.users = this.users.map(u => {
      if (u.id === req.user_details?.id) {
        return { ...u, verification_status: 'VERIFIED' };
      }
      return u;
    });
    this.filterUsers();
    setTimeout(() => this.actionNotice = '', 4000);
  }

  rejectVerification(req: IdentityVerificationRequest): void {
    req.status = 'REJECTED';
    this.actionNotice = `Rejected verification for ${req.user_details?.full_name || 'applicant'}. Feedback note sent.`;
    this.users = this.users.map(u => {
      if (u.id === req.user_details?.id) {
        return { ...u, verification_status: 'REJECTED' };
      }
      return u;
    });
    this.filterUsers();
    setTimeout(() => this.actionNotice = '', 4000);
  }

  toggleUserVerification(user: User): void {
    const nextStatus: VerificationStatus = user.verification_status === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    user.verification_status = nextStatus;
    this.actionNotice = `Updated ${user.first_name} ${user.last_name}'s verification status to ${nextStatus}.`;
    setTimeout(() => this.actionNotice = '', 3000);
  }
}
