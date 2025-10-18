import { NextResponse } from "next/server";

let books = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
];

export async function GET() {
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newBook = { id: Date.now(), ...body };
  books.push(newBooks);
  return NextResponse.json(newBooks);
}
