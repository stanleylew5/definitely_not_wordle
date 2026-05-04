import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { isValidWord } from "@/lib/utils";

function checkGuess(guess: string, word: string): string[] {
  const result = Array(5).fill("gray");
  const answer = word.toLowerCase().split("");
  const g = guess.toLowerCase();

  for (let i = 0; i < 5; i++) {
    if (g[i] === answer[i]) {
      result[i] = "green";
      answer[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "gray") {
      const idx = answer.indexOf(g[i]);
      if (idx !== -1) {
        result[i] = "yellow";
        answer[idx] = "";
      }
    }
  }

  return result;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const ref = db.collection("games").doc(id);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const game = snap.data()!;
  const { guess } = await req.json();

  if (!guess || guess.length !== 5) {
    return NextResponse.json({ error: "Not enough letters" }, { status: 400 });
  }

  const valid = await isValidWord(guess);
  if (!valid) {
    return NextResponse.json({ error: "Word not in word list" }, { status: 400 });
  }

  const result = checkGuess(guess, game.answer);

  const updatedGuesses = [...game.guesses, { guess, result }];

  let status = game.status;
  let remaining = game.remaining - 1;

  if (guess.toLowerCase() === game.answer.toLowerCase()) {
    status = "win";
  } else if (remaining <= 0) {
    status = "lose";
    remaining = 0;
  }

  await ref.update({
    guesses: updatedGuesses,
    remaining,
    status,
  });

  return NextResponse.json({
    result,
    guesses: updatedGuesses,
    remaining,
    status,
    answer: status !== "playing" ? game.answer : undefined,
  });
}
