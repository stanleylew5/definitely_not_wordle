export interface GuessEntry {
  guess: string;
  result: string[];
}

export interface Game {
  answer: string;
  guesses: GuessEntry[];
  remaining: number;
  status: "playing" | "win" | "lose";
}
