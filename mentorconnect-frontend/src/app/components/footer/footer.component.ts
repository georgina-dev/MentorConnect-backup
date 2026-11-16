import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-wrapper">
      <div class="container footer-content">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-col brand-col">
            <div class="footer-brand">
              <span class="brand-name">Mentor<span class="text-gold">Connect</span></span>
              <span class="brand-pill">Verified Peer Network</span>
            </div>
            <p class="brand-desc">
              Empowering students, peer mentors, and verified domain experts to collaborate, share academic resources, and accelerate career trajectories.
            </p>
            <div class="palette-swatch">
              <span class="swatch s-forest" title="Deep Forest Green #183F35"></span>
              <span class="swatch s-cream" title="Warm Cream #F3F0E6"></span>
              <span class="swatch s-gold" title="Muted Gold #C5A45D"></span>
              <span class="swatch s-sage" title="Sage Green #789B78"></span>
              <span class="swatch s-charcoal" title="Charcoal #303832"></span>
            </div>
          </div>

          <!-- Domain Tracks -->
          <div class="footer-col">
            <h4 class="footer-title">Domain Tracks</h4>
            <ul class="footer-links">
              <li><a routerLink="/explore" [queryParams]="{domain: 'Computer Science'}">Computer Science & Systems</a></li>
              <li><a routerLink="/explore" [queryParams]="{domain: 'Artificial Intelligence'}">Artificial Intelligence & ML</a></li>
              <li><a routerLink="/explore" [queryParams]="{domain: 'Product Design'}">UI/UX & Product Design</a></li>
              <li><a routerLink="/explore" [queryParams]="{domain: 'Business & Finance'}">Quantitative Finance & FinTech</a></li>
              <li><a routerLink="/explore" [queryParams]="{domain: 'Bioinformatics'}">Bioinformatics & Proteomics</a></li>
            </ul>
          </div>

          <!-- Peer Collaboration -->
          <div class="footer-col">
            <h4 class="footer-title">Collaboration</h4>
            <ul class="footer-links">
              <li><a routerLink="/messages">Discussion Channels</a></li>
              <li><a routerLink="/messages">Shared Study Workspaces</a></li>
              <li><a routerLink="/mentorship">1-on-1 Mentorship Sessions</a></li>
              <li><a routerLink="/explore">Curated Resource Library</a></li>
              <li><a routerLink="/mentorship">Milestone & Progress Tracking</a></li>
            </ul>
          </div>

          <!-- Platform & Verification -->
          <div class="footer-col">
            <h4 class="footer-title">Trust & Governance</h4>
            <ul class="footer-links">
              <li><a routerLink="/profile">Identity Verification Protocol</a></li>
              <li><a routerLink="/register">Institutional Partnerships (.edu)</a></li>
              <li><a routerLink="/settings">Security & Data Privacy</a></li>
              <li><a routerLink="/admin-dashboard">Admin Audit Queue</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 MentorConnect Platform. All rights reserved. Peer Mentorship, Identity Verification & Collaborative Learning.</p>
          <div class="footer-legal-links">
            <a href="#">Academic Integrity</a>
            <span>•</span>
            <a href="#">Code of Conduct</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-wrapper {
      background-color: var(--color-forest-dark);
      color: var(--color-cream);
      padding: 60px 0 24px;
      border-top: 3px solid var(--color-gold);
      margin-top: 60px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
      gap: 40px;
      padding-bottom: 40px;
      border-bottom: 1px solid rgba(243, 240, 230, 0.15);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    .brand-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--color-white);
    }

    .brand-pill {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      background: rgba(197, 164, 93, 0.2);
      color: var(--color-gold);
      padding: 2px 8px;
      border-radius: 12px;
      border: 1px solid var(--color-gold);
    }

    .brand-desc {
      font-size: 0.88rem;
      color: var(--color-cream-dark);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .palette-swatch {
      display: flex;
      gap: 8px;
    }

    .swatch {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .s-forest { background: #183F35; }
    .s-cream { background: #F3F0E6; }
    .s-gold { background: #C5A45D; }
    .s-sage { background: #789B78; }
    .s-charcoal { background: #303832; }

    .footer-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-gold);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      color: var(--color-cream-dark);
      font-size: 0.88rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .footer-links a:hover {
      color: var(--color-gold);
      padding-left: 4px;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      font-size: 0.82rem;
      color: var(--color-cream-dark);
      flex-wrap: wrap;
      gap: 12px;
    }

    .footer-legal-links {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .footer-legal-links a {
      color: var(--color-cream-dark);
    }

    .footer-legal-links a:hover {
      color: var(--color-gold);
    }

    @media (max-width: 900px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
