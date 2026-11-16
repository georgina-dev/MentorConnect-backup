import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChatMessage, DiscussionChannel, SharedWorkspace, User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private channelsSubject = new BehaviorSubject<DiscussionChannel[]>([
    {
      id: 'general',
      name: 'general-mentorship',
      domain: 'Cross-Domain',
      description: 'Platform announcements, community welcomes, and open peer discussions.',
      memberCount: 428,
      isGeneral: true
    },
    {
      id: 'systems',
      name: 'system-design',
      domain: 'Computer Science',
      description: 'Distributed architectures, scalability patterns, database sharding, and CAP theorem debates.',
      memberCount: 215
    },
    {
      id: 'algorithms',
      name: 'algorithms-and-ds',
      domain: 'Computer Science',
      description: 'Dynamic programming, graph theory, LeetCode discussions, and algorithmic complexity proofs.',
      memberCount: 310
    },
    {
      id: 'ai-research',
      name: 'ai-and-deep-learning',
      domain: 'Artificial Intelligence',
      description: 'LLM fine-tuning, transformer attention kernels, diffusion models, and research paper reviews.',
      memberCount: 184
    },
    {
      id: 'career',
      name: 'career-guidance',
      domain: 'Career Navigation',
      description: 'Resume feedback, salary negotiation strategies, interview debriefs, and grad school applications.',
      memberCount: 372
    },
    {
      id: 'bioinformatics',
      name: 'computational-biology',
      domain: 'Bioinformatics',
      description: 'AlphaFold structural predictions, sequence alignments, and multi-omics deep learning models.',
      memberCount: 96
    }
  ]);
  public channels$ = this.channelsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([
    {
      id: 1,
      senderId: 3,
      senderName: 'Maya Patel',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      senderRole: 'MENTOR',
      senderVerified: true,
      content: 'Welcome everyone! For those preparing for system design interviews, always start by clarifying constraints (read vs write throughput, latency SLA, consistency level) before jumping to schema design.',
      timestamp: 'Today at 10:14 AM',
      channelId: 'systems'
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'Alex Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      senderRole: 'STUDENT',
      senderVerified: false,
      content: 'Thanks Maya! Here is a Redis distributed lock implementation using SETNX with TTL expiration we were analyzing in our study group:',
      codeSnippet: `// Acquire lock with lease expiration\nconst acquired = await redis.set("lock:resource:401", workerId, "NX", "EX", 30);\nif (acquired) {\n  try {\n    await processBatchTask();\n  } finally {\n    await safeReleaseLuaScript(redis, "lock:resource:401", workerId);\n  }\n}`,
      timestamp: 'Today at 10:22 AM',
      channelId: 'systems'
    },
    {
      id: 3,
      senderId: 4,
      senderName: 'Dr. Marcus Rossi',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      senderRole: 'EXPERT',
      senderVerified: true,
      content: 'Spot on Alex. Remember that with Redis distributed locks, clock drift between nodes and GC pauses can still invalidate the lock before completion. Look into the Redlock multi-instance algorithm for critical invariants.',
      timestamp: 'Today at 10:35 AM',
      channelId: 'systems'
    },
    {
      id: 4,
      senderId: 3,
      senderName: 'Maya Patel',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      senderRole: 'MENTOR',
      senderVerified: true,
      content: 'Hey Alex! Looking forward to our 1-on-1 session tomorrow. Make sure you check out the notes in our shared workspace on caching tiers.',
      timestamp: 'Yesterday at 4:15 PM',
      recipientId: 2
    }
  ]);
  public messages$ = this.messagesSubject.asObservable();

  private workspacesSubject = new BehaviorSubject<SharedWorkspace[]>([
    {
      id: 'ws-dist-sys',
      title: 'Distributed Systems & Storage Study Lab',
      domain: 'Computer Science',
      description: 'Peer collaborative sprint designing high-availability key-value stores and consensus protocols.',
      members: [],
      activeTasks: [
        { id: 't1', title: 'Implement consistent hashing ring with virtual nodes', assignee: 'Alex Chen', status: 'IN_PROGRESS' },
        { id: 't2', title: 'Write unit tests for split-brain quorum resolution', assignee: 'Devon Wong', status: 'TODO' },
        { id: 't3', title: 'Benchmark write latency under network partition (Jepsen test)', assignee: 'Maya Patel', status: 'DONE' }
      ],
      sharedNotes: `### Core Consensus Principles\n- **Raft Leader Election**: Randomized timeouts (150-300ms) prevent split votes.\n- **Log Replication**: Entry is committed once stored on majority of nodes (N/2 + 1).\n- **Safety Invariant**: Leader never overwrites or truncates its own log.`,
      createdAt: '1 week ago'
    },
    {
      id: 'ws-ai-research',
      title: 'AI Transformers & Model Efficiency Sprint',
      domain: 'Artificial Intelligence',
      description: 'Investigating quantization techniques (AWQ, FP8) and KV-cache compression for low-latency inference.',
      members: [],
      activeTasks: [
        { id: 't4', title: 'Implement grouped-query attention (GQA) layer', assignee: 'Alex Chen', status: 'DONE' },
        { id: 't5', title: 'Compare perplexity degradation between 4-bit and 8-bit weights', assignee: 'Dr. Marcus Rossi', status: 'IN_PROGRESS' }
      ],
      sharedNotes: `### Key Optimization Benchmarks\n1. FlashAttention-2 yields ~2.5x speedup over standard attention by minimizing HBM read/write rounds.\n2. Speculative decoding reduces token latency by generating tokens via draft model.`,
      createdAt: '3 days ago'
    }
  ]);
  public workspaces$ = this.workspacesSubject.asObservable();

  constructor(private authService: AuthService) {}

  sendMessage(content: string, channelId?: string, recipientId?: number, codeSnippet?: string): Observable<ChatMessage> {
    const user = this.authService.currentUser;
    const newMsg: ChatMessage = {
      id: Date.now(),
      senderId: user?.id || 99,
      senderName: user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'You',
      senderAvatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      senderRole: user?.role || 'STUDENT',
      senderVerified: user?.verification_status === 'VERIFIED',
      content,
      codeSnippet,
      timestamp: 'Just now',
      channelId,
      recipientId
    };

    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, newMsg]);
    return of(newMsg);
  }

  addTaskToWorkspace(workspaceId: string, title: string, assignee: string): void {
    const current = this.workspacesSubject.value.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          activeTasks: [
            ...ws.activeTasks,
            { id: 't_' + Date.now(), title, assignee, status: 'TODO' as const }
          ]
        };
      }
      return ws;
    });
    this.workspacesSubject.next(current);
  }

  updateTaskStatus(workspaceId: string, taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE'): void {
    const current = this.workspacesSubject.value.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          activeTasks: ws.activeTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        };
      }
      return ws;
    });
    this.workspacesSubject.next(current);
  }

  updateSharedNotes(workspaceId: string, notes: string): void {
    const current = this.workspacesSubject.value.map(ws => {
      if (ws.id === workspaceId) {
        return { ...ws, sharedNotes: notes };
      }
      return ws;
    });
    this.workspacesSubject.next(current);
  }
}
