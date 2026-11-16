import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="container auth-container">
        <div class="auth-card">
          <!-- Card Header -->
          <div class="auth-header">
            <div class="auth-logo">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2>Sign In to MentorConnect</h2>
            <p>Access your peer mentorship network, shared workspaces, and progress dashboard.</p>
          </div>

          <!-- Alert Box -->
          <div *ngIf="errorMessage" class="auth-alert error">
            {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="auth-alert success">
            {{ successMessage }}
          </div>

          <!-- Quick 1-Click Demo Login Bar -->
          <div class="demo-login-box">
            <span class="demo-title">⚡ 1-Click Demo Personas:</span>
            <div class="demo-buttons-grid">
              <button type="button" (click)="loginAsDemo('STUDENT')" class="demo-btn student">
                🎓 Student (Alex)
              </button>
              <button type="button" (click)="loginAsDemo('MENTOR')" class="demo-btn mentor">
                🌱 Mentor (Maya)
              </button>
              <button type="button" (click)="loginAsDemo('EXPERT')" class="demo-btn expert">
                ⭐ Expert (Marcus)
              </button>
              <button type="button" (click)="loginAsDemo('ADMIN')" class="demo-btn admin">
                🛡️ Admin (Eleanor)
              </button>
            </div>
          </div>

          <div class="auth-divider">
            <span>OR SIGN IN WITH CREDENTIALS</span>
          </div>

          <!-- Credentials Form -->
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="username">Username or Academic Email</label>
              <input
                id="username"
                type="text"
                [(ngModel)]="username"
                name="username"
                required
                class="form-control"
                placeholder="e.g. alex_student or alex@berkeley.edu"
              />
            </div>

            <div class="form-group">
              <div class="d-flex justify-between align-center">
                <label class="form-label" for="password">Password</label>
                <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                class="form-control"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" [disabled]="isLoading" class="btn btn-primary btn-block">
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading">Authenticating...</span>
            </button>
          </form>

          <!-- Footer Switch -->
          <div class="auth-footer">
            Don't have an account yet?
            <a routerLink="/register" class="text-gold font-bold">Register here</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      padding: 60px 0;
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      background: linear-gradient(180deg, var(--color-cream-light) 0%, var(--color-cream) 100%);
    }

    .auth-container {
      display: flex;
      justify-content: center;
    }

    .auth-card {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 520px;
      padding: 40px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .auth-logo {
      width: 52px;
      height: 52px;
      background: var(--color-forest);
      color: var(--color-gold);
      border-radius: var(--radius-md);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(24, 63, 53, 0.2);
    }

    .auth-header h2 {
      font-size: 1.8rem;
      color: var(--color-forest);
      margin-bottom: 8px;
    }

    .auth-header p {
      font-size: 0.92rem;
      color: var(--color-charcoal-muted);
    }

    .auth-alert {
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .auth-alert.error {
      background: var(--color-danger-subtle);
      color: var(--color-danger);
      border: 1px solid rgba(192, 57, 43, 0.3);
    }

    .auth-alert.success {
      background: var(--color-success-subtle);
      color: var(--color-success);
      border: 1px solid rgba(46, 125, 50, 0.3);
    }

    .demo-login-box {
      background: var(--color-cream);
      border: 1px dashed var(--color-gold);
      border-radius: var(--radius-sm);
      padding: 16px;
      margin-bottom: 24px;
    }

    .demo-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--color-forest);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 10px;
    }

    .demo-buttons-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .demo-btn {
      padding: 8px 10px;
      font-size: 0.82rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      background: var(--color-white);
      color: var(--color-charcoal);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .demo-btn:hover {
      background: var(--color-forest);
      color: var(--color-white);
      border-color: var(--color-forest);
    }

    .auth-divider {
      text-align: center;
      position: relative;
      margin: 24px 0;
    }

    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--color-border);
    }

    .auth-divider span {
      background: var(--color-white);
      padding: 0 12px;
      position: relative;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-charcoal-muted);
      letter-spacing: 0.05em;
    }

    .forgot-link {
      font-size: 0.8rem;
      color: var(--color-gold);
      font-weight: 600;
    }

    .btn-block {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
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
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginAsDemo(role: UserRole): void {
    const demoCredentials: Record<UserRole, { u: string; p: string }> = {
      STUDENT: { u: 'alex_student', p: 'password123' },
      MENTOR: { u: 'maya_mentor', p: 'password123' },
      EXPERT: { u: 'dr_marcus', p: 'password123' },
      ADMIN: { u: 'admin', p: 'password123' }
    };

    const creds = demoCredentials[role];
    this.username = creds.u;
    this.password = creds.p;
    this.onSubmit();
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username/email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = `Welcome back, ${res.user.first_name || res.user.username}! Redirecting to dashboard...`;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 600);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.detail || err?.error?.error || 'Invalid credentials. Please verify your username and password.';
      }
    });
  }
}
