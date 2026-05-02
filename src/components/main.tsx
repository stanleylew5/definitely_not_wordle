"use client";
import { useState, useEffect } from "react";
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
  const guessLower = guess.toLowerCase();
  const wordLower = word.toLowerCase();
  const result = Array(5).fill("gray");
  const splitAnswer = wordLower.split("");

  for (let i = 0; i < 5; i++) {
    if (guessLower[i] === wordLower[i]) {
      result[i] = "green";
      splitAnswer[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "gray") {
      const yellowIndex = splitAnswer.indexOf(guessLower[i]);
      if (yellowIndex !== -1) {
        result[i] = "yellow";
        splitAnswer[yellowIndex] = "";
      }
    }
  }

  return result;
}

const Main = () => {
  const [word] = useState("puffy");
  const [playStatus, setPlayStatus] = useState<"playing" | "won" | "lost">(
    "playing",
  );
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [colorResults, setColorResults] = useState<string[][]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState(5);

  useEffect(() => {
    function handleSubmit() {
      if (guess.length !== 5 || playStatus !== "playing") return;

      const result = checkGuess(guess, word);
      setGuesses([...guesses, guess]);
      setColorResults([...colorResults, result]);
      setRemainingGuesses(remainingGuesses - 1);

      if (guess.toLowerCase() === word.toLowerCase()) {
        setPlayStatus("won");
      } else if (remainingGuesses - 1 === 0) {
        setPlayStatus("lost");
      }

      setGuess("");
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (playStatus !== "playing") return;
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < 5) {
        setGuess(guess + e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [colorResults, guesses, remainingGuesses, guess, word, playStatus]);

  return (
    <div className="bg-wordle-black flex justify-center p-16 h-screen w-screen">
      <div className="grid grid-cols-5 gap-1 w-fit h-fit">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          if (rowIndex < guesses.length) {
            return guesses[rowIndex]
              .split("")
              .map((letter, colIndex) => (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  color={colorResults[rowIndex][colIndex]}
                  letter={letter}
                />
              ));
          } else if (rowIndex === guesses.length && playStatus === "playing") {
            return Array.from({ length: 5 }).map((_, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                color="blank"
                letter={guess[colIndex] || ""}
              />
            ));
          } else {
            return Array.from({ length: 5 }).map((_, colIndex) => (
              <Square key={`${rowIndex}-${colIndex}`} color="blank" letter="" />
            ));
          }
        })}
      </div>
    </div>
  );
};

export default Main;
