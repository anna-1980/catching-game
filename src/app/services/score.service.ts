import { Injectable } from '@angular/core';
import {
  Firestore, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp
} from '@angular/fire/firestore';

export interface ScoreEntry {
  user: string;
  score: number;
  timestamp: string; // keep for display
  createdAt?: any;   // Firestore server timestamp
  gameId?: string;   // optional if you add multiple games
}

@Injectable({ providedIn: 'root' })
export class ScoreService {
  constructor(private firestore: Firestore) {}

  async addScore(user: string, score: number, gameId?: string) {
    const ref = collection(this.firestore, 'scores');
    await addDoc(ref, {
      user,
      score,
      gameId: gameId ?? 'default',
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    } as ScoreEntry);
  }

  async getTopScores(limitCount = 5, gameId = 'default') {
    // If you want to filter per game, you can add 'where' once you create an index
    const ref = collection(this.firestore, 'scores');
    const q = query(ref, orderBy('score', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as ScoreEntry);
  }
}
