import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MentorshipService, CareerMilestone } from '../../services/mentorship.service';
import { CollaborationService } from '../../services/collaboration.service';
import { ContentService } from '../../services/content.service';
import { User, UserRole, MentorshipSession, MentorshipRequest, SharedWorkspace } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <!-- Interactive Role Switcher Banner -->
        <div class="role-preview-bar">
          <div class="preview-bar-left">
            <span class="preview-pill">Role-Adapted Dashboard View</span>
            <span class="preview-text">Currently experiencing dashboard as: <strong>{{ currentUser?.role }}</strong></span>
          </div>
          <div class="preview-role-buttons">
            <button
              (click)="switchRole('STUDENT')"
              class="preview-btn"
              [class.active]="currentUser?.role === 'STUDENT'"
            >
              🎓 Student View
            </button>
            <button
              (click)="switchRole('MENTOR')"
              class="preview-btn"
              [class.active]="currentUser?.role === 'MENTOR'"
            >
              🌱 Mentor View
            </button>
            <button
              (click)="switchRole('EXPERT')"
              class="preview-btn"
              [class.active]="currentUser?.role === 'EXPERT'"
            >
              ⭐ Expert View
            </button>
            <button
              (click)="switchRole('ADMIN')"
              class="preview-btn"
              [class.active]="currentUser?.role === 'ADMIN'"
            >
              🛡️ Admin View
            </button>
          </div>
        </div>

        <!-- Dashboard Header Welcome -->
        <div class="dashboard-header-card">
          <div class="header-user-profile">
            <img [src]="currentUser?.avatar_url" [alt]="currentUser?.first_name" class="header-avatar" />
            <div>
              <div class="header-title-row">
                <h2>Welcome back, {{ currentUser?.first_name }} {{ currentUser?.last_name }}!</h2>
                <!-- Verification Status Pill -->
                <span *ngIf="currentUser?.verification_status === 'VERIFIED'" class="badge badge-verified">
                  ✓ Verified Identity
                </span>
                <span *ngIf="currentUser?.verification_status === 'PENDING'" class="badge badge-pending">
                  ⏳ Verification In Review
                </span>
                <span *ngIf="currentUser?.verification_status === 'UNVERIFIED'" class="badge badge-unverified">
                  ⚠ Unverified Identity
                </span>
              </div>
              <p class="header-subtext">
                {{ currentUser?.headline }} • <strong>{{ currentUser?.institution_or_company }}</strong>
              </p>
            </div>
          </div>

          <div class="header-actions">
            <a routerLink="/messages" class="btn btn-primary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Open Workspaces & Chat
            </a>
            <a routerLink="/profile" class="btn btn-secondary btn-sm">Edit Profile</a>
          </div>
        </div>

        <!-- Verification Notice if Pending or Unverified -->
        <div *ngIf="currentUser?.verification_status === 'UNVERIFIED'" class="verification-prompt-banner">
          <div class="v-prompt-icon">🛡️</div>
          <div class="v-prompt-body">
            <h4>Verify Your Identity to Unlock All Platform Privileges</h4>
            <p>Upload a photo of your Student ID card or institutional credential (.edu) to earn the verified badge and request private mentorship sessions.</p>
          </div>
          <a routerLink="/profile" class="btn btn-gold btn-sm">Submit Verification ID</a>
        </div>

        <!-- ===================================================================
             1. STUDENT (MENTEE) DASHBOARD VIEW
             =================================================================== -->
        <div *ngIf="currentUser?.role === 'STUDENT'" class="role-dashboard student-view">
          <!-- Top Metric Cards -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">🎯</div>
              <div class="metric-data">
                <span class="m-value">75%</span>
                <span class="m-label">Current Milestone Progress</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">🌱</div>
              <div class="metric-data">
                <span class="m-value">2 Active</span>
                <span class="m-label">Verified Mentors</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📅</div>
              <div class="metric-data">
                <span class="m-value">Tomorrow</span>
                <span class="m-label">Next 1-on-1 Session</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">🚀</div>
              <div class="metric-data">
                <span class="m-value">2 Labs</span>
                <span class="m-label">Enrolled Workspaces</span>
              </div>
            </div>
          </div>

          <div class="dashboard-columns-grid">
            <!-- Left Column: Upcoming Sessions & Active Mentors -->
            <div class="dash-col main-col">
              <!-- Upcoming Sessions Card -->
              <div class="card mb-4">
                <div class="card-header">
                  <h3>Upcoming 1-on-1 Mentorship Sessions</h3>
                  <a routerLink="/mentorship" class="header-link">View All Sessions →</a>
                </div>
                <div class="card-body">
                  <div *ngFor="let s of sessions" class="session-item-card">
                    <img [src]="s.mentor.avatar_url" [alt]="s.mentor.first_name" class="mentor-sm-avatar" />
                    <div class="session-details">
                      <div class="session-top">
                        <span class="session-topic">{{ s.topic }}</span>
                        <span class="session-time-pill">{{ s.date }}</span>
                      </div>
                      <p class="session-mentor-desc">
                        With <strong>{{ s.mentor.first_name }} {{ s.mentor.last_name }}</strong> ({{ s.mentor.headline }})
                      </p>
                      <div class="session-footer">
                        <span class="domain-tag">{{ s.domain }}</span>
                        <a [href]="s.meetingLink" target="_blank" class="btn btn-primary btn-sm">
                          Join Meeting Room
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Continuous Learning: Career Progression Milestones (Objective 4) -->
              <div class="card">
                <div class="card-header">
                  <h3>Career Progression & Milestone Tracker</h3>
                  <span class="milestone-counter">2 of 4 Completed</span>
                </div>
                <div class="card-body">
                  <p class="section-hint">
                    Milestones represent structured competency checkpoints verified by your peer mentors and domain experts.
                  </p>
                  <div class="milestones-checklist">
                    <div
                      *ngFor="let m of milestones"
                      class="milestone-row"
                      [class.done]="m.completed"
                      (click)="toggleMilestone(m.id)"
                    >
                      <div class="check-box" [class.checked]="m.completed">
                        <span *ngIf="m.completed">✓</span>
                      </div>
                      <div class="milestone-content">
                        <div class="m-header">
                          <span class="m-title">{{ m.title }}</span>
                          <span class="category-pill">{{ m.category }}</span>
                        </div>
                        <p class="m-desc">{{ m.description }}</p>
                        <div *ngIf="m.mentorFeedback" class="mentor-feedback-quote">
                          💬 <em>Mentor Feedback: "{{ m.mentorFeedback }}"</em>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: AI Match Recommendations & Workspaces -->
            <div class="dash-col side-col">
              <!-- AI Recommendation Teaser Card -->
              <div class="card ai-card mb-4">
                <div class="ai-header">
                  <span class="ai-sparkle">✨ Intelligent Match System</span>
                  <h4>Recommended Peer Mentors</h4>
                  <p>Matches generated based on your System Design and Distributed Systems focus.</p>
                </div>
                <div class="ai-mentors-list">
                  <div class="ai-mentor-item">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80" alt="Maya Patel" class="ai-avatar" />
                    <div>
                      <div class="ai-mentor-name">
                        Maya Patel <span class="badge badge-verified">✓ Verified</span>
                      </div>
                      <span class="ai-match-score">98% Match • Distributed Systems</span>
                      <a routerLink="/mentorship" class="ai-action-link">Request Mentorship →</a>
                    </div>
                  </div>

                  <div class="ai-mentor-item">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" alt="Dr. Marcus" class="ai-avatar" />
                    <div>
                      <div class="ai-mentor-name">
                        Dr. Marcus Rossi <span class="badge badge-verified">✓ Verified</span>
                      </div>
                      <span class="ai-match-score">94% Match • Deep Learning</span>
                      <a routerLink="/mentorship" class="ai-action-link">Request Mentorship →</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Shared Study Workspaces (Objective 3) -->
              <div class="card">
                <div class="card-header">
                  <h3>Active Study Workspaces</h3>
                  <a routerLink="/messages" class="header-link">Open →</a>
                </div>
                <div class="card-body">
                  <div *ngFor="let ws of workspaces" class="workspace-dash-item">
                    <h5>{{ ws.title }}</h5>
                    <p class="ws-domain">{{ ws.domain }} • {{ ws.activeTasks.length }} tasks</p>
                    <a routerLink="/messages" class="btn btn-secondary btn-sm btn-block">Enter Workspace</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             2. MENTOR DASHBOARD VIEW
             =================================================================== -->
        <div *ngIf="currentUser?.role === 'MENTOR'" class="role-dashboard mentor-view">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">⭐</div>
              <div class="metric-data">
                <span class="m-value">4.95 / 5.0</span>
                <span class="m-label">Mentorship Rating (38 reviews)</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">👥</div>
              <div class="metric-data">
                <span class="m-value">19 Students</span>
                <span class="m-label">Total Mentees Guided</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">⏱️</div>
              <div class="metric-data">
                <span class="m-value">42 Hours</span>
                <span class="m-label">Peer Mentorship Logged</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📬</div>
              <div class="metric-data">
                <span class="m-value">1 Pending</span>
                <span class="m-label">Mentorship Requests</span>
              </div>
            </div>
          </div>

          <div class="dashboard-columns-grid">
            <div class="dash-col main-col">
              <!-- Pending Mentorship Requests (with Accept / Decline) -->
              <div class="card mb-4">
                <div class="card-header">
                  <h3>Pending Mentorship Inquiries</h3>
                  <span class="badge badge-gold">Action Required</span>
                </div>
                <div class="card-body">
                  <div *ngFor="let req of requests" class="request-item-card">
                    <div class="request-header">
                      <div class="mentee-info">
                        <img [src]="req.mentee.avatar_url" [alt]="req.mentee.first_name" class="mentor-sm-avatar" />
                        <div>
                          <strong>{{ req.mentee.first_name }} {{ req.mentee.last_name }}</strong>
                          <span class="mentee-inst">({{ req.mentee.institution_or_company }})</span>
                          <span class="domain-tag">{{ req.domain }}</span>
                        </div>
                      </div>
                      <span class="req-status-pill" [ngClass]="req.status.toLowerCase()">{{ req.status }}</span>
                    </div>

                    <p class="request-msg">"{{ req.message }}"</p>
                    <p class="request-goals">🎯 Target Goal: {{ req.goals }}</p>

                    <div *ngIf="req.status === 'PENDING'" class="request-actions">
                      <button (click)="acceptRequest(req.id)" class="btn btn-primary btn-sm">Accept Mentee</button>
                      <button (click)="declineRequest(req.id)" class="btn btn-secondary btn-sm">Decline</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Scheduled Teaching Sessions -->
              <div class="card">
                <div class="card-header">
                  <h3>Your Scheduled Mentoring Calendar</h3>
                  <a routerLink="/mentorship" class="header-link">Manage Availability →</a>
                </div>
                <div class="card-body">
                  <div *ngFor="let s of sessions" class="session-item-card">
                    <img [src]="s.mentee.avatar_url" [alt]="s.mentee.first_name" class="mentor-sm-avatar" />
                    <div class="session-details">
                      <div class="session-top">
                        <span class="session-topic">{{ s.topic }}</span>
                        <span class="session-time-pill">{{ s.date }}</span>
                      </div>
                      <p class="session-mentor-desc">
                        Mentee: <strong>{{ s.mentee.first_name }} {{ s.mentee.last_name }}</strong> • {{ s.mentee.institution_or_company }}
                      </p>
                      <div class="session-footer">
                        <span class="domain-tag">{{ s.domain }}</span>
                        <a [href]="s.meetingLink" target="_blank" class="btn btn-primary btn-sm">
                          Start Session
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mentor Right Side -->
            <div class="dash-col side-col">
              <div class="card mb-4">
                <div class="card-header">
                  <h3>Lead a Study Workspace</h3>
                </div>
                <div class="card-body">
                  <p class="text-muted" style="font-size: 0.88rem; margin-bottom: 14px;">
                    Create a shared workspace to coordinate reading groups, coding sprints, or interview preparation cohorts.
                  </p>
                  <a routerLink="/messages" class="btn btn-sage btn-block">Launch New Workspace</a>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h3>Share Educational Content</h3>
                </div>
                <div class="card-body">
                  <p class="text-muted" style="font-size: 0.88rem; margin-bottom: 14px;">
                    Publish architectural diagrams, interview cheat sheets, or code samples for the community.
                  </p>
                  <a routerLink="/explore" class="btn btn-gold btn-block">Contribute Resource</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             3. EXPERT DASHBOARD VIEW
             =================================================================== -->
        <div *ngIf="currentUser?.role === 'EXPERT'" class="role-dashboard expert-view">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">🏆</div>
              <div class="metric-data">
                <span class="m-value">12 Years</span>
                <span class="m-label">Domain Expertise</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">🔬</div>
              <div class="metric-data">
                <span class="m-value">73</span>
                <span class="m-label">Advisory Consultations</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📑</div>
              <div class="metric-data">
                <span class="m-value">14 Papers</span>
                <span class="m-label">Reviewed for Mentees</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">🌐</div>
              <div class="metric-data">
                <span class="m-value">Global</span>
                <span class="m-label">Cross-Institutional Network</span>
              </div>
            </div>
          </div>

          <div class="dashboard-columns-grid">
            <div class="dash-col main-col">
              <div class="card mb-4">
                <div class="card-header">
                  <h3>High-Impact Consultations & Advisory Sessions</h3>
                  <span class="badge badge-gold">Expert Level</span>
                </div>
                <div class="card-body">
                  <div *ngFor="let s of sessions" class="session-item-card">
                    <img [src]="s.mentee.avatar_url" [alt]="s.mentee.first_name" class="mentor-sm-avatar" />
                    <div class="session-details">
                      <div class="session-top">
                        <span class="session-topic">{{ s.topic }}</span>
                        <span class="session-time-pill">{{ s.date }}</span>
                      </div>
                      <p class="session-mentor-desc">
                        Advisee: <strong>{{ s.mentee.first_name }} {{ s.mentee.last_name }}</strong> • Research Topic: Attention optimization
                      </p>
                      <div class="session-footer">
                        <span class="domain-tag">{{ s.domain }}</span>
                        <a [href]="s.meetingLink" target="_blank" class="btn btn-gold btn-sm">Enter Advisory Room</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="dash-col side-col">
              <div class="card">
                <div class="card-header">
                  <h3>Masterclass & Research Sprints</h3>
                </div>
                <div class="card-body">
                  <p class="text-muted" style="font-size: 0.88rem; margin-bottom: 14px;">
                    Schedule open symposiums, publish pre-prints, or mentor top graduate students across institutions.
                  </p>
                  <a routerLink="/messages" class="btn btn-primary btn-block">Host Expert Discussion</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             4. ADMIN DASHBOARD VIEW (Preview & Quick Actions)
             =================================================================== -->
        <div *ngIf="currentUser?.role === 'ADMIN'" class="role-dashboard admin-view">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">🛡️</div>
              <div class="metric-data">
                <span class="m-value">2 Pending</span>
                <span class="m-label">Identity Verifications Queue</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">👥</div>
              <div class="metric-data">
                <span class="m-value">148 Total</span>
                <span class="m-label">Registered Accounts</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">💼</div>
              <div class="metric-data">
                <span class="m-value">32 Active</span>
                <span class="m-label">Collaborative Workspaces</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">✅</div>
              <div class="metric-data">
                <span class="m-value">98.4%</span>
                <span class="m-label">Audit Compliance</span>
              </div>
            </div>
          </div>

          <div class="admin-action-card">
            <div class="admin-callout">
              <h3>Administrative Governance Console</h3>
              <p>You have administrative authority to review identity verification submissions, moderate discussion channels, and audit domain content.</p>
            </div>
            <a routerLink="/admin-dashboard" class="btn btn-gold btn-lg">Open Full Admin Dashboard →</a>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 30px 0 60px;
    }

    /* Role Switcher Bar */
    .role-preview-bar {
      background: var(--color-forest-dark);
      color: var(--color-white);
      padding: 12px 20px;
      border-radius: var(--radius-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 14px;
      border: 1px solid var(--color-gold);
      box-shadow: var(--shadow-md);
    }

    .preview-bar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .preview-pill {
      background: var(--color-gold);
      color: var(--color-forest-dark);
      font-size: 0.72rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .preview-text {
      font-size: 0.9rem;
    }

    .preview-role-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .preview-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--color-white);
      padding: 6px 12px;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .preview-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .preview-btn.active {
      background: var(--color-gold);
      color: var(--color-forest-dark);
      border-color: var(--color-gold);
      box-shadow: 0 2px 8px rgba(197, 164, 93, 0.4);
    }

    /* Header Profile */
    .dashboard-header-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-user-profile {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .header-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .header-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .header-title-row h2 {
      font-size: 1.6rem;
      color: var(--color-forest);
      margin: 0;
    }

    .header-subtext {
      font-size: 0.92rem;
      color: var(--color-charcoal-muted);
      margin-top: 4px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    /* Verification Prompt Banner */
    .verification-prompt-banner {
      background: #FFF8E1;
      border: 1.5px solid #FFE082;
      border-radius: var(--radius-md);
      padding: 18px 24px;
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }

    .v-prompt-icon {
      font-size: 2rem;
    }

    .v-prompt-body {
      flex: 1;
    }

    .v-prompt-body h4 {
      font-size: 1.05rem;
      color: #795548;
      margin-bottom: 4px;
    }

    .v-prompt-body p {
      font-size: 0.88rem;
      color: #5D4037;
      margin: 0;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 28px;
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
      width: 50px;
      height: 50px;
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
      font-size: 1.35rem;
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

    /* Layout Columns */
    .dashboard-columns-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 24px;
    }

    .mb-4 {
      margin-bottom: 24px;
    }

    .header-link {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-gold);
    }

    .session-item-card {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: var(--color-cream-light);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      margin-bottom: 12px;
    }

    .session-item-card:last-child {
      margin-bottom: 0;
    }

    .mentor-sm-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .session-details {
      flex: 1;
    }

    .session-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
    }

    .session-topic {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-forest);
    }

    .session-time-pill {
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--color-gold-subtle);
      color: #7A5C13;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .session-mentor-desc {
      font-size: 0.85rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 10px;
    }

    .session-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .domain-tag {
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--color-forest-subtle);
      color: var(--color-forest);
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Milestones Checklist */
    .section-hint {
      font-size: 0.85rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 16px;
    }

    .milestone-counter {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-gold);
      background: var(--color-gold-subtle);
      padding: 3px 8px;
      border-radius: 4px;
    }

    .milestones-checklist {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .milestone-row {
      display: flex;
      gap: 14px;
      padding: 14px;
      background: var(--color-cream-light);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .milestone-row:hover {
      border-color: var(--color-forest);
    }

    .milestone-row.done {
      background: #F4FBF4;
      border-color: var(--color-sage);
    }

    .check-box {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      border: 2px solid var(--color-forest);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--color-white);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .check-box.checked {
      background: var(--color-forest);
    }

    .milestone-content {
      flex: 1;
    }

    .m-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .m-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-forest);
    }

    .milestone-row.done .m-title {
      text-decoration: line-through;
      color: var(--color-charcoal-muted);
    }

    .category-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      background: var(--color-white);
      color: var(--color-charcoal-muted);
      border: 1px solid var(--color-border);
    }

    .m-desc {
      font-size: 0.85rem;
      color: var(--color-charcoal);
      line-height: 1.45;
      margin-bottom: 6px;
    }

    .mentor-feedback-quote {
      font-size: 0.8rem;
      color: var(--color-forest);
      background: var(--color-white);
      padding: 6px 10px;
      border-radius: 4px;
      border-left: 3px solid var(--color-gold);
    }

    /* AI Teaser Card */
    .ai-card {
      border: 2px solid var(--color-gold);
      background: linear-gradient(180deg, #FFFFFF 0%, var(--color-cream-light) 100%);
    }

    .ai-header {
      padding: 20px 20px 14px;
      border-bottom: 1px solid var(--color-border-subtle);
    }

    .ai-sparkle {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--color-gold);
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 4px;
    }

    .ai-header h4 {
      font-size: 1.15rem;
      color: var(--color-forest);
      margin-bottom: 4px;
    }

    .ai-header p {
      font-size: 0.8rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    .ai-mentors-list {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .ai-mentor-item {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .ai-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--color-gold);
    }

    .ai-mentor-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-forest);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ai-match-score {
      display: block;
      font-size: 0.76rem;
      color: #7A5C13;
      font-weight: 600;
    }

    .ai-action-link {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-forest);
    }

    .workspace-dash-item {
      padding: 12px;
      background: var(--color-cream-light);
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      margin-bottom: 12px;
    }

    .workspace-dash-item h5 {
      font-size: 0.95rem;
      color: var(--color-forest);
      margin-bottom: 2px;
    }

    .ws-domain {
      font-size: 0.8rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 8px;
    }

    /* Mentor Specific Request Styles */
    .request-item-card {
      background: var(--color-cream-light);
      border-radius: var(--radius-sm);
      padding: 16px;
      border: 1px solid var(--color-border);
      margin-bottom: 14px;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .mentee-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mentee-inst {
      font-size: 0.82rem;
      color: var(--color-charcoal-muted);
      margin-left: 4px;
    }

    .req-status-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .req-status-pill.pending { background: #FFE082; color: #795548; }
    .req-status-pill.accepted { background: #C8E6C9; color: #2E7D32; }
    .req-status-pill.declined { background: #FFCDD2; color: #C62828; }

    .request-msg {
      font-size: 0.88rem;
      color: var(--color-charcoal);
      margin-bottom: 8px;
      font-style: italic;
    }

    .request-goals {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-forest);
      margin-bottom: 12px;
    }

    .request-actions {
      display: flex;
      gap: 10px;
    }

    .btn-block {
      width: 100%;
    }

    .admin-action-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-forest);
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      box-shadow: var(--shadow-md);
      flex-wrap: wrap;
    }

    .admin-callout h3 {
      font-size: 1.4rem;
      margin-bottom: 6px;
    }

    .admin-callout p {
      color: var(--color-charcoal-muted);
      margin: 0;
      max-width: 650px;
    }

    @media (max-width: 900px) {
      .dashboard-columns-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  sessions: MentorshipSession[] = [];
  requests: MentorshipRequest[] = [];
  milestones: CareerMilestone[] = [];
  workspaces: SharedWorkspace[] = [];

  constructor(
    private authService: AuthService,
    private mentorshipService: MentorshipService,
    private collabService: CollaborationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });

    this.mentorshipService.sessions$.subscribe(s => {
      this.sessions = s;
    });

    this.mentorshipService.requests$.subscribe(r => {
      this.requests = r;
    });

    this.mentorshipService.milestones$.subscribe(m => {
      this.milestones = m;
    });

    this.collabService.workspaces$.subscribe(w => {
      this.workspaces = w;
    });
  }

  switchRole(role: UserRole): void {
    this.authService.switchRole(role);
  }

  toggleMilestone(id: string): void {
    this.mentorshipService.toggleMilestone(id);
  }

  acceptRequest(id: number): void {
    this.mentorshipService.respondToRequest(id, 'ACCEPTED');
  }

  declineRequest(id: number): void {
    this.mentorshipService.respondToRequest(id, 'DECLINED');
  }
}
