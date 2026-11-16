import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="container auth-container">
        <div class="auth-card register-card">
          <!-- Header -->
          <div class="auth-header">
            <span class="step-pill">Objective 1: User Registration & Identity Verification</span>
            <h2>Create Your MentorConnect Account</h2>
            <p>Join a community of peer learners, mentors, and verified domain leaders.</p>
          </div>

          <!-- Alert -->
          <div *ngIf="errorMessage" class="auth-alert error">
            {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="auth-alert success">
            {{ successMessage }}
          </div>

          <!-- Role Selector Tabs -->
          <div class="role-selector-container">
            <label class="form-label text-center">Step 1: Select Your Primary Platform Role</label>
            <div class="role-cards-grid">
              <div
                class="role-choice-card"
                [class.selected]="selectedRole === 'STUDENT'"
                (click)="selectedRole = 'STUDENT'"
              >
                <div class="role-icon">🎓</div>
                <div class="role-info">
                  <strong>Student / Mentee</strong>
                  <p>Seeking 1-on-1 guidance, study workspaces, and career milestones.</p>
                </div>
              </div>

              <div
                class="role-choice-card"
                [class.selected]="selectedRole === 'MENTOR'"
                (click)="selectedRole = 'MENTOR'"
              >
                <div class="role-icon">🌱</div>
                <div class="role-info">
                  <strong>Peer Mentor</strong>
                  <p>Guiding peers, leading workspaces, and solidifying technical leadership.</p>
                </div>
              </div>

              <div
                class="role-choice-card"
                [class.selected]="selectedRole === 'EXPERT'"
                (click)="selectedRole = 'EXPERT'"
              >
                <div class="role-icon">⭐</div>
                <div class="role-info">
                  <strong>Domain Expert</strong>
                  <p>Advising research projects, system architectures, and masterclasses.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Registration Form -->
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Account Details -->
            <div class="form-section-title">Step 2: Account & Institutional Identity</div>

            <div class="form-row">
              <div class="form-group col">
                <label class="form-label" for="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  [(ngModel)]="firstName"
                  name="firstName"
                  required
                  class="form-control"
                  placeholder="e.g. Maya"
                />
              </div>
              <div class="form-group col">
                <label class="form-label" for="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  [(ngModel)]="lastName"
                  name="lastName"
                  required
                  class="form-control"
                  placeholder="e.g. Patel"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label class="form-label" for="username">Username</label>
                <input
                  id="username"
                  type="text"
                  [(ngModel)]="username"
                  name="username"
                  required
                  class="form-control"
                  placeholder="e.g. maya_patel"
                />
              </div>
              <div class="form-group col">
                <label class="form-label" for="email">Academic / Corporate Email</label>
                <input
                  id="email"
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="form-control"
                  placeholder="name@university.edu or name@company.com"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label class="form-label" for="password">Password (min 8 characters)</label>
                <input
                  id="password"
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  minlength="8"
                  class="form-control"
                  placeholder="••••••••"
                />
              </div>
              <div class="form-group col">
                <label class="form-label" for="passwordConfirm">Confirm Password</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  [(ngModel)]="passwordConfirm"
                  name="passwordConfirm"
                  required
                  minlength="8"
                  class="form-control"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <!-- Profile & Domain Details -->
            <div class="form-section-title">Step 3: Domains & Specialization</div>

            <div class="form-row">
              <div class="form-group col">
                <label class="form-label" for="institution">University or Company</label>
                <input
                  id="institution"
                  type="text"
                  [(ngModel)]="institution"
                  name="institution"
                  class="form-control"
                  placeholder="e.g. Stanford University or Stripe"
                />
              </div>
              <div class="form-group col">
                <label class="form-label" for="title">Degree or Professional Title</label>
                <input
                  id="title"
                  type="text"
                  [(ngModel)]="degreeOrTitle"
                  name="degreeOrTitle"
                  class="form-control"
                  placeholder="e.g. B.S. Computer Science '27 or Senior Systems Engineer"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Primary Domains (Select all that apply)</label>
              <div class="domains-chips-grid">
                <button
                  type="button"
                  *ngFor="let domain of availableDomains"
                  class="domain-chip"
                  [class.active]="selectedDomains.includes(domain)"
                  (click)="toggleDomain(domain)"
                >
                  {{ domain }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="headline">Professional Headline</label>
              <input
                id="headline"
                type="text"
                [(ngModel)]="headline"
                name="headline"
                class="form-control"
                placeholder="e.g. CS Sophomore passionate about Distributed Systems & Go"
              />
            </div>

            <!-- Optional Identity Verification Document Preview -->
            <div class="verification-preview-box">
              <div class="ver-header">
                <span class="ver-icon">🛡️</span>
                <div>
                  <strong>Optional: Expedited Identity Verification</strong>
                  <p>You can also upload verification documents later in your profile or settings.</p>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label class="form-label" for="docType">Document Type</label>
                  <select id="docType" [(ngModel)]="verificationDocType" name="verificationDocType" class="form-control">
                    <option value="STUDENT_ID">University Student ID</option>
                    <option value="ACADEMIC_EMAIL">Official .edu Email</option>
                    <option value="DIPLOMA_DEGREE">Degree Certificate / Diploma</option>
                    <option value="EMPLOYMENT_PROOF">Corporate Work Proof</option>
                  </select>
                </div>
                <div class="form-group col">
                  <label class="form-label" for="docId">Document ID / Identifier</label>
                  <input
                    id="docId"
                    type="text"
                    [(ngModel)]="verificationDocId"
                    name="verificationDocId"
                    class="form-control"
                    placeholder="e.g. STU-2026-90412"
                  />
                </div>
              </div>
            </div>

            <button type="submit" [disabled]="isLoading" class="btn btn-gold btn-block btn-lg">
              <span *ngIf="!isLoading">Complete Registration & Enter Platform</span>
              <span *ngIf="isLoading">Creating Your Account...</span>
            </button>
          </form>

          <div class="auth-footer">
            Already have an account?
            <a routerLink="/login" class="text-forest font-bold">Sign In here</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      padding: 50px 0;
      min-height: calc(100vh - 160px);
      background: linear-gradient(180deg, var(--color-cream-light) 0%, var(--color-cream) 100%);
    }

    .auth-container {
      display: flex;
      justify-content: center;
    }

    .register-card {
      max-width: 760px;
      background: var(--color-white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      padding: 40px;
      width: 100%;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .step-pill {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-forest);
      background: var(--color-forest-subtle);
      border: 1px solid var(--color-sage);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-block;
      margin-bottom: 12px;
    }

    .auth-header h2 {
      font-size: 2rem;
      color: var(--color-forest);
      margin-bottom: 8px;
    }

    .auth-header p {
      font-size: 0.95rem;
      color: var(--color-charcoal-muted);
    }

    .role-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }

    .role-choice-card {
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--color-white);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .role-choice-card:hover {
      border-color: var(--color-sage);
      transform: translateY(-2px);
    }

    .role-choice-card.selected {
      border-color: var(--color-gold);
      background: var(--color-gold-subtle);
      box-shadow: 0 4px 14px rgba(197, 164, 93, 0.25);
    }

    .role-icon {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    .role-info strong {
      display: block;
      color: var(--color-forest);
      font-size: 0.95rem;
      margin-bottom: 4px;
    }

    .role-info p {
      font-size: 0.78rem;
      color: var(--color-charcoal-muted);
      margin: 0;
      line-height: 1.35;
    }

    .form-section-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-forest);
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border);
      margin: 24px 0 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .col {
      flex: 1;
    }

    .domains-chips-grid {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .domain-chip {
      padding: 6px 14px;
      font-size: 0.82rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      border: 1.5px solid var(--color-border);
      background: var(--color-white);
      color: var(--color-charcoal);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .domain-chip:hover {
      border-color: var(--color-forest);
    }

    .domain-chip.active {
      background: var(--color-forest);
      color: var(--color-white);
      border-color: var(--color-forest);
    }

    .verification-preview-box {
      background: var(--color-cream);
      border-radius: var(--radius-md);
      padding: 18px;
      border: 1px dashed var(--color-forest);
      margin: 20px 0 28px;
    }

    .ver-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .ver-icon {
      font-size: 1.6rem;
    }

    .ver-header strong {
      display: block;
      color: var(--color-forest);
      font-size: 0.92rem;
    }

    .ver-header p {
      font-size: 0.8rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    .btn-block {
      width: 100%;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.9rem;
      color: var(--color-charcoal-muted);
    }

    .font-bold {
      font-weight: 700;
    }

    .auth-alert {
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      margin-bottom: 20px;
    }

    .auth-alert.error {
      background: var(--color-danger-subtle);
      color: var(--color-danger);
    }

    .auth-alert.success {
      background: var(--color-success-subtle);
      color: var(--color-success);
    }

    @media (max-width: 650px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  selectedRole: UserRole = 'STUDENT';
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  passwordConfirm = '';
  institution = '';
  degreeOrTitle = '';
  headline = '';
  verificationDocType = 'STUDENT_ID';
  verificationDocId = '';

  availableDomains = [
    'Computer Science',
    'Artificial Intelligence',
    'Product Design',
    'Business & Finance',
    'Bioinformatics',
    'Career Navigation'
  ];
  selectedDomains: string[] = ['Computer Science'];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleDomain(domain: string): void {
    if (this.selectedDomains.includes(domain)) {
      if (this.selectedDomains.length > 1) {
        this.selectedDomains = this.selectedDomains.filter(d => d !== domain);
      }
    } else {
      this.selectedDomains.push(domain);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.firstName) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      password_confirm: this.passwordConfirm,
      first_name: this.firstName,
      last_name: this.lastName,
      role: this.selectedRole,
      institution_or_company: this.institution,
      degree_or_title: this.degreeOrTitle,
      headline: this.headline || `${this.selectedRole} in ${this.selectedDomains[0]}`,
      domains: this.selectedDomains,
      skills: this.selectedDomains
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Directing to your personalized dashboard...';
        
        // If user submitted verification doc during registration
        if (this.verificationDocId) {
          this.authService.submitIdentityVerification({
            document_type: this.verificationDocType,
            document_number_or_info: this.verificationDocId,
            institution_name: this.institution || 'Verified Partner',
            notes: 'Submitted during initial registration onboarding.'
          }).subscribe();
        }

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 800);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.password?.[0] || err?.error?.email?.[0] || err?.error?.username?.[0] || 'Registration error. Please check your inputs.';
      }
    });
  }
}
