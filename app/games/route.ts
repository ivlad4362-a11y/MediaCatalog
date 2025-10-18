import { NextResponse } from "next/server";

let games = [
  { id: 1, title: "The Witcher 3", genre: "RPG", rating: 9.5 },
  { id: 2, title: "Minecraft", genre: "Sandbox", rating: 8.5 },
];

export async function GET() {
  return NextResponse.json(games);
}
