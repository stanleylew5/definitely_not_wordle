import { NextResponse } from "next/server";

const games = new Map();

async function getWordle(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch(
    `https://jindrich-bar--nyt-games-api.apify.actor/wordle/${today}?token=${process.env.APIFY_TOKEN}`,
  );

  const data = await res.json();
  return data.word;
}

export async function POST() {
  const answer = await getWordle();

  const gameId = crypto.randomUUID();

  games.set(gameId, {
    answer,
    remaining: 5,
    status: "ongoing",
  });

  return NextResponse.json({ gameId });
}
