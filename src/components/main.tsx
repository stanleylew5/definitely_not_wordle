import { useState } from "react";

/* async function getWordle(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch(
    `https://jindrich-bar--nyt-games-api.apify.actor/wordle/${today}?token=${process.env.APIFY_TOKEN}`,
  );

  const data = await res.json();
  return data.word;
} */

function checkGuess(guess: string, word: string): string[] {
  const result = Array(5).fill("gray");
  // will complete this function later today!!
  return result;
}

const Main = () => {
  const [word] = useState("crash");
  const [playStatus, setPlayStatus] = useState<"playing" | "won" | "lost">(
    "playing",
  );
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [colorResults, setColorResults] = useState<string[][]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState(5);

  return <div>Testing</div>;
};

export default Main;
