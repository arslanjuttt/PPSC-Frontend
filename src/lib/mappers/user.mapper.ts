import { User } from '@/types';
import { BackendUser } from '@/lib/api/types';

export const mapBackendUserToUser = (backendUser: BackendUser & { _id?: string }): User => {
  const stats = backendUser.stats || {
    testsTaken: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    lastScore: 0,
    accuracy: 0,
  };

  return {
    id: String(backendUser.id || backendUser._id),
    email: backendUser.email,
    name: backendUser.name,
    phone: backendUser.phone,
    city: backendUser.city,
    profileImage: backendUser.profileImage,
    isEmailVerified: backendUser.isEmailVerified ?? false,
    createdAt: backendUser.createdAt || new Date().toISOString(),
    profile: {
      streak: stats.streak,
      xp: stats.correctAnswers * 10,
      level: Math.max(1, Math.floor(stats.testsTaken / 3) + 1),
      badges: [],
      totalTests: stats.testsTaken,
      accuracy: stats.accuracy,
      lastScore: stats.lastScore,
      correctAnswers: stats.correctAnswers,
      incorrectAnswers: stats.incorrectAnswers,
    },
  };
};
