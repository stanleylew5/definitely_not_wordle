"use client";
import { useState } from "react";
import Square from "./square";

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
  const splitAnswer = word.split("");

  for (let i = 0; i < 5; i++) {
    if (guess[i] === word[i]) {
      result[i] = "green";
      splitAnswer[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "gray") {
      const yellowIndex = splitAnswer.indexOf(guess[i]);
      if (yellowIndex !== -1) {
        result[i] = "yellow";
        splitAnswer[yellowIndex] = "";
      }
    }
  }

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

  function handleSubmit() {
    if (guess.length !== 5 || playStatus !== "playing") return;

    const result = checkGuess(guess, word);
    setGuesses([...guesses, guess]);
    setColorResults([...colorResults, result]);
    setRemainingGuesses(remainingGuesses - 1);

    if (guess === word) {
      setPlayStatus("won");
    } else if (remainingGuesses - 1 === 0) {
      setPlayStatus("lost");
    }

    setGuess("");
  }

  return (
    <div className="bg-wordle-black flex justify-center p-16 h-screen w-screen">
      <div className="grid grid-cols-5 gap-1 w-fit h-fit">
        <Square color="gray" letter="C" />
        <Square color="gray" letter="R" />
        <Square color="yellow" letter="A" />
        <Square color="green" letter="S" />
        <Square color="blank" letter="H" />
        <Square color="blank" letter="" />
        <Square color="blank" letter="" />
        <Square color="blank" letter="" />
        <Square color="blank" letter="" />
        <Square color="blank" letter="" />
      </div>
    </div>
  );
};

export default Main;
