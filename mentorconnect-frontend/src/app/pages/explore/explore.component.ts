import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContentService } from '../../services/content.service';
import { MentorshipService } from '../../services/mentorship.service';
import { User, CuratedResource } from '../../models/user.model';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="explore-page">
      <div class="container">
        <!-- Explore Header -->
        <div class="explore-header">
          <span class="eyebrow">Discover Mentors, Resources & Collaborative Workspaces</span>
          <h1>Explore the MentorConnect Knowledge Network</h1>
          <p class="lead">
            Find verified peer mentors across technical domains, browse community-contributed educational resources, and accelerate your learning milestones.
          </p>

          <!-- Search & Filter Controls -->
          <div class="filter-card">
            <div class="search-input-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="applyFilters()"
                placeholder="Search mentors by name, company, university, or skills (e.g. System Design, PyTorch, Raft)..."
              />
            </div>

            <div class="filters-row">
              <div class="filter-group">
                <label>Domain Focus:</label>
                <select [(ngModel)]="selectedDomain" (ngModelChange)="applyFilters()">
                  <option value="ALL">All Technical & Academic Domains</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Bioinformatics">Bioinformatics</option>
                  <option value="Career Navigation">Career Navigation</option>
                </select>
              </div>

              <div class="filter-group">
                <label>Role:</label>
                <select [(ngModel)]="selectedRole" (ngModelChange)="applyFilters()">
                  <option value="ALL">All Roles</option>
                  <option value="MENTOR">Peer Mentors</option>
                  <option value="EXPERT">Domain Experts</option>
                  <option value="STUDENT">Peer Students</option>
                </select>
              </div>

              <div class="filter-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="verifiedOnly" (ngModelChange)="applyFilters()" />
                  Verified Credentials Only
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 1: Mentors & Domain Leaders -->
        <section class="mentors-section mb-5">
          <div class="section-title-row">
            <h2>Verified Mentors & Domain Leaders ({{ filteredUsers.length }})</h2>
            <span class="active-filter-badge">Showing {{ selectedDomain === 'ALL' ? 'All Domains' : selectedDomain }}</span>
          </div>

          <div class="mentors-grid">
            <div *ngFor="let u of filteredUsers" class="mentor-card">
              <div class="mentor-card-top">
                <img [src]="u.avatar_url" [alt]="u.first_name" class="m-avatar" />
                <div class="m-title-area">
                  <div class="m-name-line">
                    <h4>{{ u.first_name }} {{ u.last_name }}</h4>
                    <span *ngIf="u.verification_status === 'VERIFIED'" class="badge badge-verified" title="Identity Verified">
                      ✓ Verified
                    </span>
                  </div>
                  <span class="m-role-tag" [ngClass]="'role-' + u.role.toLowerCase()">{{ u.role }}</span>
                  <p class="m-inst">🏛️ {{ u.institution_or_company }}</p>
                </div>
              </div>

              <p class="m-headline">{{ u.headline }}</p>

              <div class="m-domains-wrap">
                <span *ngFor="let d of u.domains" class="m-domain-pill">{{ d }}</span>
              </div>

              <div class="m-skills-wrap">
                <span *ngFor="let s of u.skills" class="m-skill-pill">{{ s }}</span>
              </div>

              <div class="m-card-footer">
                <div class="m-stats">
                  <span class="m-rating">★ {{ u.rating || 5.0 }}</span>
                  <span class="m-sessions">{{ u.sessions_completed || 0 }} sessions</span>
                </div>
                <button (click)="openRequestModal(u)" class="btn btn-primary btn-sm">Request Mentorship</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Cross-Domain Content & Curated Resources (Objective 2 & 4) -->
        <section class="resources-section">
          <div class="section-title-row">
            <div>
              <h2>Cross-Domain Curated Resources ({{ filteredResources.length }})</h2>
              <p class="section-subtitle">Objective 2: Verified guides, architectural blueprints, and code templates.</p>
            </div>
            <button (click)="isResourceModalOpen = true" class="btn btn-gold btn-sm">+ Share New Resource</button>
          </div>

          <div class="resources-grid">
            <div *ngFor="let r of filteredResources" class="resource-card">
              <div class="res-type-row">
                <span class="res-type-tag">{{ r.type }}</span>
                <span class="res-domain-tag">{{ r.domain }}</span>
              </div>

              <h4 class="res-title">{{ r.title }}</h4>
              <p class="res-desc">{{ r.description }}</p>

              <div class="res-tags">
                <span *ngFor="let tag of r.tags" class="res-tag">#{{ tag }}</span>
              </div>

              <div class="res-footer">
                <div class="res-author-info">
                  <span>By <strong>{{ r.author }}</strong> ({{ r.authorRole }})</span>
                </div>
                <div class="res-actions">
                  <button (click)="likeResource(r.id)" class="like-btn" title="Upvote">
                    ❤️ {{ r.likes }}
                  </button>
                  <a [href]="r.link" target="_blank" class="btn btn-secondary btn-sm">Read Resource ↗</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Request Mentorship Modal -->
        <div *ngIf="isRequestModalOpen" class="modal-overlay">
          <div class="modal-card">
            <div class="modal-header">
              <h3>Request 1-on-1 Mentorship</h3>
              <button (click)="closeRequestModal()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div *ngIf="targetMentor" class="target-mentor-summary">
                <img [src]="targetMentor.avatar_url" class="modal-avatar" />
                <div>
                  <strong>{{ targetMentor.first_name }} {{ targetMentor.last_name }}</strong>
                  <p>{{ targetMentor.headline }} • {{ targetMentor.institution_or_company }}</p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Domain Focus</label>
                <select [(ngModel)]="requestDomain" class="form-control">
                  <option *ngFor="let d of targetMentor?.domains" [value]="d">{{ d }}</option>
                  <option value="System Design">System Design</option>
                  <option value="Career Navigation">Career Navigation</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Introduction & What You're Working On</label>
                <textarea
                  [(ngModel)]="requestMessage"
                  class="form-control"
                  rows="3"
                  placeholder="Hi! I am working on my distributed consensus semester project and would love feedback..."
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Specific Goal for this Mentorship Pairing</label>
                <input
                  type="text"
                  [(ngModel)]="requestGoals"
                  class="form-control"
                  placeholder="e.g. Master Raft leader lease timeouts and complete mock technical interview"
                />
              </div>

              <div *ngIf="requestSentSuccess" class="alert success-alert">
                Mentorship request transmitted successfully! The mentor has been notified.
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="closeRequestModal()" class="btn btn-secondary">Close</button>
              <button (click)="submitMentorshipRequest()" [disabled]="requestSentSuccess" class="btn btn-primary">
                Send Request
              </button>
            </div>
          </div>
        </div>

        <!-- Share Resource Modal -->
        <div *ngIf="isResourceModalOpen" class="modal-overlay">
          <div class="modal-card">
            <div class="modal-header">
              <h3>Share Educational or Professional Content</h3>
              <button (click)="isResourceModalOpen = false" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Resource Title</label>
                <input type="text" [(ngModel)]="newResTitle" class="form-control" placeholder="e.g. KV Cache Compression Benchmarks" />
              </div>
              <div class="form-group">
                <label class="form-label">Domain Track</label>
                <select [(ngModel)]="newResDomain" class="form-control">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Bioinformatics">Bioinformatics</option>
                  <option value="Career Navigation">Career Navigation</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Resource Type</label>
                <select [(ngModel)]="newResType" class="form-control">
                  <option value="Guide">Guide / Tutorial</option>
                  <option value="Template">Architecture Template</option>
                  <option value="Research Paper">Research Paper Summary</option>
                  <option value="Code Repository">Code Repository</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Summary / Description</label>
                <textarea [(ngModel)]="newResDesc" class="form-control" rows="3" placeholder="Explain the key takeaways..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">External Link or Document URL</label>
                <input type="text" [(ngModel)]="newResLink" class="form-control" placeholder="https://..." />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="isResourceModalOpen = false" class="btn btn-secondary">Cancel</button>
              <button (click)="submitResource()" class="btn btn-gold">Publish to Community</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .explore-page {
      padding: 40px 0 70px;
    }

    .explore-header {
      margin-bottom: 40px;
    }

    .eyebrow {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-gold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      margin-bottom: 6px;
    }

    .explore-header h1 {
      font-size: 2.4rem;
      color: var(--color-forest);
      margin-bottom: 12px;
    }

    .lead {
      font-size: 1.05rem;
      color: var(--color-charcoal-muted);
      max-width: 820px;
      margin-bottom: 24px;
    }

    /* Filter Card */
    .filter-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }

    .search-input-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      background: var(--color-cream-light);
    }

    .search-input-box svg {
      color: var(--color-forest);
    }

    .search-input-box input {
      border: none;
      background: transparent;
      width: 100%;
      font-size: 0.95rem;
      font-family: var(--font-sans);
      outline: none;
      color: var(--color-charcoal);
    }

    .filters-row {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-forest);
    }

    .filter-group select {
      padding: 6px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      background: var(--color-white);
      color: var(--color-charcoal);
      outline: none;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-forest);
      cursor: pointer;
    }

    /* Section Title */
    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .section-title-row h2 {
      font-size: 1.6rem;
      color: var(--color-forest);
      margin: 0;
    }

    .section-subtitle {
      font-size: 0.85rem;
      color: var(--color-charcoal-muted);
      margin: 2px 0 0;
    }

    .active-filter-badge {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-gold);
      background: var(--color-gold-subtle);
      padding: 4px 10px;
      border-radius: 4px;
    }

    .mb-5 { margin-bottom: 50px; }

    /* Mentors Grid */
    .mentors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .mentor-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
    }

    .mentor-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-forest);
    }

    .mentor-card-top {
      display: flex;
      gap: 14px;
      margin-bottom: 12px;
    }

    .m-avatar {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .m-title-area {
      flex: 1;
    }

    .m-name-line {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .m-name-line h4 {
      font-size: 1.1rem;
      color: var(--color-forest);
      margin: 0;
    }

    .m-role-tag {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      display: inline-block;
      margin-top: 2px;
    }

    .role-student { background: #E8F0FE; color: #1967D2; }
    .role-mentor { background: var(--color-forest-subtle); color: var(--color-forest); }
    .role-expert { background: var(--color-gold-subtle); color: #7A5C13; }
    .role-admin { background: #FFCDD2; color: #C62828; }

    .m-inst {
      font-size: 0.8rem;
      color: var(--color-charcoal-muted);
      margin: 2px 0 0;
    }

    .m-headline {
      font-size: 0.88rem;
      color: var(--color-charcoal);
      line-height: 1.45;
      margin-bottom: 14px;
      flex-grow: 1;
    }

    .m-domains-wrap, .m-skills-wrap {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .m-domain-pill {
      background: var(--color-forest-subtle);
      color: var(--color-forest);
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .m-skill-pill {
      background: var(--color-cream);
      color: var(--color-charcoal);
      font-size: 0.72rem;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--color-border);
    }

    .m-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid var(--color-border-subtle);
      margin-top: 10px;
    }

    .m-stats {
      display: flex;
      gap: 8px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .m-rating {
      color: #8C6D27;
    }

    .m-sessions {
      color: var(--color-charcoal-muted);
    }

    /* Resources Grid */
    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    .resource-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      padding: 22px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
    }

    .res-type-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .res-type-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-gold);
      background: var(--color-gold-subtle);
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .res-domain-tag {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--color-forest);
    }

    .res-title {
      font-size: 1.1rem;
      color: var(--color-forest);
      margin-bottom: 8px;
      line-height: 1.35;
    }

    .res-desc {
      font-size: 0.88rem;
      color: var(--color-charcoal);
      line-height: 1.5;
      margin-bottom: 14px;
      flex-grow: 1;
    }

    .res-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .res-tag {
      font-size: 0.72rem;
      color: var(--color-charcoal-muted);
      background: var(--color-cream-light);
      padding: 2px 6px;
      border-radius: 3px;
    }

    .res-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid var(--color-border-subtle);
      font-size: 0.8rem;
    }

    .res-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .like-btn {
      background: var(--color-cream);
      border: 1px solid var(--color-border);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
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

    .target-mentor-summary {
      display: flex;
      gap: 12px;
      align-items: center;
      background: var(--color-cream-light);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      border: 1px solid var(--color-border);
    }

    .modal-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-gold);
    }

    .alert.success-alert {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 10px;
      border-radius: 4px;
      font-size: 0.85rem;
      margin-top: 14px;
    }
  `]
})
export class ExploreComponent implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];

  allResources: CuratedResource[] = [];
  filteredResources: CuratedResource[] = [];

  // Filter state
  searchQuery = '';
  selectedDomain = 'ALL';
  selectedRole = 'ALL';
  verifiedOnly = false;

  // Request modal state
  isRequestModalOpen = false;
  targetMentor: User | null = null;
  requestDomain = 'Computer Science';
  requestMessage = '';
  requestGoals = '';
  requestSentSuccess = false;

  // Resource contribution modal state
  isResourceModalOpen = false;
  newResTitle = '';
  newResDomain = 'Computer Science';
  newResType: any = 'Guide';
  newResDesc = '';
  newResLink = '';

  constructor(
    private authService: AuthService,
    private contentService: ContentService,
    private mentorshipService: MentorshipService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check query params (e.g. ?domain=Computer Science)
    this.route.queryParams.subscribe(params => {
      if (params['domain']) {
        this.selectedDomain = params['domain'];
      }
    });

    this.authService.getUsers().subscribe(users => {
      this.allUsers = users;
      this.applyFilters();
    });

    this.contentService.resources$.subscribe(res => {
      this.allResources = res;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // Mentors filtering
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.allUsers.filter(u => {
      // Role match
      if (this.selectedRole !== 'ALL' && u.role !== this.selectedRole) return false;
      // Verification match
      if (this.verifiedOnly && u.verification_status !== 'VERIFIED') return false;
      // Domain match
      if (this.selectedDomain !== 'ALL') {
        const hasDomain = u.domains.some(d => d.toLowerCase().includes(this.selectedDomain.toLowerCase()));
        if (!hasDomain) return false;
      }
      // Search match
      if (query) {
        const matchesName = `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase().includes(query);
        const matchesInst = (u.institution_or_company || '').toLowerCase().includes(query);
        const matchesHeadline = (u.headline || '').toLowerCase().includes(query);
        const matchesSkills = (u.skills || []).some(s => s.toLowerCase().includes(query));
        if (!matchesName && !matchesInst && !matchesHeadline && !matchesSkills) return false;
      }
      return true;
    });

    // Content resources filtering
    this.filteredResources = this.allResources.filter(r => {
      if (this.selectedDomain !== 'ALL') {
        if (!r.domain.toLowerCase().includes(this.selectedDomain.toLowerCase())) return false;
      }
      if (query) {
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesDesc = r.description.toLowerCase().includes(query);
        const matchesTags = r.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }

  openRequestModal(mentor: User): void {
    this.targetMentor = mentor;
    this.requestDomain = mentor.domains[0] || 'Computer Science';
    this.requestMessage = '';
    this.requestGoals = '';
    this.requestSentSuccess = false;
    this.isRequestModalOpen = true;
  }

  closeRequestModal(): void {
    this.isRequestModalOpen = false;
  }

  submitMentorshipRequest(): void {
    if (!this.targetMentor) return;
    this.mentorshipService.sendMentorshipRequest(
      this.targetMentor,
      this.requestDomain,
      this.requestMessage || 'I would love to learn from your experience!',
      this.requestGoals || 'Accelerate mastery in this domain.'
    ).subscribe(() => {
      this.requestSentSuccess = true;
      setTimeout(() => {
        this.closeRequestModal();
      }, 1200);
    });
  }

  likeResource(id: number): void {
    this.contentService.likeResource(id);
  }

  submitResource(): void {
    if (!this.newResTitle) return;
    const currentUser = this.authService.currentUser;
    this.contentService.addResource({
      title: this.newResTitle,
      domain: this.newResDomain,
      type: this.newResType,
      author: currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : 'Community Contributor',
      authorRole: currentUser?.role || 'MENTOR',
      authorVerified: currentUser?.verification_status === 'VERIFIED',
      description: this.newResDesc || 'Valuable domain resource.',
      link: this.newResLink || 'https://mentorconnect.org',
      tags: [this.newResDomain, this.newResType]
    });
    this.isResourceModalOpen = false;
    this.newResTitle = '';
    this.newResDesc = '';
  }
}
