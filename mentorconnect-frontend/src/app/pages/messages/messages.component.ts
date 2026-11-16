import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CollaborationService } from '../../services/collaboration.service';
import { ChatMessage, DiscussionChannel, SharedWorkspace, User } from '../../models/user.model';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="collab-page">
      <div class="collab-container">
        <!-- ==============================================
             LEFT SIDEBAR: CHANNELS & DIRECT MESSAGES
             ============================================== -->
        <aside class="collab-sidebar">
          <div class="sidebar-header">
            <h3>Peer Collaboration</h3>
            <span class="sidebar-badge">Objective 3</span>
          </div>

          <!-- Discussion Channels Section -->
          <div class="sidebar-section">
            <div class="section-title-label">
              <span>DISCUSSION CHANNELS</span>
              <span class="count-pill">{{ channels.length }}</span>
            </div>
            <div class="channels-list">
              <button
                *ngFor="let ch of channels"
                (click)="selectChannel(ch)"
                class="channel-item"
                [class.active]="selectedChannel?.id === ch.id"
              >
                <span class="hash-symbol">#</span>
                <span class="channel-name">{{ ch.name }}</span>
                <span class="member-count">{{ ch.memberCount }}</span>
              </button>
            </div>
          </div>

          <!-- Direct Mentorship Messages Section -->
          <div class="sidebar-section">
            <div class="section-title-label">
              <span>DIRECT MENTOR MESSAGES</span>
            </div>
            <div class="dm-list">
              <button
                (click)="selectDM(3, 'Maya Patel', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', 'MENTOR')"
                class="dm-item"
                [class.active]="activeRecipientId === 3"
              >
                <div class="dm-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80" class="dm-avatar" />
                  <span class="online-indicator"></span>
                </div>
                <div class="dm-info">
                  <span class="dm-name">Maya Patel</span>
                  <span class="dm-sub">Peer Mentor • Stripe</span>
                </div>
              </button>

              <button
                (click)="selectDM(4, 'Dr. Marcus Rossi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'EXPERT')"
                class="dm-item"
                [class.active]="activeRecipientId === 4"
              >
                <div class="dm-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" class="dm-avatar" />
                  <span class="online-indicator"></span>
                </div>
                <div class="dm-info">
                  <span class="dm-name">Dr. Marcus Rossi</span>
                  <span class="dm-sub">Expert • DeepMind</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Workspaces Selector -->
          <div class="sidebar-section">
            <div class="section-title-label">
              <span>SHARED STUDY WORKSPACES</span>
            </div>
            <div class="workspaces-mini-list">
              <button
                *ngFor="let ws of workspaces"
                (click)="selectWorkspace(ws)"
                class="ws-mini-item"
                [class.active]="selectedWorkspace?.id === ws.id"
              >
                <span class="ws-icon">📂</span>
                <span class="ws-name">{{ ws.title }}</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- ==============================================
             CENTER: ACTIVE CHAT & DISCUSSION STREAM
             ============================================== -->
        <main class="chat-main">
          <!-- Chat Top Bar -->
          <header class="chat-header">
            <div class="chat-header-info">
              <h2 *ngIf="selectedChannel"># {{ selectedChannel.name }}</h2>
              <h2 *ngIf="!selectedChannel">Conversation with {{ activeRecipientName }}</h2>
              <p *ngIf="selectedChannel">{{ selectedChannel.description }} • <strong>{{ selectedChannel.domain }}</strong></p>
              <p *ngIf="!selectedChannel">Direct encrypted 1-on-1 mentorship channel</p>
            </div>

            <div class="chat-header-actions">
              <button
                (click)="showWorkspacePanel = !showWorkspacePanel"
                class="btn btn-secondary btn-sm"
                [class.btn-sage]="showWorkspacePanel"
              >
                <span *ngIf="showWorkspacePanel">Hide Workspace Panel ✕</span>
                <span *ngIf="!showWorkspacePanel">Show Shared Workspace 📋</span>
              </button>
            </div>
          </header>

          <!-- Messages Stream -->
          <div class="messages-stream">
            <div *ngFor="let msg of displayedMessages" class="message-card">
              <img [src]="msg.senderAvatar" [alt]="msg.senderName" class="msg-avatar" />
              <div class="msg-content-wrap">
                <div class="msg-author-line">
                  <span class="msg-sender-name">{{ msg.senderName }}</span>
                  <span *ngIf="msg.senderVerified" class="msg-verified-badge" title="Verified Identity">✓ Verified</span>
                  <span class="msg-role-pill" [ngClass]="'role-' + msg.senderRole.toLowerCase()">{{ msg.senderRole }}</span>
                  <span class="msg-time">{{ msg.timestamp }}</span>
                </div>

                <div class="msg-text">{{ msg.content }}</div>

                <!-- Code Snippet Display if present -->
                <div *ngIf="msg.codeSnippet" class="code-snippet-box">
                  <div class="code-header">
                    <span>Code Snippet</span>
                    <button (click)="copyCode(msg.codeSnippet)" class="copy-btn">Copy</button>
                  </div>
                  <pre><code>{{ msg.codeSnippet }}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Composer Input -->
          <div class="chat-composer">
            <div *ngIf="showSnippetInput" class="snippet-drawer">
              <div class="snippet-drawer-header">
                <span>Attach Code Snippet / Architecture Spec</span>
                <button (click)="showSnippetInput = false" class="close-snip-btn">&times;</button>
              </div>
              <textarea
                [(ngModel)]="codeSnippetInput"
                class="form-control snippet-textarea"
                rows="4"
                placeholder="Paste code or configuration here..."
              ></textarea>
            </div>

            <form (ngSubmit)="sendMessage()" class="composer-form">
              <button
                type="button"
                (click)="showSnippetInput = !showSnippetInput"
                class="composer-tool-btn"
                [class.active]="showSnippetInput"
                title="Add Code Snippet"
              >
                &lt;/&gt;
              </button>
              <input
                type="text"
                [(ngModel)]="messageText"
                name="messageText"
                placeholder="Share your perspective, ask technical questions, or collaborate..."
                class="composer-input"
              />
              <button type="submit" [disabled]="!messageText.trim()" class="btn btn-primary composer-send-btn">
                Send
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </main>

        <!-- ==============================================
             RIGHT PANEL: SHARED WORKSPACE (Objective 3)
             ============================================== -->
        <aside *ngIf="showWorkspacePanel" class="workspace-side-panel">
          <div class="panel-header">
            <h4>{{ selectedWorkspace?.title }}</h4>
            <span class="badge badge-gold">{{ selectedWorkspace?.domain }}</span>
          </div>

          <!-- Tasks Kanban Sprint -->
          <div class="panel-section">
            <div class="section-flex-header">
              <h5>Workspace Sprint Tasks</h5>
              <button (click)="showAddTask = !showAddTask" class="action-link-btn">+ Task</button>
            </div>

            <!-- Add Task Form -->
            <div *ngIf="showAddTask" class="add-task-drawer">
              <input type="text" [(ngModel)]="newTaskTitle" placeholder="Task title..." class="form-control mb-2" />
              <input type="text" [(ngModel)]="newTaskAssignee" placeholder="Assignee (e.g. Alex Chen)" class="form-control mb-2" />
              <button (click)="submitTask()" class="btn btn-primary btn-sm btn-block">Add Task to Board</button>
            </div>

            <div class="tasks-list">
              <div *ngFor="let t of selectedWorkspace?.activeTasks" class="task-card">
                <div class="task-top">
                  <span class="task-title">{{ t.title }}</span>
                  <select
                    [ngModel]="t.status"
                    (ngModelChange)="updateStatus(t.id, $event)"
                    class="task-status-select"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
                <span class="task-assignee">👤 {{ t.assignee }}</span>
              </div>
            </div>
          </div>

          <!-- Shared Collaborative Notes -->
          <div class="panel-section">
            <div class="section-flex-header">
              <h5>Shared Collaborative Notes</h5>
              <button (click)="saveNotes()" class="btn btn-sage btn-sm">Save Notes</button>
            </div>
            <textarea
              [(ngModel)]="workspaceNotes"
              class="form-control notes-editor"
              rows="8"
              placeholder="Shared notes, meeting links, architectural diagrams..."
            ></textarea>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .collab-page {
      height: calc(100vh - 72px);
      display: flex;
      flex-direction: column;
      background: var(--color-white);
    }

    .collab-container {
      display: flex;
      height: 100%;
      overflow: hidden;
    }

    /* Left Sidebar */
    .collab-sidebar {
      width: 280px;
      background: var(--color-forest-dark);
      color: var(--color-cream);
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 18px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-header h3 {
      font-size: 1.1rem;
      color: var(--color-white);
      margin: 0;
    }

    .sidebar-badge {
      font-size: 0.65rem;
      font-weight: 700;
      background: var(--color-gold);
      color: var(--color-forest-dark);
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .sidebar-section {
      padding: 16px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .section-title-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-cream-dark);
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      padding: 0 8px;
    }

    .count-pill {
      background: rgba(255, 255, 255, 0.15);
      padding: 1px 6px;
      border-radius: 10px;
    }

    .channels-list, .dm-list, .workspaces-mini-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .channel-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: var(--color-cream);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.88rem;
      text-align: left;
      transition: all 0.2s ease;
    }

    .channel-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--color-white);
    }

    .channel-item.active {
      background: rgba(197, 164, 93, 0.25);
      color: var(--color-gold);
      font-weight: 700;
    }

    .hash-symbol {
      font-size: 1.1rem;
      opacity: 0.6;
    }

    .channel-name {
      flex: 1;
    }

    .member-count {
      font-size: 0.72rem;
      opacity: 0.5;
    }

    .dm-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: none;
      border: none;
      color: var(--color-cream);
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .dm-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .dm-item.active {
      background: rgba(197, 164, 93, 0.25);
    }

    .dm-avatar-wrap {
      position: relative;
    }

    .dm-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background: #27C93F;
      border-radius: 50%;
      border: 1px solid var(--color-forest-dark);
    }

    .dm-info {
      display: flex;
      flex-direction: column;
    }

    .dm-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-white);
    }

    .dm-sub {
      font-size: 0.72rem;
      color: var(--color-cream-dark);
    }

    .ws-mini-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      color: var(--color-cream);
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.82rem;
      text-align: left;
    }

    .ws-mini-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .ws-mini-item.active {
      background: rgba(120, 155, 120, 0.3);
      color: var(--color-white);
    }

    /* Main Chat Center */
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--color-white);
      overflow: hidden;
    }

    .chat-header {
      padding: 16px 24px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-cream-light);
    }

    .chat-header-info h2 {
      font-size: 1.25rem;
      color: var(--color-forest);
      margin-bottom: 2px;
    }

    .chat-header-info p {
      font-size: 0.82rem;
      color: var(--color-charcoal-muted);
      margin: 0;
    }

    /* Message Stream */
    .messages-stream {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .message-card {
      display: flex;
      gap: 14px;
    }

    .msg-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 1.5px solid var(--color-gold);
    }

    .msg-content-wrap {
      flex: 1;
    }

    .msg-author-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .msg-sender-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-forest);
    }

    .msg-verified-badge {
      font-size: 0.65rem;
      font-weight: 700;
      background: #E8F5E9;
      color: #2E7D32;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #789B78;
    }

    .msg-role-pill {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .role-student { background: #E8F0FE; color: #1967D2; }
    .role-mentor { background: var(--color-forest-subtle); color: var(--color-forest); }
    .role-expert { background: var(--color-gold-subtle); color: #7A5C13; }
    .role-admin { background: #FFCDD2; color: #C62828; }

    .msg-time {
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
    }

    .msg-text {
      font-size: 0.92rem;
      color: var(--color-charcoal);
      line-height: 1.55;
    }

    .code-snippet-box {
      margin-top: 10px;
      background: #1E2522;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--color-charcoal-light);
    }

    .code-header {
      background: #141A17;
      padding: 6px 12px;
      font-size: 0.72rem;
      color: var(--color-cream-dark);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .copy-btn {
      background: none;
      border: none;
      color: var(--color-gold);
      font-size: 0.72rem;
      cursor: pointer;
    }

    .code-snippet-box pre {
      padding: 12px;
      margin: 0;
      color: #A4BFA4;
      font-family: Consolas, Monaco, monospace;
      font-size: 0.85rem;
      overflow-x: auto;
    }

    /* Composer */
    .chat-composer {
      padding: 16px 24px;
      border-top: 1px solid var(--color-border);
      background: var(--color-cream-light);
    }

    .snippet-drawer {
      background: var(--color-white);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 10px;
      border: 1px solid var(--color-border);
    }

    .snippet-drawer-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-forest);
      margin-bottom: 6px;
    }

    .close-snip-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .composer-form {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .composer-tool-btn {
      background: var(--color-white);
      border: 1.5px solid var(--color-border);
      color: var(--color-forest);
      font-weight: 800;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .composer-tool-btn.active {
      background: var(--color-forest);
      color: var(--color-white);
    }

    .composer-input {
      flex: 1;
      padding: 11px 16px;
      font-family: var(--font-sans);
      font-size: 0.95rem;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-sm);
      outline: none;
    }

    .composer-input:focus {
      border-color: var(--color-forest);
    }

    .composer-send-btn {
      padding: 11px 20px;
    }

    /* Right Shared Workspace Panel */
    .workspace-side-panel {
      width: 360px;
      background: var(--color-cream-light);
      border-left: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 20px;
      flex-shrink: 0;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-border);
    }

    .panel-header h4 {
      font-size: 1.1rem;
      color: var(--color-forest);
      margin: 0;
    }

    .panel-section {
      margin-bottom: 24px;
    }

    .section-flex-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .section-flex-header h5 {
      font-size: 0.9rem;
      color: var(--color-forest);
      margin: 0;
    }

    .action-link-btn {
      background: none;
      border: none;
      color: var(--color-gold);
      font-weight: 700;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .add-task-drawer {
      background: var(--color-white);
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 10px;
      border: 1px solid var(--color-border);
    }

    .mb-2 { margin-bottom: 8px; }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .task-card {
      background: var(--color-white);
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
    }

    .task-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 4px;
    }

    .task-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-charcoal);
    }

    .task-status-select {
      font-size: 0.7rem;
      padding: 2px 4px;
      border-radius: 3px;
      border: 1px solid var(--color-border);
      background: var(--color-cream-light);
    }

    .task-assignee {
      font-size: 0.75rem;
      color: var(--color-charcoal-muted);
    }

    .notes-editor {
      font-family: Consolas, Monaco, monospace;
      font-size: 0.82rem;
      line-height: 1.45;
    }

    @media (max-width: 900px) {
      .collab-sidebar {
        width: 220px;
      }
      .workspace-side-panel {
        width: 300px;
      }
    }
  `]
})
export class MessagesComponent implements OnInit {
  channels: DiscussionChannel[] = [];
  selectedChannel: DiscussionChannel | null = null;
  activeRecipientId: number | null = null;
  activeRecipientName = 'Maya Patel';

  allMessages: ChatMessage[] = [];
  displayedMessages: ChatMessage[] = [];

  workspaces: SharedWorkspace[] = [];
  selectedWorkspace: SharedWorkspace | null = null;
  showWorkspacePanel = true;

  // Composer state
  messageText = '';
  showSnippetInput = false;
  codeSnippetInput = '';

  // Workspace task & notes state
  showAddTask = false;
  newTaskTitle = '';
  newTaskAssignee = 'Alex Chen';
  workspaceNotes = '';

  constructor(private collabService: CollaborationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.collabService.channels$.subscribe(chs => {
      this.channels = chs;
      if (!this.selectedChannel && chs.length > 0) {
        this.selectChannel(chs[1]); // select system-design by default
      }
    });

    this.collabService.messages$.subscribe(msgs => {
      this.allMessages = msgs;
      this.filterMessages();
    });

    this.collabService.workspaces$.subscribe(wss => {
      this.workspaces = wss;
      if (!this.selectedWorkspace && wss.length > 0) {
        this.selectWorkspace(wss[0]);
      }
    });
  }

  selectChannel(channel: DiscussionChannel): void {
    this.selectedChannel = channel;
    this.activeRecipientId = null;
    this.filterMessages();
  }

  selectDM(id: number, name: string, avatar: string, role: string): void {
    this.selectedChannel = null;
    this.activeRecipientId = id;
    this.activeRecipientName = name;
    this.filterMessages();
  }

  selectWorkspace(ws: SharedWorkspace): void {
    this.selectedWorkspace = ws;
    this.workspaceNotes = ws.sharedNotes;
  }

  filterMessages(): void {
    if (this.selectedChannel) {
      this.displayedMessages = this.allMessages.filter(m => m.channelId === this.selectedChannel?.id);
    } else if (this.activeRecipientId) {
      this.displayedMessages = this.allMessages.filter(m => m.recipientId === this.activeRecipientId || m.senderId === this.activeRecipientId);
    }
  }

  sendMessage(): void {
    if (!this.messageText.trim()) return;

    this.collabService.sendMessage(
      this.messageText,
      this.selectedChannel ? this.selectedChannel.id : undefined,
      this.activeRecipientId ? this.activeRecipientId : undefined,
      this.codeSnippetInput.trim() || undefined
    );

    this.messageText = '';
    this.codeSnippetInput = '';
    this.showSnippetInput = false;
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
  }

  submitTask(): void {
    if (!this.newTaskTitle || !this.selectedWorkspace) return;
    this.collabService.addTaskToWorkspace(
      this.selectedWorkspace.id,
      this.newTaskTitle,
      this.newTaskAssignee || 'Alex Chen'
    );
    this.newTaskTitle = '';
    this.showAddTask = false;
  }

  updateStatus(taskId: string, status: any): void {
    if (!this.selectedWorkspace) return;
    this.collabService.updateTaskStatus(this.selectedWorkspace.id, taskId, status);
  }

  saveNotes(): void {
    if (!this.selectedWorkspace) return;
    this.collabService.updateSharedNotes(this.selectedWorkspace.id, this.workspaceNotes);
  }
}
