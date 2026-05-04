import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import fs from "fs"
import path from "path"

let validWordsCache: Set<string> | null = null;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getValidWords(): Promise<Set<string>> {
  if (validWordsCache) {
    return validWordsCache;
  }

  const wordsPath = path.join(process.cwd(), "src", "data", "words.txt");
  const content = fs.readFileSync(wordsPath, "utf-8");
  const words = content
    .split("\n")
    .map((word) => word.trim().toUpperCase())
    .filter((word) => word.length > 0);

  validWordsCache = new Set(words);
  return validWordsCache;
}

export async function isValidWord(guess: string): Promise<boolean> {
  const validWords = await getValidWords();
  return validWords.has(guess.toUpperCase());
}
