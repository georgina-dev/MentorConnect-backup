import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar-wrapper">
      <div class="container navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="navbar-brand">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">Mentor<span class="text-gold">Connect</span></span>
            <span class="brand-tagline">Peer Mentorship Network</span>
          </div>
        </a>

        <!-- Main Navigation Links -->
        <nav class="navbar-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
          <a routerLink="/explore" routerLinkActive="active" class="nav-link">Explore & Discover</a>
          <a routerLink="/mentorship" routerLinkActive="active" class="nav-link">Mentorship</a>
          <a routerLink="/messages" routerLinkActive="active" class="nav-link">
            Collaboration & Chat
            <span class="nav-pill">3</span>
          </a>
          <a *ngIf="currentUser?.role === 'ADMIN'" routerLink="/admin-dashboard" routerLinkActive="active" class="nav-link text-danger-nav">
            Admin Panel
          </a>
        </nav>

        <!-- Right Controls: Role Switcher & User Profile / Auth -->
        <div class="navbar-actions">
          <!-- Role Switcher Quick Pill (for easy reviewing) -->
          <div class="role-switcher-dropdown">
            <label class="switcher-label">Role Preview:</label>
            <select (change)="onRoleChange($event)" [value]="currentUser?.role || 'STUDENT'" class="role-select">
              <option value="STUDENT">🎓 Student (Mentee)</option>
              <option value="MENTOR">🌱 Peer Mentor</option>
              <option value="EXPERT">⭐ Industry Expert</option>
              <option value="ADMIN">🛡️ Platform Admin</option>
            </select>
          </div>

          <!-- User Profile & Status Pill -->
          <ng-container *ngIf="currentUser; else authButtons">
            <div class="user-menu">
              <a routerLink="/profile" class="user-profile-btn" title="View Profile">
                <img [src]="currentUser.avatar_url" [alt]="currentUser.first_name" class="user-avatar" />
                <div class="user-info">
                  <span class="user-name">{{ currentUser.first_name }} {{ currentUser.last_name }}</span>
                  <div class="user-meta">
                    <span class="role-badge" [ngClass]="'role-' + currentUser.role.toLowerCase()">
                      {{ currentUser.role }}
                    </span>
                    <!-- Identity Verification Badge -->
                    <span *ngIf="currentUser.verification_status === 'VERIFIED'" class="status-badge verified" title="Identity Verified">
                      ✓ Verified
                    </span>
                    <span *ngIf="currentUser.verification_status === 'PENDING'" class="status-badge pending" title="Verification Pending Review">
                      ⏳ Pending
                    </span>
                    <span *ngIf="currentUser.verification_status === 'UNVERIFIED'" class="status-badge unverified" title="Unverified - Submit ID">
                      ⚠ Unverified
                    </span>
                  </div>
                </div>
              </a>

              <!-- Settings & Logout Icons -->
              <a routerLink="/settings" class="icon-btn" title="Settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </a>

              <button (click)="logout()" class="icon-btn logout-btn" title="Sign Out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </ng-container>

          <ng-template #authButtons>
            <div class="auth-buttons">
              <a routerLink="/login" class="btn btn-secondary btn-sm">Log In</a>
              <a routerLink="/register" class="btn btn-gold btn-sm">Register</a>
            </div>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      background-color: var(--color-forest);
      color: var(--color-white);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(16, 43, 36, 0.25);
      border-bottom: 2px solid var(--color-gold);
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      gap: 16px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--color-white);
      text-decoration: none;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-gold) 0%, #A6833D 100%);
      color: var(--color-forest-dark);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(197, 164, 93, 0.35);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.1;
      color: var(--color-white);
    }

    .brand-tagline {
      font-size: 0.7rem;
      color: var(--color-cream-dark);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 500;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link {
      color: var(--color-cream);
      font-size: 0.9rem;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }

    .nav-link:hover {
      color: var(--color-white);
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      color: var(--color-white);
      background-color: rgba(197, 164, 93, 0.22);
      border-bottom: 2px solid var(--color-gold);
    }

    .text-danger-nav {
      color: #FFB4AB !important;
    }

    .text-danger-nav:hover {
      background-color: rgba(255, 180, 171, 0.15) !important;
    }

    .nav-pill {
      background-color: var(--color-gold);
      color: var(--color-forest-dark);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 10px;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .role-switcher-dropdown {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 0, 0, 0.22);
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(197, 164, 93, 0.4);
    }

    .switcher-label {
      font-size: 0.72rem;
      color: var(--color-cream-dark);
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-select {
      background: var(--color-forest-dark);
      color: var(--color-white);
      border: 1px solid var(--color-gold);
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 8px;
      cursor: pointer;
      outline: none;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-profile-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.08);
      text-decoration: none;
      transition: background 0.2s ease;
    }

    .user-profile-btn:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-white);
      line-height: 1.2;
    }

    .user-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .role-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .role-student { background: #2B6CB0; color: #FFFFFF; }
    .role-mentor { background: var(--color-sage); color: #183F35; }
    .role-expert { background: var(--color-gold); color: #102B24; }
    .role-admin { background: #E53E3E; color: #FFFFFF; }

    .status-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .status-badge.verified {
      background-color: rgba(120, 155, 120, 0.3);
      color: #A4D4A4;
      border: 1px solid #789B78;
    }

    .status-badge.pending {
      background-color: rgba(217, 130, 43, 0.3);
      color: #FFC078;
      border: 1px solid #D9822B;
    }

    .status-badge.unverified {
      background-color: rgba(255, 255, 255, 0.15);
      color: #E0DAC9;
      border: 1px solid #C0B8A0;
    }

    .icon-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: var(--color-cream);
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .icon-btn:hover {
      background: var(--color-gold);
      color: var(--color-forest-dark);
    }

    .logout-btn:hover {
      background: #C0392B;
      color: var(--color-white);
    }

    @media (max-width: 960px) {
      .brand-tagline, .role-switcher-dropdown .switcher-label {
        display: none;
      }
      .navbar-nav {
        gap: 2px;
      }
      .nav-link {
        padding: 6px 8px;
        font-size: 0.82rem;
      }
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    this.authService.switchRole(role);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
