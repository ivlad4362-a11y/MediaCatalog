import { NextResponse } from "next/server";

let books = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
];

export async function GET() {
  return NextResponse.json(books);
}
