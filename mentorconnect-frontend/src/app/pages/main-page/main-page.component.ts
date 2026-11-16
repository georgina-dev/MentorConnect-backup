import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="main-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              Verified Peer Mentorship & Collaboration Network
            </div>
            <h1 class="hero-title">
              Connect with Verified Peers, Master Modern Domains,
              <span class="highlight-gold">Elevate Your Career</span>.
            </h1>
            <p class="hero-subtitle">
              MentorConnect connects ambitious students, peer mentors, and world-class domain experts in an authentic, verified learning ecosystem with shared study workspaces, structured roadmaps, and cross-domain knowledge exchange.
            </p>
            <div class="hero-cta-group">
              <a routerLink="/register" class="btn btn-gold btn-lg">
                Join MentorConnect Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a routerLink="/explore" class="btn btn-outline-cream btn-lg">
                Explore Mentors & Resources
              </a>
            </div>

            <!-- Quick Stats Strip -->
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">4,200+</span>
                <span class="stat-label">Active Students</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">850+</span>
                <span class="stat-label">Verified Mentors</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">98.4%</span>
                <span class="stat-label">Identity Verified</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">12,500+</span>
                <span class="stat-label">1-on-1 Sessions</span>
              </div>
            </div>
          </div>

          <!-- Hero Graphic Card / Visual Component Preview -->
          <div class="hero-visual">
            <div class="hero-card-preview">
              <div class="preview-header">
                <div class="window-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <div class="preview-tag">Verified Peer Match Preview</div>
              </div>

              <!-- Mentor Card Sample -->
              <div class="featured-mentor-sample">
                <div class="mentor-sample-top">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80" alt="Maya Patel" class="sample-avatar" />
                  <div>
                    <div class="sample-name-row">
                      <h4>Maya Patel</h4>
                      <span class="verified-pill">✓ Identity Verified</span>
                    </div>
                    <p class="sample-headline">Senior Systems Engineer @ Stripe (CMU Alum)</p>
                    <div class="sample-tags">
                      <span class="sample-tag">Distributed Systems</span>
                      <span class="sample-tag">Django</span>
                      <span class="sample-tag">System Design</span>
                    </div>
                  </div>
                </div>

                <div class="sample-mentorship-progress">
                  <div class="progress-labels">
                    <span>Career Milestone: Distributed KV Store</span>
                    <span class="text-gold font-bold">75% Complete</span>
                  </div>
                  <div class="sample-progress-bar">
                    <div class="sample-progress-fill" style="width: 75%"></div>
                  </div>
                </div>

                <div class="sample-actions">
                  <div class="session-pill">
                    <span class="live-dot"></span> Next 1-on-1: Tomorrow, 4:00 PM
                  </div>
                  <a routerLink="/messages" class="btn btn-primary btn-sm">Enter Workspace</a>
                </div>
              </div>

              <!-- AI Matching Teaser Badge -->
              <div class="ai-teaser-box">
                <div class="ai-teaser-icon">🤖</div>
                <div class="ai-teaser-text">
                  <strong>AI Matching Engine Integration</strong>
                  <p>Dynamic neural embeddings matching students and mentors by skill graph, availability, and learning velocity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 Core Objectives Section -->
      <section class="section objectives-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">Platform Capabilities</span>
            <h2 class="section-title">Built for Real Academic & Career Advancement</h2>
            <p class="section-lead">
              MentorConnect combines verified credentials, collaborative workspaces, and structured milestone tracking to deliver authentic mentorship.
            </p>
          </div>

          <div class="objectives-grid">
            <!-- Objective 1 -->
            <div class="objective-card">
              <div class="obj-icon bg-forest-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <h3 class="obj-title">1. Registration & Verified Credentials</h3>
              <p class="obj-desc">
                Institutional ID verification, university email validation (.edu), and degree credential audits ensure you are connecting with authentic students and verified industry engineers.
              </p>
              <div class="obj-feature-list">
                <span>✓ Multi-document verification audit</span>
                <span>✓ Public verifiable profile badge</span>
                <span>✓ Role-tailored onboarding flow</span>
              </div>
            </div>

            <!-- Objective 2 -->
            <div class="objective-card">
              <div class="obj-icon bg-gold-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3 class="obj-title">2. Cross-Domain Content Sharing</h3>
              <p class="obj-desc">
                Share and access high-impact architectural blueprints, code repositories, interview playbooks, research summaries, and design token hierarchies across technical fields.
              </p>
              <div class="obj-feature-list">
                <span>✓ Domain-tagged resource library</span>
                <span>✓ Peer upvoting & discussions</span>
                <span>✓ Interactive code snippet previews</span>
              </div>
            </div>

            <!-- Objective 3 -->
            <div class="objective-card">
              <div class="obj-icon bg-sage-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 class="obj-title">3. Shared Workspaces & Channels</h3>
              <p class="obj-desc">
                Collaborate in dedicated study groups with integrated markdown documentation, kanban task tracking, and specialized discussion channels (#system-design, #algorithms).
              </p>
              <div class="obj-feature-list">
                <span>✓ Real-time topic discussion channels</span>
                <span>✓ Shared study workspace sprint boards</span>
                <span>✓ Direct 1-on-1 mentor messaging</span>
              </div>
            </div>

            <!-- Objective 4 -->
            <div class="objective-card">
              <div class="obj-icon bg-forest-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 class="obj-title">4. Progress Tracking & Milestones</h3>
              <p class="obj-desc">
                Structured career progression milestones with mentor sign-offs, feedback history, hours logged, and portfolio readiness checklists.
              </p>
              <div class="obj-feature-list">
                <span>✓ Step-by-step career milestone roadmaps</span>
                <span>✓ 1-on-1 meeting scheduler & notes</span>
                <span>✓ Endorsement & review badges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Domain Tracks Showcase -->
      <section class="section domains-section">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">Academic & Professional Paths</span>
            <h2 class="section-title">Explore Specialized Knowledge Tracks</h2>
            <p class="section-lead">Find peers and mentors deep inside your discipline.</p>
          </div>

          <div class="domains-grid">
            <div class="domain-card" *ngFor="let track of domainTracks">
              <div class="domain-icon">{{ track.icon }}</div>
              <h3 class="domain-name">{{ track.title }}</h3>
              <p class="domain-desc">{{ track.desc }}</p>
              <div class="domain-meta">
                <span>{{ track.mentors }} Mentors</span>
                <span>•</span>
                <span>{{ track.resources }} Resources</span>
              </div>
              <a [routerLink]="['/explore']" [queryParams]="{domain: track.title}" class="domain-link">
                Explore Track →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- User Roles Section -->
      <section class="section roles-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">A Place for Every Learner</span>
            <h2 class="section-title">How MentorConnect Works for You</h2>
          </div>

          <div class="roles-grid">
            <div class="role-box">
              <div class="role-badge-box student">Student / Mentee</div>
              <h4>Accelerate Your Skills</h4>
              <p>Book 1-on-1 sessions with students who recently aced the courses, internships, and research papers you are taking on right now.</p>
              <ul class="role-points">
                <li>Mock technical & behavioral interviews</li>
                <li>Coursework and portfolio guidance</li>
                <li>Join study labs and peer cohorts</li>
              </ul>
              <a routerLink="/register" class="btn btn-secondary btn-sm">Join as Student</a>
            </div>

            <div class="role-box">
              <div class="role-badge-box mentor">Peer Mentor</div>
              <h4>Give Back & Gain Leadership</h4>
              <p>Guide junior students, share your verified portfolio assets, solidify your own knowledge, and build public mentorship credentials.</p>
              <ul class="role-points">
                <li>Flexible hours & session scheduling</li>
                <li>Verified mentor badge on your profile</li>
                <li>Lead active project workspaces</li>
              </ul>
              <a routerLink="/register" class="btn btn-sage btn-sm">Become a Mentor</a>
            </div>

            <div class="role-box">
              <div class="role-badge-box expert">Industry & Academic Expert</div>
              <h4>High-Impact Advisory</h4>
              <p>Host masterclasses, review breakthrough student research, and spot exceptional talent before they enter the public market.</p>
              <ul class="role-points">
                <li>High-level architectural advising</li>
                <li>Pre-publication research audits</li>
                <li>Direct recruitment pipelines</li>
              </ul>
              <a routerLink="/register" class="btn btn-gold btn-sm">Join as Expert</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Banner -->
      <section class="cta-section">
        <div class="container text-center">
          <h2 class="cta-title">Ready to Transform Your Learning Journey?</h2>
          <p class="cta-subtitle">
            Join thousands of verified students, mentors, and experts on MentorConnect today.
          </p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn btn-gold btn-lg">Create Free Account</a>
            <a routerLink="/login" class="btn btn-outline-white btn-lg">Sign In with Demo Persona</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .main-page {
      display: flex;
      flex-direction: column;
    }

    /* Hero */
    .hero-section {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0F2A23 100%);
      color: var(--color-white);
      padding: 70px 0 90px;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: -20%;
      right: -10%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(197, 164, 93, 0.12) 0%, rgba(24, 63, 53, 0) 70%);
      pointer-events: none;
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      gap: 50px;
      position: relative;
      z-index: 2;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(197, 164, 93, 0.18);
      color: var(--color-gold);
      border: 1px solid var(--color-gold);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--color-gold);
      box-shadow: 0 0 8px var(--color-gold);
    }

    .hero-title {
      color: var(--color-white);
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.025em;
      margin-bottom: 22px;
    }

    .highlight-gold {
      color: var(--color-gold);
      position: relative;
      display: inline-block;
    }

    .hero-subtitle {
      font-size: 1.12rem;
      color: var(--color-cream);
      line-height: 1.65;
      margin-bottom: 34px;
      max-width: 620px;
    }

    .hero-cta-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 45px;
    }

    .btn-outline-cream {
      border: 1.5px solid var(--color-cream);
      color: var(--color-cream);
      background: transparent;
    }

    .btn-outline-cream:hover {
      background: var(--color-cream);
      color: var(--color-forest);
    }

    .btn-outline-white {
      border: 1.5px solid var(--color-white);
      color: var(--color-white);
      background: transparent;
    }

    .btn-outline-white:hover {
      background: var(--color-white);
      color: var(--color-forest);
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 24px;
      padding-top: 24px;
      border-top: 1px solid rgba(243, 240, 230, 0.15);
      flex-wrap: wrap;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--color-gold);
    }

    .stat-label {
      font-size: 0.78rem;
      color: var(--color-cream-dark);
      text-transform: uppercase;
      font-weight: 600;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: rgba(243, 240, 230, 0.2);
    }

    /* Hero Card Preview */
    .hero-card-preview {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      border: 2px solid var(--color-gold);
      color: var(--color-charcoal);
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      margin-bottom: 18px;
      border-bottom: 1px solid var(--color-border-subtle);
    }

    .window-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot.red { background-color: #FF5F56; }
    .dot.yellow { background-color: #FFBD2E; }
    .dot.green { background-color: #27C93F; }

    .preview-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-forest);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .featured-mentor-sample {
      background: var(--color-cream-light);
      border-radius: var(--radius-md);
      padding: 20px;
      border: 1px solid var(--color-border);
      margin-bottom: 16px;
    }

    .mentor-sample-top {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .sample-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .sample-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .sample-name-row h4 {
      font-size: 1.15rem;
      color: var(--color-forest);
    }

    .verified-pill {
      font-size: 0.7rem;
      background: rgba(120, 155, 120, 0.25);
      color: var(--color-forest);
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 700;
      border: 1px solid var(--color-sage);
    }

    .sample-headline {
      font-size: 0.85rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 8px;
    }

    .sample-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .sample-tag {
      background: var(--color-white);
      color: var(--color-forest);
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid var(--color-border);
    }

    .sample-mentorship-progress {
      background: var(--color-white);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 14px;
      border: 1px solid var(--color-border-subtle);
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .sample-progress-bar {
      height: 7px;
      background: var(--color-cream);
      border-radius: 10px;
      overflow: hidden;
    }

    .sample-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-forest) 0%, var(--color-gold) 100%);
      border-radius: 10px;
    }

    .sample-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .session-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-charcoal);
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #27C93F;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.4; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0.4; transform: scale(0.9); }
    }

    .ai-teaser-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--color-cream);
      border-radius: var(--radius-sm);
      padding: 12px;
      border: 1px dashed var(--color-gold);
    }

    .ai-teaser-icon {
      font-size: 1.6rem;
    }

    .ai-teaser-text strong {
      display: block;
      font-size: 0.85rem;
      color: var(--color-forest);
    }

    .ai-teaser-text p {
      font-size: 0.78rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    /* Sections Common */
    .section {
      padding: 80px 0;
    }

    .section-header {
      margin-bottom: 50px;
    }

    .section-header.text-center {
      text-align: center;
      max-width: 760px;
      margin-left: auto;
      margin-right: auto;
    }

    .section-eyebrow {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-gold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 8px;
    }

    .section-title {
      font-size: 2.2rem;
      margin-bottom: 12px;
    }

    .section-lead {
      font-size: 1.05rem;
      color: var(--color-charcoal-muted);
    }

    /* Objectives Grid */
    .objectives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 28px;
    }

    .objective-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      padding: 30px;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
    }

    .objective-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-gold);
    }

    .obj-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .bg-forest-icon { background: var(--color-forest); color: var(--color-white); }
    .bg-gold-icon { background: var(--color-gold); color: var(--color-white); }
    .bg-sage-icon { background: var(--color-sage); color: var(--color-white); }

    .obj-title {
      font-size: 1.2rem;
      margin-bottom: 12px;
      color: var(--color-forest);
    }

    .obj-desc {
      font-size: 0.92rem;
      color: var(--color-charcoal);
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .obj-feature-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-forest);
      padding-top: 14px;
      border-top: 1px solid var(--color-border-subtle);
    }

    /* Domains Grid */
    .domains-section {
      background: var(--color-cream);
    }

    .domains-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .domain-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      padding: 24px;
      border: 1px solid var(--color-border);
      transition: transform 0.2s ease;
    }

    .domain-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-forest);
    }

    .domain-icon {
      font-size: 2rem;
      margin-bottom: 14px;
    }

    .domain-name {
      font-size: 1.2rem;
      color: var(--color-forest);
      margin-bottom: 8px;
    }

    .domain-desc {
      font-size: 0.88rem;
      color: var(--color-charcoal-muted);
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .domain-meta {
      display: flex;
      gap: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-forest);
      margin-bottom: 14px;
    }

    .domain-link {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--color-gold);
    }

    /* Roles */
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .role-box {
      background: var(--color-white);
      border-radius: var(--radius-md);
      padding: 32px;
      border: 1.5px solid var(--color-border);
      display: flex;
      flex-direction: column;
    }

    .role-badge-box {
      display: inline-block;
      align-self: flex-start;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .role-badge-box.student { background: #E8F0FE; color: #1967D2; }
    .role-badge-box.mentor { background: var(--color-forest-subtle); color: var(--color-forest); }
    .role-badge-box.expert { background: var(--color-gold-subtle); color: #7A5C13; }

    .role-box h4 {
      font-size: 1.25rem;
      margin-bottom: 10px;
    }

    .role-box p {
      font-size: 0.92rem;
      color: var(--color-charcoal);
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .role-points {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 26px;
      font-size: 0.88rem;
      color: var(--color-charcoal-light);
      flex-grow: 1;
    }

    .role-points li::before {
      content: '✓ ';
      color: var(--color-sage);
      font-weight: 700;
    }

    /* CTA */
    .cta-section {
      background: var(--color-forest);
      color: var(--color-white);
      padding: 80px 0;
      border-top: 3px solid var(--color-gold);
    }

    .cta-title {
      font-size: 2.4rem;
      color: var(--color-white);
      margin-bottom: 16px;
    }

    .cta-subtitle {
      font-size: 1.15rem;
      color: var(--color-cream);
      max-width: 600px;
      margin: 0 auto 32px;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    @media (max-width: 960px) {
      .hero-container {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 2.2rem;
      }
    }
  `]
})
export class MainPageComponent {
  domainTracks = [
    {
      icon: '💻',
      title: 'Computer Science',
      desc: 'Distributed systems, memory safety, concurrency, caching architectures, and operating system internals.',
      mentors: 320,
      resources: 48
    },
    {
      icon: '🧠',
      title: 'Artificial Intelligence',
      desc: 'Large language models, reinforcement learning from human feedback (RLHF), attention optimization, and diffusion.',
      mentors: 190,
      resources: 62
    },
    {
      icon: '🎨',
      title: 'Product Design',
      desc: 'Design systems, Figma component architectures, accessibility auditing, and user research methodologies.',
      mentors: 115,
      resources: 34
    },
    {
      icon: '📈',
      title: 'Business & Finance',
      desc: 'Quantitative modeling, venture capital analysis, market risk simulation, and fintech regulatory tech.',
      mentors: 92,
      resources: 29
    },
    {
      icon: '🧬',
      title: 'Bioinformatics',
      desc: 'AlphaFold protein structure prediction, genomic sequence analysis, molecular dynamics, and proteomic graphs.',
      mentors: 68,
      resources: 22
    },
    {
      icon: '🧭',
      title: 'Career Navigation',
      desc: 'Resume tearing, technical whiteboard coaching, salary negotiation scripts, and graduate school research proposals.',
      mentors: 410,
      resources: 86
    }
  ];
}
