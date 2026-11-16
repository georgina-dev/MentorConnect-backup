import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MentorshipService, CareerMilestone } from '../../services/mentorship.service';
import { MentorshipSession, MentorshipRequest, User } from '../../models/user.model';

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="mentorship-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-left">
            <span class="eyebrow">Peer Mentorship Operations & Milestone Tracking</span>
            <h1>Mentorship Management</h1>
            <p>Coordinate 1-on-1 pairings, manage incoming requests, and review structured career roadmaps.</p>
          </div>
          <div class="header-right">
            <button (click)="openScheduleModal()" class="btn btn-gold">+ Schedule New 1-on-1</button>
          </div>
        </div>

        <!-- Mentorship Navigation Tabs -->
        <div class="tab-nav">
          <button (click)="activeTab = 'SESSIONS'" [class.active]="activeTab === 'SESSIONS'" class="tab-btn">
            📅 Scheduled Sessions ({{ sessions.length }})
          </button>
          <button (click)="activeTab = 'REQUESTS'" [class.active]="activeTab === 'REQUESTS'" class="tab-btn">
            📬 Requests & Inquiries ({{ requests.length }})
          </button>
          <button (click)="activeTab = 'MILESTONES'" [class.active]="activeTab === 'MILESTONES'" class="tab-btn">
            🎯 Career Progression Milestones ({{ milestones.length }})
          </button>
        </div>

        <!-- ==========================================
             TAB 1: SCHEDULED SESSIONS
             ========================================== -->
        <div *ngIf="activeTab === 'SESSIONS'" class="tab-pane">
          <div *ngIf="sessions.length === 0" class="empty-state">
            <p>No upcoming sessions scheduled yet. Book your first 1-on-1 session with a peer mentor!</p>
            <button (click)="openScheduleModal()" class="btn btn-primary mt-3">Book Session Now</button>
          </div>

          <div class="sessions-grid">
            <div *ngFor="let s of sessions" class="session-card">
              <div class="s-card-header">
                <span class="s-domain-badge">{{ s.domain }}</span>
                <span class="s-status-badge">{{ s.status }}</span>
              </div>

              <h3 class="s-topic">{{ s.topic }}</h3>

              <div class="s-participants">
                <!-- Mentor -->
                <div class="s-person">
                  <img [src]="s.mentor.avatar_url" class="s-avatar" />
                  <div>
                    <span class="person-role">Mentor</span>
                    <strong>{{ s.mentor.first_name }} {{ s.mentor.last_name }}</strong>
                    <span class="person-inst">{{ s.mentor.institution_or_company }}</span>
                  </div>
                </div>

                <div class="person-arrow">⇄</div>

                <!-- Mentee -->
                <div class="s-person">
                  <img [src]="s.mentee.avatar_url" class="s-avatar" />
                  <div>
                    <span class="person-role">Mentee</span>
                    <strong>{{ s.mentee.first_name }} {{ s.mentee.last_name }}</strong>
                    <span class="person-inst">{{ s.mentee.institution_or_company }}</span>
                  </div>
                </div>
              </div>

              <!-- Time & Room Details -->
              <div class="s-time-block">
                <div class="s-time-row">
                  <span>🕒 <strong>{{ s.date }}</strong> ({{ s.time }})</span>
                  <span>⏳ Duration: {{ s.durationMinutes }} mins</span>
                </div>
                <div *ngIf="s.notes" class="s-notes-row">
                  📝 <em>Agenda: {{ s.notes }}</em>
                </div>
              </div>

              <div class="s-card-actions">
                <a [href]="s.meetingLink" target="_blank" class="btn btn-primary btn-block">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  Enter Verified Video Room
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 2: REQUESTS & INQUIRIES
             ========================================== -->
        <div *ngIf="activeTab === 'REQUESTS'" class="tab-pane">
          <div class="requests-list">
            <div *ngFor="let req of requests" class="request-card">
              <div class="req-top">
                <div class="req-parties">
                  <img [src]="req.mentee.avatar_url" class="req-avatar" />
                  <div>
                    <h4>{{ req.mentee.first_name }} {{ req.mentee.last_name }}</h4>
                    <span class="req-inst">{{ req.mentee.institution_or_company }} • {{ req.domain }}</span>
                  </div>
                </div>

                <span class="badge" [ngClass]="'badge-status-' + req.status.toLowerCase()">
                  {{ req.status }}
                </span>
              </div>

              <div class="req-body">
                <p class="req-quote">"{{ req.message }}"</p>
                <div class="req-goals-box">
                  <strong>🎯 Stated Mentorship Goals:</strong>
                  <p>{{ req.goals }}</p>
                </div>
              </div>

              <div class="req-footer">
                <span class="req-timestamp">Submitted {{ req.createdAt }}</span>
                <div *ngIf="req.status === 'PENDING'" class="req-btn-group">
                  <button (click)="acceptRequest(req.id)" class="btn btn-primary btn-sm">Accept Mentorship</button>
                  <button (click)="declineRequest(req.id)" class="btn btn-secondary btn-sm">Decline</button>
                </div>
                <div *ngIf="req.status === 'ACCEPTED'" class="accepted-tag">
                  ✓ Pair active • Sessions unlocked
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 3: CAREER PROGRESSION MILESTONES (Objective 4)
             ========================================== -->
        <div *ngIf="activeTab === 'MILESTONES'" class="tab-pane">
          <div class="milestones-dashboard-wrap">
            <div class="milestones-header-box">
              <div class="prog-text">
                <h3>Continuous Learning & Career Milestones</h3>
                <p>Objective 4: Competency checklists with mentor sign-offs across educational and professional tracks.</p>
              </div>
              <div class="prog-stat">
                <span class="prog-num">{{ getCompletionPercentage() }}%</span>
                <span class="prog-label">Roadmap Completed</span>
              </div>
            </div>

            <!-- Big Progress Bar -->
            <div class="big-progress-bar">
              <div class="big-progress-fill" [style.width.%]="getCompletionPercentage()"></div>
            </div>

            <div class="milestones-container">
              <div
                *ngFor="let m of milestones"
                class="milestone-full-card"
                [class.completed]="m.completed"
              >
                <div class="m-checkbox" (click)="toggleMilestone(m.id)">
                  <span *ngIf="m.completed">✓</span>
                </div>
                <div class="m-body">
                  <div class="m-top-line">
                    <span class="m-title-text">{{ m.title }}</span>
                    <span class="m-cat-pill">{{ m.category }}</span>
                  </div>
                  <p class="m-description-text">{{ m.description }}</p>
                  <div class="m-meta-line">
                    <span class="m-due">📅 Target Date: {{ m.dueDate }}</span>
                    <span *ngIf="m.completed" class="m-signed">✓ Verified by Mentor Maya Patel</span>
                  </div>
                  <div *ngIf="m.mentorFeedback" class="m-feedback-strip">
                    💬 Mentor Feedback: "{{ m.mentorFeedback }}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedule Session Modal -->
        <div *ngIf="isScheduleModalOpen" class="modal-overlay">
          <div class="modal-card">
            <div class="modal-header">
              <h3>Schedule 1-on-1 Mentorship Session</h3>
              <button (click)="closeScheduleModal()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Session Topic / Milestone Focus</label>
                <input
                  type="text"
                  [(ngModel)]="newSessionTopic"
                  class="form-control"
                  placeholder="e.g. Distributed Key-Value Store Architecture & Consensus"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Technical Domain Track</label>
                <select [(ngModel)]="newSessionDomain" class="form-control">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Bioinformatics">Bioinformatics</option>
                  <option value="Career Navigation">Career Navigation</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group col">
                  <label class="form-label">Date & Time</label>
                  <input
                    type="text"
                    [(ngModel)]="newSessionDate"
                    class="form-control"
                    placeholder="e.g. Next Monday, 3:00 PM UTC"
                  />
                </div>
                <div class="form-group col">
                  <label class="form-label">Duration</label>
                  <select [(ngModel)]="newSessionDuration" class="form-control">
                    <option [value]="30">30 minutes</option>
                    <option [value]="45">45 minutes</option>
                    <option [value]="60">60 minutes</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Preparation Notes / Code Links</label>
                <textarea
                  [(ngModel)]="newSessionNotes"
                  class="form-control"
                  rows="3"
                  placeholder="Review consistent hashing algorithm implementation in Go before meeting..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="closeScheduleModal()" class="btn btn-secondary">Cancel</button>
              <button (click)="saveScheduledSession()" class="btn btn-gold">Confirm Booking</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .mentorship-page {
      padding: 40px 0 70px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-gold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 6px;
    }

    .page-header h1 {
      font-size: 2.2rem;
      color: var(--color-forest);
      margin-bottom: 6px;
    }

    .page-header p {
      font-size: 0.95rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    /* Tab Navigation */
    .tab-nav {
      display: flex;
      gap: 12px;
      border-bottom: 2px solid var(--color-border);
      margin-bottom: 28px;
      overflow-x: auto;
    }

    .tab-btn {
      background: none;
      border: none;
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-charcoal-muted);
      padding: 12px 18px;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--color-forest);
    }

    .tab-btn.active {
      color: var(--color-forest);
      border-bottom-color: var(--color-gold);
      font-weight: 700;
    }

    /* Sessions Grid */
    .sessions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }

    .session-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
    }

    .s-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .s-domain-badge {
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--color-forest-subtle);
      color: var(--color-forest);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .s-status-badge {
      font-size: 0.72rem;
      font-weight: 700;
      background: #E8F5E9;
      color: #2E7D32;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .s-topic {
      font-size: 1.15rem;
      color: var(--color-forest);
      margin-bottom: 18px;
      line-height: 1.35;
    }

    .s-participants {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-cream-light);
      padding: 14px;
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      border: 1px solid var(--color-border);
    }

    .s-person {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .s-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .person-role {
      display: block;
      font-size: 0.68rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-charcoal-muted);
    }

    .person-inst {
      display: block;
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
    }

    .person-arrow {
      font-size: 1.2rem;
      color: var(--color-gold);
      font-weight: 800;
    }

    .s-time-block {
      background: var(--color-cream-light);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 18px;
      font-size: 0.85rem;
    }

    .s-time-row {
      display: flex;
      justify-content: space-between;
      color: var(--color-charcoal);
      margin-bottom: 6px;
    }

    .s-notes-row {
      color: var(--color-forest);
      font-size: 0.8rem;
    }

    .s-card-actions {
      margin-top: auto;
    }

    .btn-block {
      width: 100%;
    }

    /* Requests */
    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .request-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .req-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .req-parties {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .req-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .req-parties h4 {
      font-size: 1.1rem;
      color: var(--color-forest);
      margin: 0;
    }

    .req-inst {
      font-size: 0.82rem;
      color: var(--color-charcoal-muted);
    }

    .badge-status-pending { background: #FFF8E1; color: #795548; border: 1px solid #FFE082; }
    .badge-status-accepted { background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7; }
    .badge-status-declined { background: #FFEBEE; color: #C62828; border: 1px solid #EF9A9A; }

    .req-quote {
      font-size: 0.92rem;
      color: var(--color-charcoal);
      font-style: italic;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .req-goals-box {
      background: var(--color-cream-light);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-bottom: 16px;
    }

    .req-goals-box p {
      margin: 4px 0 0;
      color: var(--color-forest);
    }

    .req-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid var(--color-border-subtle);
    }

    .req-timestamp {
      font-size: 0.8rem;
      color: var(--color-charcoal-muted);
    }

    .req-btn-group {
      display: flex;
      gap: 10px;
    }

    .accepted-tag {
      font-size: 0.85rem;
      font-weight: 700;
      color: #2E7D32;
    }

    /* Milestones */
    .milestones-dashboard-wrap {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: 32px;
      box-shadow: var(--shadow-sm);
    }

    .milestones-header-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .prog-text h3 {
      font-size: 1.4rem;
      color: var(--color-forest);
      margin-bottom: 4px;
    }

    .prog-text p {
      font-size: 0.88rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    .prog-stat {
      text-align: right;
    }

    .prog-num {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-forest);
    }

    .prog-label {
      display: block;
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
      text-transform: uppercase;
      font-weight: 700;
    }

    .big-progress-bar {
      height: 12px;
      background: var(--color-cream);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: 30px;
    }

    .big-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-forest) 0%, var(--color-gold) 100%);
      border-radius: var(--radius-full);
      transition: width 0.4s ease;
    }

    .milestones-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .milestone-full-card {
      display: flex;
      gap: 18px;
      padding: 20px;
      background: var(--color-cream-light);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      transition: all 0.2s ease;
    }

    .milestone-full-card.completed {
      background: #F4FBF4;
      border-color: #A5D6A7;
    }

    .m-checkbox {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      border: 2px solid var(--color-forest);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: var(--color-white);
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .milestone-full-card.completed .m-checkbox {
      background: var(--color-forest);
    }

    .m-body {
      flex: 1;
    }

    .m-top-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .m-title-text {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-forest);
    }

    .milestone-full-card.completed .m-title-text {
      text-decoration: line-through;
      color: var(--color-charcoal-muted);
    }

    .m-cat-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--color-white);
      color: var(--color-charcoal);
      border: 1px solid var(--color-border);
    }

    .m-description-text {
      font-size: 0.9rem;
      color: var(--color-charcoal);
      line-height: 1.5;
      margin-bottom: 8px;
    }

    .m-meta-line {
      display: flex;
      gap: 16px;
      font-size: 0.8rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 8px;
    }

    .m-signed {
      color: #2E7D32;
      font-weight: 600;
    }

    .m-feedback-strip {
      background: var(--color-white);
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.82rem;
      color: var(--color-forest);
      border-left: 3px solid var(--color-gold);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
    }

    .modal-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      max-width: 560px;
      width: 100%;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--color-border);
    }

    .modal-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--color-border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--color-charcoal-muted);
    }

    .modal-body {
      padding: 24px;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--color-border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .col {
      flex: 1;
    }
  `]
})
export class MentorshipComponent implements OnInit {
  activeTab: 'SESSIONS' | 'REQUESTS' | 'MILESTONES' = 'SESSIONS';

  sessions: MentorshipSession[] = [];
  requests: MentorshipRequest[] = [];
  milestones: CareerMilestone[] = [];

  // Schedule modal state
  isScheduleModalOpen = false;
  newSessionTopic = '';
  newSessionDomain = 'Computer Science';
  newSessionDate = 'Upcoming Tuesday, 4:00 PM UTC';
  newSessionDuration = 45;
  newSessionNotes = '';

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit(): void {
    this.mentorshipService.sessions$.subscribe(s => this.sessions = s);
    this.mentorshipService.requests$.subscribe(r => this.requests = r);
    this.mentorshipService.milestones$.subscribe(m => this.milestones = m);
  }

  toggleMilestone(id: string): void {
    this.mentorshipService.toggleMilestone(id);
  }

  getCompletionPercentage(): number {
    if (this.milestones.length === 0) return 0;
    const completed = this.milestones.filter(m => m.completed).length;
    return Math.round((completed / this.milestones.length) * 100);
  }

  acceptRequest(id: number): void {
    this.mentorshipService.respondToRequest(id, 'ACCEPTED');
  }

  declineRequest(id: number): void {
    this.mentorshipService.respondToRequest(id, 'DECLINED');
  }

  openScheduleModal(): void {
    this.isScheduleModalOpen = true;
  }

  closeScheduleModal(): void {
    this.isScheduleModalOpen = false;
  }

  saveScheduledSession(): void {
    if (!this.newSessionTopic) return;
    this.mentorshipService.scheduleSession({
      topic: this.newSessionTopic,
      domain: this.newSessionDomain,
      date: this.newSessionDate,
      time: '16:00 UTC',
      durationMinutes: Number(this.newSessionDuration),
      notes: this.newSessionNotes
    }).subscribe(() => {
      this.closeScheduleModal();
      this.activeTab = 'SESSIONS';
      this.newSessionTopic = '';
      this.newSessionNotes = '';
    });
  }
}
