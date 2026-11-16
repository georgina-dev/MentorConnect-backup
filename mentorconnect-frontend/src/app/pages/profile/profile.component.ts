import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, VerificationStatus } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="container">
        <!-- Main Profile Banner Card -->
        <div class="profile-hero-card">
          <div class="profile-banner-bg"></div>
          <div class="profile-hero-content">
            <div class="avatar-wrapper">
              <img [src]="user?.avatar_url" [alt]="user?.first_name" class="profile-main-avatar" />
              <button (click)="openEditModal()" class="avatar-edit-badge" title="Change Avatar / Details">✎</button>
            </div>

            <div class="profile-hero-info">
              <div class="profile-name-line">
                <h2>{{ user?.first_name }} {{ user?.last_name }}</h2>
                <span class="role-pill" [ngClass]="'role-' + user?.role?.toLowerCase()">{{ user?.role }}</span>

                <!-- Verification Badges -->
                <span *ngIf="user?.verification_status === 'VERIFIED'" class="ver-pill verified">
                  ✓ Verified Identity
                </span>
                <span *ngIf="user?.verification_status === 'PENDING'" class="ver-pill pending">
                  ⏳ Verification In Review
                </span>
                <span *ngIf="user?.verification_status === 'UNVERIFIED'" class="ver-pill unverified">
                  ⚠ Unverified
                </span>
              </div>

              <p class="profile-headline">{{ user?.headline }}</p>
              <p class="profile-institution">
                🏛️ {{ user?.institution_or_company }} <span *ngIf="user?.degree_or_title">• {{ user?.degree_or_title }}</span>
              </p>

              <!-- Social / Code links -->
              <div class="profile-links-row">
                <a *ngIf="user?.github_profile" [href]="user?.github_profile" target="_blank" class="p-link">
                  GitHub Profile ↗
                </a>
                <a *ngIf="user?.linkedin_profile" [href]="user?.linkedin_profile" target="_blank" class="p-link">
                  LinkedIn ↗
                </a>
                <span class="p-email">✉ {{ user?.email }}</span>
              </div>
            </div>

            <div class="profile-hero-action">
              <button (click)="openEditModal()" class="btn btn-outline-forest">Edit Profile</button>
            </div>
          </div>
        </div>

        <!-- Identity Verification Status & Submission Center (Objective 1) -->
        <div class="verification-center-card">
          <div class="ver-center-header">
            <div class="ver-center-title">
              <span class="ver-center-icon">🛡️</span>
              <div>
                <h3>Academic & Professional Identity Verification Protocol</h3>
                <p>Objective 1: Multi-document verification audits authenticate real institutional affiliation.</p>
              </div>
            </div>

            <div class="ver-status-indicator">
              <span class="status-chip" [ngClass]="user?.verification_status?.toLowerCase()">
                Status: {{ user?.verification_status }}
              </span>
            </div>
          </div>

          <!-- If Already Verified -->
          <div *ngIf="user?.verification_status === 'VERIFIED'" class="ver-banner-verified">
            <div class="ver-check-circle">✓</div>
            <div>
              <strong>Your Identity and Credentials are Officially Verified</strong>
              <p>Your institutional affiliation ({{ user?.institution_or_company }}) has been authenticated. You hold verified peer status across all discussion channels and mentorship rosters.</p>
              <span class="ver-audit-note">{{ user?.verification_notes || 'Verified by MentorConnect Integrity Board' }}</span>
            </div>
          </div>

          <!-- If Pending -->
          <div *ngIf="user?.verification_status === 'PENDING'" class="ver-banner-pending">
            <div class="ver-pending-circle">⏳</div>
            <div>
              <strong>Verification Submission Under Administrative Review</strong>
              <p>Your documents have been submitted to the MentorConnect audit team. Turnaround time is usually within 24 to 48 hours.</p>
              <span class="ver-audit-note">Reference note: {{ user?.verification_notes || 'Pending administrator review.' }}</span>
            </div>
          </div>

          <!-- If Unverified: Direct Submission Form -->
          <div *ngIf="user?.verification_status === 'UNVERIFIED'" class="ver-submission-form-box">
            <h4>Submit Identity Verification Credentials</h4>
            <p class="form-desc">Select your credential type and provide verification details or institutional ID.</p>

            <div *ngIf="verSuccessMessage" class="ver-alert success">{{ verSuccessMessage }}</div>
            <div *ngIf="verErrorMessage" class="ver-alert error">{{ verErrorMessage }}</div>

            <form (ngSubmit)="submitVerification()" class="ver-form">
              <div class="ver-form-grid">
                <div class="form-group">
                  <label class="form-label">Document Type</label>
                  <select [(ngModel)]="verDocType" name="verDocType" class="form-control">
                    <option value="STUDENT_ID">University / College Student ID</option>
                    <option value="ACADEMIC_EMAIL">Official Academic Email (.edu / institutional domain)</option>
                    <option value="DIPLOMA_DEGREE">Degree / Diploma Certificate</option>
                    <option value="EMPLOYMENT_PROOF">Corporate Employment Letter / Staff ID</option>
                    <option value="GOVERNMENT_ID">Government Issued Photo ID</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Document ID Number or Identifier</label>
                  <input
                    type="text"
                    [(ngModel)]="verDocNumber"
                    name="verDocNumber"
                    required
                    class="form-control"
                    placeholder="e.g. STU-2027-8910 or Employee Badge #"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Issuing University / Institution Name</label>
                  <input
                    type="text"
                    [(ngModel)]="verInstitution"
                    name="verInstitution"
                    required
                    class="form-control"
                    placeholder="e.g. UC Berkeley or Stripe"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Optional Verification Notes / Context</label>
                  <input
                    type="text"
                    [(ngModel)]="verNotes"
                    name="verNotes"
                    class="form-control"
                    placeholder="e.g. Current junior semester enrolled in CS 162"
                  />
                </div>
              </div>

              <button type="submit" [disabled]="verIsSubmitting" class="btn btn-gold">
                <span *ngIf="!verIsSubmitting">Submit Document for Audit</span>
                <span *ngIf="verIsSubmitting">Transmitting Document...</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Profile Details Columns -->
        <div class="profile-grid">
          <!-- Left Main Column: Bio, Domains, Skills -->
          <div class="p-col-main">
            <!-- About Me -->
            <div class="card mb-4">
              <div class="card-header">
                <h3>About & Background</h3>
              </div>
              <div class="card-body">
                <p class="profile-bio-text">{{ user?.bio || 'No bio provided yet.' }}</p>

                <h4 class="subhead mt-4">Domains of Focus</h4>
                <div class="domains-chips">
                  <span *ngFor="let d of user?.domains" class="p-domain-pill">{{ d }}</span>
                </div>

                <h4 class="subhead mt-4">Verified Technical & Academic Skills</h4>
                <div class="skills-chips">
                  <span *ngFor="let s of user?.skills" class="p-skill-pill">{{ s }}</span>
                </div>
              </div>
            </div>

            <!-- Mentorship Reviews -->
            <div class="card">
              <div class="card-header">
                <h3>Peer Endorsements & Mentorship Reviews</h3>
                <span class="rating-badge">★ {{ user?.rating || 5.0 }} ({{ user?.total_reviews || 12 }} reviews)</span>
              </div>
              <div class="card-body">
                <div class="reviews-list">
                  <div class="review-card">
                    <div class="review-top">
                      <strong>David K. (Cornell CS)</strong>
                      <span class="review-stars">★★★★★</span>
                    </div>
                    <p class="review-text">
                      "Incredible session! Walked through the subtleties of Paxos vs Raft leader lease timeouts with clear diagrams and real production failure stories."
                    </p>
                    <span class="review-date">Reviewed Nov 12, 2026</span>
                  </div>

                  <div class="review-card">
                    <div class="review-top">
                      <strong>Priya S. (Stanford EE)</strong>
                      <span class="review-stars">★★★★★</span>
                    </div>
                    <p class="review-text">
                      "Helped me structure my technical interview approach. Clear, constructive, and patient feedback on algorithmic space complexity."
                    </p>
                    <span class="review-date">Reviewed Nov 04, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Metrics & Credentials -->
          <div class="p-col-side">
            <div class="card mb-4">
              <div class="card-header">
                <h3>Mentorship Metrics</h3>
              </div>
              <div class="card-body">
                <div class="p-stat-row">
                  <span class="p-stat-name">Sessions Completed</span>
                  <span class="p-stat-val">{{ user?.sessions_completed || 0 }}</span>
                </div>
                <div class="p-stat-row">
                  <span class="p-stat-name">Students Mentored</span>
                  <span class="p-stat-val">{{ user?.students_mentored || 0 }}</span>
                </div>
                <div class="p-stat-row">
                  <span class="p-stat-name">Platform Standing</span>
                  <span class="p-stat-val text-forest font-bold">Good Standing</span>
                </div>
                <div class="p-stat-row">
                  <span class="p-stat-name">Member Since</span>
                  <span class="p-stat-val">Fall 2026</span>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Institutional Credential</h3>
              </div>
              <div class="card-body">
                <div class="cred-box">
                  <span class="cred-icon">🎓</span>
                  <div>
                    <strong>{{ user?.institution_or_company }}</strong>
                    <p>{{ user?.degree_or_title }}</p>
                  </div>
                </div>
                <div class="mt-3">
                  <span class="badge badge-verified">ID Audit Cleared</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Modal -->
        <div *ngIf="isEditModalOpen" class="modal-overlay">
          <div class="modal-card">
            <div class="modal-header">
              <h3>Edit Profile Information</h3>
              <button (click)="closeEditModal()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Headline</label>
                <input type="text" [(ngModel)]="editHeadline" class="form-control" />
              </div>

              <div class="form-group">
                <label class="form-label">Institution / Company</label>
                <input type="text" [(ngModel)]="editInstitution" class="form-control" />
              </div>

              <div class="form-group">
                <label class="form-label">Degree / Title</label>
                <input type="text" [(ngModel)]="editTitle" class="form-control" />
              </div>

              <div class="form-group">
                <label class="form-label">Bio</label>
                <textarea [(ngModel)]="editBio" class="form-control" rows="4"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Avatar Image URL</label>
                <input type="text" [(ngModel)]="editAvatar" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="closeEditModal()" class="btn btn-secondary">Cancel</button>
              <button (click)="saveProfile()" class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 30px 0 60px;
    }

    /* Hero Banner */
    .profile-hero-card {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
    }

    .profile-banner-bg {
      height: 140px;
      background: linear-gradient(135deg, var(--color-forest) 0%, #102B24 60%, var(--color-gold) 100%);
    }

    .profile-hero-content {
      padding: 0 32px 28px;
      display: flex;
      gap: 24px;
      position: relative;
      margin-top: -50px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .avatar-wrapper {
      position: relative;
    }

    .profile-main-avatar {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--color-white);
      box-shadow: var(--shadow-md);
      background: var(--color-white);
    }

    .avatar-edit-badge {
      position: absolute;
      bottom: 6px;
      right: 6px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-gold);
      color: var(--color-forest-dark);
      border: 2px solid var(--color-white);
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-hero-info {
      flex: 1;
      padding-top: 55px;
    }

    .profile-name-line {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }

    .profile-name-line h2 {
      font-size: 1.8rem;
      color: var(--color-forest);
      margin: 0;
    }

    .role-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 12px;
      text-transform: uppercase;
    }

    .role-student { background: #E8F0FE; color: #1967D2; }
    .role-mentor { background: var(--color-forest-subtle); color: var(--color-forest); }
    .role-expert { background: var(--color-gold-subtle); color: #7A5C13; }
    .role-admin { background: #FFCDD2; color: #C62828; }

    .ver-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .ver-pill.verified { background: #C8E6C9; color: #2E7D32; border: 1px solid #789B78; }
    .ver-pill.pending { background: #FFE082; color: #795548; border: 1px solid #D9822B; }
    .ver-pill.unverified { background: #EEEEEE; color: #757575; border: 1px solid #BDBDBD; }

    .profile-headline {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-charcoal);
      margin-bottom: 4px;
    }

    .profile-institution {
      font-size: 0.88rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 12px;
    }

    .profile-links-row {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.85rem;
      flex-wrap: wrap;
    }

    .p-link {
      color: var(--color-forest);
      font-weight: 600;
    }

    .p-email {
      color: var(--color-charcoal-muted);
    }

    .profile-hero-action {
      padding-bottom: 8px;
    }

    /* Verification Center Card */
    .verification-center-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1.5px solid var(--color-border);
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }

    .ver-center-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--color-border-subtle);
      flex-wrap: wrap;
      gap: 12px;
    }

    .ver-center-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .ver-center-icon {
      font-size: 2rem;
    }

    .ver-center-title h3 {
      font-size: 1.25rem;
      color: var(--color-forest);
      margin-bottom: 2px;
    }

    .ver-center-title p {
      font-size: 0.82rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    .status-chip {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }

    .status-chip.verified { background: #C8E6C9; color: #2E7D32; }
    .status-chip.pending { background: #FFE082; color: #795548; }
    .status-chip.unverified { background: #EEEEEE; color: #757575; }

    .ver-banner-verified {
      background: #E8F5E9;
      border: 1px solid #A5D6A7;
      border-radius: var(--radius-sm);
      padding: 16px;
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .ver-check-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #2E7D32;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .ver-banner-pending {
      background: #FFF8E1;
      border: 1px solid #FFE082;
      border-radius: var(--radius-sm);
      padding: 16px;
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .ver-pending-circle {
      font-size: 1.8rem;
    }

    .ver-audit-note {
      font-size: 0.78rem;
      color: var(--color-charcoal-muted);
      font-style: italic;
      display: block;
      margin-top: 4px;
    }

    .ver-submission-form-box {
      background: var(--color-cream-light);
      padding: 20px;
      border-radius: var(--radius-sm);
      border: 1px dashed var(--color-gold);
    }

    .ver-submission-form-box h4 {
      font-size: 1.1rem;
      color: var(--color-forest);
      margin-bottom: 4px;
    }

    .form-desc {
      font-size: 0.85rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 16px;
    }

    .ver-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .ver-alert {
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-bottom: 14px;
    }

    .ver-alert.success { background: #E8F5E9; color: #2E7D32; }
    .ver-alert.error { background: #FFEBEE; color: #C62828; }

    /* Profile Grid */
    .profile-grid {
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      gap: 24px;
    }

    .profile-bio-text {
      font-size: 0.95rem;
      color: var(--color-charcoal);
      line-height: 1.65;
    }

    .subhead {
      font-size: 1rem;
      color: var(--color-forest);
      margin-bottom: 10px;
    }

    .mt-4 { margin-top: 20px; }
    .mt-3 { margin-top: 14px; }
    .mb-4 { margin-bottom: 24px; }

    .domains-chips, .skills-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .p-domain-pill {
      background: var(--color-forest);
      color: var(--color-white);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .p-skill-pill {
      background: var(--color-cream);
      color: var(--color-forest-dark);
      border: 1px solid var(--color-border);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .rating-badge {
      font-size: 0.82rem;
      font-weight: 700;
      color: #8C6D27;
      background: var(--color-gold-subtle);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .review-card {
      background: var(--color-cream-light);
      border-radius: var(--radius-sm);
      padding: 14px;
      border: 1px solid var(--color-border);
    }

    .review-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 0.88rem;
    }

    .review-stars {
      color: var(--color-gold);
    }

    .review-text {
      font-size: 0.86rem;
      color: var(--color-charcoal);
      line-height: 1.45;
      margin-bottom: 6px;
      font-style: italic;
    }

    .review-date {
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
    }

    .p-stat-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--color-border-subtle);
      font-size: 0.9rem;
    }

    .p-stat-row:last-child {
      border-bottom: none;
    }

    .p-stat-name {
      color: var(--color-charcoal-muted);
    }

    .p-stat-val {
      font-weight: 700;
      color: var(--color-forest);
    }

    .cred-box {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .cred-icon {
      font-size: 2rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
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

    @media (max-width: 850px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
      .ver-form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  // Verification form state
  verDocType = 'STUDENT_ID';
  verDocNumber = '';
  verInstitution = '';
  verNotes = '';
  verIsSubmitting = false;
  verSuccessMessage = '';
  verErrorMessage = '';

  // Edit modal
  isEditModalOpen = false;
  editHeadline = '';
  editInstitution = '';
  editTitle = '';
  editBio = '';
  editAvatar = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
      if (u) {
        this.verInstitution = u.institution_or_company || '';
      }
    });
  }

  submitVerification(): void {
    if (!this.verDocNumber || !this.verInstitution) {
      this.verErrorMessage = 'Please provide both document identifier and institution name.';
      return;
    }

    this.verIsSubmitting = true;
    this.verErrorMessage = '';
    this.verSuccessMessage = '';

    this.authService.submitIdentityVerification({
      document_type: this.verDocType,
      document_number_or_info: this.verDocNumber,
      institution_name: this.verInstitution,
      notes: this.verNotes
    }).subscribe({
      next: (res) => {
        this.verIsSubmitting = false;
        this.verSuccessMessage = 'Document submitted successfully! Status changed to PENDING review.';
      },
      error: (err) => {
        this.verIsSubmitting = false;
        this.verErrorMessage = 'Failed to submit verification. Please try again.';
      }
    });
  }

  openEditModal(): void {
    if (this.user) {
      this.editHeadline = this.user.headline || '';
      this.editInstitution = this.user.institution_or_company || '';
      this.editTitle = this.user.degree_or_title || '';
      this.editBio = this.user.bio || '';
      this.editAvatar = this.user.avatar_url || '';
      this.isEditModalOpen = true;
    }
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  saveProfile(): void {
    this.authService.updateProfile({
      headline: this.editHeadline,
      institution_or_company: this.editInstitution,
      degree_or_title: this.editTitle,
      bio: this.editBio,
      avatar_url: this.editAvatar
    }).subscribe(() => {
      this.closeEditModal();
    });
  }
}
