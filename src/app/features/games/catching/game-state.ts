// game-state.ts

export type LevelResult = 'none' | 'win' | 'lose';

export interface GameState {
  gameName: string;
  level: number;
  score: number;
  lives: number;
  highScore: number;
  highScorePlayerName: string;
  playerName: string;
  lastResult: LevelResult;
}

const STORAGE_KEY = 'catcherGameState';
export const MAX_LEVEL = 2;

function loadFromStorage(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const stored = loadFromStorage();

// 👉 this is your shared state object
export const gameState: GameState = {
  gameName: 'Bucket Catcher',
  level: stored.level ?? 1,
  score: 0,
  lives: 3,
  highScore: stored.highScore ?? 0,
  highScorePlayerName: stored.highScorePlayerName ?? 'Anonymous',
  playerName: stored.playerName ?? localStorage.getItem('Player-Name') ?? 'Anna',
  lastResult: 'none',
};

// helper you can call from scenes when high score changes
export function updateHighScoreIfNeeded() {
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    gameState.highScorePlayerName = gameState.playerName;
    saveToStorage(gameState);
  }
}
