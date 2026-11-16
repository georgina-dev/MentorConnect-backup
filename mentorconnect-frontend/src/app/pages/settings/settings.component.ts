import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="container settings-container">
        <!-- Settings Header -->
        <div class="settings-header">
          <span class="eyebrow">Account Governance & Security</span>
          <h1>Platform Settings & Identity Controls</h1>
          <p>Manage your verified identity documents, notification triggers, and active persona preview.</p>
        </div>

        <div *ngIf="successMsg" class="alert success-alert">{{ successMsg }}</div>

        <div class="settings-grid">
          <!-- Navigation Sidebar -->
          <aside class="settings-nav">
            <button (click)="activeSection = 'PROFILE'" [class.active]="activeSection === 'PROFILE'" class="s-nav-btn">
              👤 Profile & Identity
            </button>
            <button (click)="activeSection = 'VERIFICATION'" [class.active]="activeSection === 'VERIFICATION'" class="s-nav-btn">
              🛡️ Verification Documents
            </button>
            <button (click)="activeSection = 'NOTIFICATIONS'" [class.active]="activeSection === 'NOTIFICATIONS'" class="s-nav-btn">
              🔔 Notifications & Privacy
            </button>
            <button (click)="activeSection = 'SECURITY'" [class.active]="activeSection === 'SECURITY'" class="s-nav-btn">
              🔒 Security & JWT Auth
            </button>
          </aside>

          <!-- Main Content Area -->
          <main class="settings-content">
            <!-- SECTION 1: PROFILE & IDENTITY -->
            <div *ngIf="activeSection === 'PROFILE'" class="card">
              <div class="card-header">
                <h3>Profile Information</h3>
              </div>
              <div class="card-body">
                <form (ngSubmit)="saveProfile()">
                  <div class="form-row">
                    <div class="form-group col">
                      <label class="form-label">First Name</label>
                      <input type="text" [(ngModel)]="firstName" name="firstName" class="form-control" />
                    </div>
                    <div class="form-group col">
                      <label class="form-label">Last Name</label>
                      <input type="text" [(ngModel)]="lastName" name="lastName" class="form-control" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Professional Headline</label>
                    <input type="text" [(ngModel)]="headline" name="headline" class="form-control" />
                  </div>

                  <div class="form-row">
                    <div class="form-group col">
                      <label class="form-label">Institution / Company</label>
                      <input type="text" [(ngModel)]="institution" name="institution" class="form-control" />
                    </div>
                    <div class="form-group col">
                      <label class="form-label">Degree or Title</label>
                      <input type="text" [(ngModel)]="degree" name="degree" class="form-control" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Bio</label>
                    <textarea [(ngModel)]="bio" name="bio" class="form-control" rows="4"></textarea>
                  </div>

                  <div class="form-row">
                    <div class="form-group col">
                      <label class="form-label">GitHub Profile</label>
                      <input type="text" [(ngModel)]="github" name="github" class="form-control" placeholder="https://github.com/..." />
                    </div>
                    <div class="form-group col">
                      <label class="form-label">LinkedIn Profile</label>
                      <input type="text" [(ngModel)]="linkedin" name="linkedin" class="form-control" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary">Save Profile Updates</button>
                </form>
              </div>
            </div>

            <!-- SECTION 2: VERIFICATION DOCUMENTS (Objective 1) -->
            <div *ngIf="activeSection === 'VERIFICATION'" class="card">
              <div class="card-header">
                <h3>Identity Verification & Audit Dossier</h3>
                <span class="badge" [ngClass]="'badge-ver-' + currentUser?.verification_status?.toLowerCase()">
                  {{ currentUser?.verification_status }}
                </span>
              </div>
              <div class="card-body">
                <p class="section-desc">
                  To prevent unauthorized impersonation and foster genuine peer mentorship, all mentors and mentees can submit institutional documentation for audit.
                </p>

                <div class="current-status-box">
                  <span class="cs-label">Current Verification State:</span>
                  <strong class="cs-status">{{ currentUser?.verification_status }}</strong>
                  <p class="cs-notes">{{ currentUser?.verification_notes || 'No administrative notes recorded.' }}</p>
                </div>

                <h4 class="mt-4 mb-3">Upload / Update Institutional Credential</h4>
                <div class="form-group">
                  <label class="form-label">Select Credential Category</label>
                  <select [(ngModel)]="docType" class="form-control">
                    <option value="STUDENT_ID">University Student ID Card</option>
                    <option value="ACADEMIC_EMAIL">Official .edu Verification</option>
                    <option value="DIPLOMA_DEGREE">Degree Diploma / Transcript</option>
                    <option value="EMPLOYMENT_PROOF">Corporate Employment Letter</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Document ID Number</label>
                  <input type="text" [(ngModel)]="docNumber" class="form-control" placeholder="e.g. UCB-ID-99201" />
                </div>

                <div class="form-group">
                  <label class="form-label">Issuing Authority</label>
                  <input type="text" [(ngModel)]="docInst" class="form-control" placeholder="e.g. University of California, Berkeley" />
                </div>

                <button (click)="submitVerificationDoc()" class="btn btn-gold">
                  Submit Document for Administrative Audit
                </button>
              </div>
            </div>

            <!-- SECTION 3: NOTIFICATIONS -->
            <div *ngIf="activeSection === 'NOTIFICATIONS'" class="card">
              <div class="card-header">
                <h3>Notification Preferences</h3>
              </div>
              <div class="card-body">
                <div class="setting-toggle-row">
                  <div>
                    <strong>Mentorship Session Reminders</strong>
                    <p>Receive email alerts 15 minutes before scheduled 1-on-1 meetings.</p>
                  </div>
                  <input type="checkbox" checked />
                </div>

                <div class="setting-toggle-row">
                  <div>
                    <strong>Discussion Channel Mentions</strong>
                    <p>Alert when someone replies to your technical code snippet or question.</p>
                  </div>
                  <input type="checkbox" checked />
                </div>

                <div class="setting-toggle-row">
                  <div>
                    <strong>Workspace Sprint Updates</strong>
                    <p>Notify when tasks are moved between TODO, IN PROGRESS, and DONE.</p>
                  </div>
                  <input type="checkbox" checked />
                </div>
              </div>
            </div>

            <!-- SECTION 4: SECURITY -->
            <div *ngIf="activeSection === 'SECURITY'" class="card">
              <div class="card-header">
                <h3>Security & JWT Token Details</h3>
              </div>
              <div class="card-body">
                <p class="section-desc">
                  Authentication is governed by asymmetric JSON Web Tokens (SimpleJWT on Django backend) with embedded user role claims.
                </p>

                <div class="jwt-info-box">
                  <div class="jwt-row">
                    <span>Authentication Mechanism:</span>
                    <strong>Bearer JWT Access Tokens</strong>
                  </div>
                  <div class="jwt-row">
                    <span>Backend API Host:</span>
                    <strong>http://127.0.0.1:8000/api/auth/</strong>
                  </div>
                  <div class="jwt-row">
                    <span>Active Session Username:</span>
                    <strong>{{ currentUser?.username }}</strong>
                  </div>
                  <div class="jwt-row">
                    <span>Active Session Role:</span>
                    <strong>{{ currentUser?.role }}</strong>
                  </div>
                </div>

                <div class="mt-4">
                  <button (click)="authService.logout()" class="btn btn-secondary">Clear Session & Re-authenticate</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 40px 0 70px;
    }

    .settings-header {
      margin-bottom: 30px;
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

    .settings-header h1 {
      font-size: 2.2rem;
      color: var(--color-forest);
      margin-bottom: 6px;
    }

    .settings-header p {
      font-size: 0.95rem;
      color: var(--color-charcoal-muted);
    }

    .settings-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 30px;
    }

    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .s-nav-btn {
      background: var(--color-white);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-charcoal);
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .s-nav-btn:hover {
      background: var(--color-cream-light);
      border-color: var(--color-forest);
    }

    .s-nav-btn.active {
      background: var(--color-forest);
      color: var(--color-white);
      border-color: var(--color-forest);
    }

    .section-desc {
      font-size: 0.9rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .col {
      flex: 1;
    }

    .current-status-box {
      background: var(--color-cream-light);
      border-radius: var(--radius-sm);
      padding: 16px;
      border: 1px solid var(--color-border);
    }

    .cs-label {
      font-size: 0.78rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-charcoal-muted);
      display: block;
    }

    .cs-status {
      font-size: 1.2rem;
      color: var(--color-forest);
      display: block;
      margin: 4px 0;
    }

    .cs-notes {
      font-size: 0.85rem;
      color: var(--color-charcoal);
      margin: 0;
    }

    .mt-4 { margin-top: 24px; }
    .mb-3 { margin-bottom: 14px; }

    .badge-ver-verified { background: #C8E6C9; color: #2E7D32; }
    .badge-ver-pending { background: #FFE082; color: #795548; }
    .badge-ver-unverified { background: #EEEEEE; color: #757575; }

    .setting-toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid var(--color-border-subtle);
    }

    .setting-toggle-row:last-child {
      border-bottom: none;
    }

    .setting-toggle-row p {
      font-size: 0.82rem;
      color: var(--color-charcoal-muted);
      margin: 2px 0 0;
    }

    .jwt-info-box {
      background: var(--color-cream-light);
      padding: 16px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.88rem;
    }

    .jwt-row {
      display: flex;
      justify-content: space-between;
    }

    .jwt-row span {
      color: var(--color-charcoal-muted);
    }

    .alert.success-alert {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
    }

    @media (max-width: 800px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  activeSection: 'PROFILE' | 'VERIFICATION' | 'NOTIFICATIONS' | 'SECURITY' = 'PROFILE';

  firstName = '';
  lastName = '';
  headline = '';
  institution = '';
  degree = '';
  bio = '';
  github = '';
  linkedin = '';

  docType = 'STUDENT_ID';
  docNumber = '';
  docInst = '';

  successMsg = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u) {
        this.firstName = u.first_name || '';
        this.lastName = u.last_name || '';
        this.headline = u.headline || '';
        this.institution = u.institution_or_company || '';
        this.degree = u.degree_or_title || '';
        this.bio = u.bio || '';
        this.github = u.github_profile || '';
        this.linkedin = u.linkedin_profile || '';
        this.docInst = u.institution_or_company || '';
      }
    });
  }

  saveProfile(): void {
    this.authService.updateProfile({
      first_name: this.firstName,
      last_name: this.lastName,
      headline: this.headline,
      institution_or_company: this.institution,
      degree_or_title: this.degree,
      bio: this.bio,
      github_profile: this.github,
      linkedin_profile: this.linkedin
    }).subscribe(() => {
      this.successMsg = 'Profile settings updated successfully!';
      setTimeout(() => this.successMsg = '', 3000);
    });
  }

  submitVerificationDoc(): void {
    if (!this.docNumber || !this.docInst) return;
    this.authService.submitIdentityVerification({
      document_type: this.docType,
      document_number_or_info: this.docNumber,
      institution_name: this.docInst,
      notes: 'Submitted via Settings page.'
    }).subscribe(() => {
      this.successMsg = 'Verification document submitted! Administrative team has been queued.';
      setTimeout(() => this.successMsg = '', 3500);
    });
  }
}
