import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CuratedResource } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private resourcesSubject = new BehaviorSubject<CuratedResource[]>([
    {
      id: 1,
      title: 'Distributed Systems & Database Sharding Architectural Blueprint',
      domain: 'Computer Science',
      type: 'Guide',
      author: 'Maya Patel',
      authorRole: 'MENTOR',
      authorVerified: true,
      description: 'Comprehensive guide to consistent hashing, consensus algorithms (Raft/Paxos), partition tolerance, and cross-shard transaction rollbacks.',
      link: 'https://mentorconnect.org/resources/distributed-systems-blueprint',
      likes: 142,
      tags: ['System Design', 'Distributed Systems', 'Architecture', 'Backend']
    },
    {
      id: 2,
      title: 'Attention Mechanism & Deep Transformer Latency Profiling',
      domain: 'Artificial Intelligence',
      type: 'Research Paper',
      author: 'Dr. Marcus Rossi',
      authorRole: 'EXPERT',
      authorVerified: true,
      description: 'Mathematical breakdown of FlashAttention IO complexity, KV-cache quantization, and speculative decoding acceleration benchmarks.',
      link: 'https://mentorconnect.org/resources/transformer-latency-profiling',
      likes: 218,
      tags: ['AI', 'Transformers', 'Deep Learning', 'PyTorch', 'GPU Optimization']
    },
    {
      id: 3,
      title: 'Design Systems Token Architecture & Component Hierarchy',
      domain: 'Product Design',
      type: 'Template',
      author: 'Sarah Kim',
      authorRole: 'MENTOR',
      authorVerified: true,
      description: 'Figma-ready design system token architecture mapping color modes, typography scales, spacing units, and WCAG AA accessibility contrast ratios.',
      link: 'https://mentorconnect.org/resources/design-system-tokens',
      likes: 95,
      tags: ['Design Systems', 'Figma', 'UI/UX', 'Accessibility']
    },
    {
      id: 4,
      title: 'Technical Whiteboard & System Architecture Interview Playbook',
      domain: 'Career Navigation',
      type: 'Guide',
      author: 'Eleanor Vance',
      authorRole: 'ADMIN',
      authorVerified: true,
      description: 'Step-by-step interview framework: requirement scoping, back-of-envelope estimations, high-level API design, bottleneck identification, and communication heuristics.',
      link: 'https://mentorconnect.org/resources/interview-playbook',
      likes: 312,
      tags: ['Career', 'Interview Prep', 'Software Engineering', 'FAANG']
    },
    {
      id: 5,
      title: 'Quantitative Risk Modeling with Monte Carlo & Python Vectorization',
      domain: 'Business & Finance',
      type: 'Code Repository',
      author: 'Jordan Lee',
      authorRole: 'EXPERT',
      authorVerified: true,
      description: 'Jupyter notebook repository implementing value-at-risk (VaR), portfolio covariance matrices, and Sharpe ratio optimization using NumPy and Pandas.',
      link: 'https://mentorconnect.org/resources/quant-risk-modeling',
      likes: 88,
      tags: ['Fintech', 'Quant', 'Python', 'Risk Management']
    },
    {
      id: 6,
      title: 'AlphaFold 3 Multimer Analysis & Structural Bio-docking Protocol',
      domain: 'Bioinformatics',
      type: 'Guide',
      author: 'Dr. Marcus Rossi',
      authorRole: 'EXPERT',
      authorVerified: true,
      description: 'Protocol guide for interpreting predicted alignment error (PAE) matrices, pLDDT per-residue confidence scores, and validating binding pocket contacts.',
      link: 'https://mentorconnect.org/resources/alphafold-docking-protocol',
      likes: 124,
      tags: ['Bioinformatics', 'AlphaFold', 'Structural Biology', 'Proteomics']
    }
  ]);
  public resources$ = this.resourcesSubject.asObservable();

  addResource(resource: Omit<CuratedResource, 'id' | 'likes'>): void {
    const current = this.resourcesSubject.value;
    const newRes: CuratedResource = {
      ...resource,
      id: Date.now(),
      likes: 1
    };
    this.resourcesSubject.next([newRes, ...current]);
  }

  likeResource(resourceId: number): void {
    const current = this.resourcesSubject.value.map(r => {
      if (r.id === resourceId) {
        return { ...r, likes: r.likes + 1 };
      }
      return r;
    });
    this.resourcesSubject.next(current);
  }
}
