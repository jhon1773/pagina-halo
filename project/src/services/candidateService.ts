import { Candidate, TestResults, Division, CandidateStatus } from '../types';

class CandidateService {
  private candidates: Candidate[] = [];

  // Simulate data persistence using localStorage
  constructor() {
    this.loadCandidates();
  }

  private loadCandidates(): void {
    const stored = localStorage.getItem('unsc_candidates');
    if (stored) {
      this.candidates = JSON.parse(stored);
    }
  }

  private saveCandidates(): void {
    localStorage.setItem('unsc_candidates', JSON.stringify(this.candidates));
  }

  registerCandidate(candidate: Omit<Candidate, 'id' | 'registrationDate' | 'lastUpdate'>): string {
    const newCandidate: Candidate = {
      ...candidate,
      id: this.generateId(),
      registrationDate: new Date(),
      lastUpdate: new Date()
    };

    this.candidates.push(newCandidate);
    this.saveCandidates();
    return newCandidate.id;
  }

  updateTestResults(candidateId: string, testResults: TestResults): void {
    const candidate = this.candidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.testResults = testResults;
      candidate.lastUpdate = new Date();
      
      // Auto-evaluate candidate based on test results
      candidate.status = this.evaluateCandidate(candidate);
      this.saveCandidates();
    }
  }

  getCandidateById(id: string): Candidate | undefined {
    return this.candidates.find(c => c.id === id);
  }

  getAllCandidates(): Candidate[] {
    return this.candidates;
  }

  getCandidatesByDivision(division: Division): Candidate[] {
    return this.candidates.filter(c => c.division === division);
  }

  getCandidatesByStatus(status: CandidateStatus): Candidate[] {
    return this.candidates.filter(c => c.status === status);
  }

  private generateId(): string {
    return `UNSC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  }

  private evaluateCandidate(candidate: Candidate): CandidateStatus {
    const { testResults, division } = candidate;
    
    // Basic scoring thresholds
    const thresholds = {
      marine: 65,
      odst: 80,
      spartan: 90
    };

    const threshold = thresholds[division];
    
    if (testResults.overallScore >= threshold) {
      return 'approved';
    } else if (testResults.overallScore >= threshold - 15) {
      return 'in-review';
    } else {
      return 'rejected';
    }
  }

  // Analytics methods
  getRecruitmentStats() {
    const total = this.candidates.length;
    const byStatus = {
      pending: this.candidates.filter(c => c.status === 'pending').length,
      approved: this.candidates.filter(c => c.status === 'approved').length,
      rejected: this.candidates.filter(c => c.status === 'rejected').length,
      'in-review': this.candidates.filter(c => c.status === 'in-review').length
    };
    
    const byDivision = {
      marine: this.candidates.filter(c => c.division === 'marine').length,
      odst: this.candidates.filter(c => c.division === 'odst').length,
      spartan: this.candidates.filter(c => c.division === 'spartan').length
    };

    const averageScores = {
      marine: this.calculateAverageScore('marine'),
      odst: this.calculateAverageScore('odst'),
      spartan: this.calculateAverageScore('spartan')
    };

    return {
      total,
      byStatus,
      byDivision,
      averageScores
    };
  }

  private calculateAverageScore(division: Division): number {
    const candidates = this.getCandidatesByDivision(division);
    if (candidates.length === 0) return 0;
    
    const totalScore = candidates.reduce((sum, candidate) => sum + candidate.testResults.overallScore, 0);
    return Math.round(totalScore / candidates.length);
  }
}

export const candidateService = new CandidateService();