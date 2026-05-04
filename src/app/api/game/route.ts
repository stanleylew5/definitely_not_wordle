import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

async function getWordle(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(
    `https://jindrich-bar--nyt-games-api.apify.actor/wordle/${today}?token=${process.env.APIFY_TOKEN}`,
  );
  const data = await res.json();
  return data.solution;
}

export async function POST(req: Request) {
  const { gameId } = await req.json();

  if (!gameId) {
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  const ref = db.collection("games").doc(gameId);
  const snap = await ref.get();

  if (snap.exists) {
    return NextResponse.json({ game: snap.data() });
  }

  const answer = await getWordle();

  const game = {
    answer,
    guesses: [],
    remaining: 6,
    status: "playing",
  };

  await ref.set(game);

  return NextResponse.json({ game });
}
