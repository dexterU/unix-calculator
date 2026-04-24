import { useState, useEffect } from 'react';

export interface ChallengeSubmission {
  challengeId: string;
  timestamp: number;
  language: string;
  code: string;
  passed: boolean;
  attempts: number;
  timeToComplete: number; // milliseconds
}

export interface UserProgress {
  userId: string;
  username: string;
  totalPoints: number;
  completedChallenges: string[];
  submissions: ChallengeSubmission[];
  streak: number;
  lastActive: number;
  skillLevel: 'beginner' | 'intermediate' | 'expert';
  badges: string[];
}

export interface ChallengeAnalytics {
  challengeId: string;
  totalAttempts: number;
  successRate: number;
  averageTime: number;
  popularLanguage: string;
  commonErrors: string[];
}

const STORAGE_KEY = 'unix-calc-progress';
const ANALYTICS_KEY = 'unix-calc-analytics';

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      userId: `user_${Date.now()}`,
      username: 'Guest User',
      totalPoints: 0,
      completedChallenges: [],
      submissions: [],
      streak: 0,
      lastActive: Date.now(),
      skillLevel: 'beginner' as const,
      badges: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const submitChallenge = (submission: Omit<ChallengeSubmission, 'timestamp' | 'attempts'>) => {
    const existingSubmissions = progress.submissions.filter(s => s.challengeId === submission.challengeId);
    const attempts = existingSubmissions.length + 1;

    const newSubmission: ChallengeSubmission = {
      ...submission,
      timestamp: Date.now(),
      attempts
    };

    const newCompletedChallenges = submission.passed && !progress.completedChallenges.includes(submission.challengeId)
      ? [...progress.completedChallenges, submission.challengeId]
      : progress.completedChallenges;

    // Update analytics
    updateAnalytics(newSubmission);

    // Award badges
    const newBadges = [...progress.badges];
    if (newCompletedChallenges.length === 1 && !newBadges.includes('first_steps')) {
      newBadges.push('first_steps');
    }
    if (newCompletedChallenges.length === 5 && !newBadges.includes('rising_star')) {
      newBadges.push('rising_star');
    }

    // Calculate skill level
    let skillLevel: 'beginner' | 'intermediate' | 'expert' = 'beginner';
    if (newCompletedChallenges.length >= 15) skillLevel = 'expert';
    else if (newCompletedChallenges.length >= 5) skillLevel = 'intermediate';

    setProgress({
      ...progress,
      submissions: [...progress.submissions, newSubmission],
      completedChallenges: newCompletedChallenges,
      lastActive: Date.now(),
      badges: newBadges,
      skillLevel
    });
  };

  const updateAnalytics = (submission: ChallengeSubmission) => {
    const analytics = getAllAnalytics();
    const existing = analytics.find(a => a.challengeId === submission.challengeId);

    if (existing) {
      existing.totalAttempts++;
      if (submission.passed) {
        const totalPassed = existing.totalAttempts * existing.successRate + 1;
        existing.successRate = totalPassed / existing.totalAttempts;
      }
      existing.averageTime = (existing.averageTime + submission.timeToComplete) / 2;
    } else {
      analytics.push({
        challengeId: submission.challengeId,
        totalAttempts: 1,
        successRate: submission.passed ? 1 : 0,
        averageTime: submission.timeToComplete,
        popularLanguage: submission.language,
        commonErrors: []
      });
    }

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  };

  const getAllAnalytics = (): ChallengeAnalytics[] => {
    const saved = localStorage.getItem(ANALYTICS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const resetProgress = () => {
    const newProgress: UserProgress = {
      userId: `user_${Date.now()}`,
      username: 'Guest User',
      totalPoints: 0,
      completedChallenges: [],
      submissions: [],
      streak: 0,
      lastActive: Date.now(),
      skillLevel: 'beginner',
      badges: []
    };
    setProgress(newProgress);
  };

  return {
    progress,
    submitChallenge,
    resetProgress,
    getAllAnalytics
  };
}
