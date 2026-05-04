"use client";

import { useState, useEffect, useCallback } from "react";
import Square from "./square";
import { GuessEntry } from "@/types/game";

function getUserId() {
  let id = localStorage.getItem("userId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("userId", id);
  }
  return id;
}

const Main = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [playStatus, setPlayStatus] = useState<"playing" | "win" | "lose">(
    "playing",
  );
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [colorResults, setColorResults] = useState<string[][]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function startGame() {
      setLoading(true);
      const userId = getUserId();
      const today = new Date().toISOString().slice(0, 10);
      const id = `${userId}_${today}`;

      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: id }),
      });

      const data = await res.json();

      setGameId(id);

      setGuesses(data.game.guesses.map((g: GuessEntry) => g.guess));
      setColorResults(data.game.guesses.map((g: GuessEntry) => g.result));
      setPlayStatus(data.game.status);
      setLoading(false);
    }

    startGame();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!gameId || guess.length !== 5 || playStatus !== "playing") return;

    const res = await fetch(`/api/game/${gameId}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    });

    if (!res.ok) return;

    const data = await res.json();

    setGuesses(data.guesses.map((g: GuessEntry) => g.guess));
    setColorResults(data.guesses.map((g: GuessEntry) => g.result));
    setPlayStatus(data.status);

    if (data.answer) setAnswer(data.answer);

    setGuess("");
  }, [guess, gameId, playStatus]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (playStatus !== "playing") return;

      if (e.key === "Enter") handleSubmit();
      else if (e.key === "Backspace") {
        setGuess((p) => p.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        setGuess((p) => (p.length < 5 ? p + e.key.toUpperCase() : p));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit, playStatus]);

  if (loading) {
    return (
      <div className="bg-wordle-black flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-wordle-black flex flex-col items-center justify-center p-16 h-screen w-screen gap-4">
      <h1 className="text-white text-2xl font-bold">Definitely Not Wordle</h1>

      <div className="grid grid-cols-5 gap-1">
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
          }

          if (rowIndex === guesses.length && playStatus === "playing") {
            return Array.from({ length: 5 }).map((_, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                color="blank"
                letter={guess[colIndex] || ""}
              />
            ));
          }

          return Array.from({ length: 5 }).map((_, colIndex) => (
            <Square key={`${rowIndex}-${colIndex}`} color="blank" letter="" />
          ));
        })}
      </div>

      {playStatus === "win" && (
        <div className="text-green-400 text-center font-semibold">
          You win! 🎉
          {answer && <div>The word was {answer.toUpperCase()}</div>}
        </div>
      )}

      {playStatus === "lose" && (
        <div className="text-red-400 text-center font-semibold">
          Game over!
          {answer && <div>The word was {answer.toUpperCase()}</div>}
        </div>
      )}
    </div>
  );
};

export default Main;
