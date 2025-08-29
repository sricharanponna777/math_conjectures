// app/api/perfect/route.ts
import { NextResponse } from "next/server";

// Function to check if a number is perfect
function isPerfect(num: number): boolean {
  if (num <= 1) return false;

  let sum = 1; // start with 1 (divisor of all numbers)
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i; // add the paired divisor
    }
  }

  return sum === num;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const n = parseInt(searchParams.get("n") || "0", 10);

  if (isNaN(n) || n <= 0) {
    return NextResponse.json(
      { error: "Please provide a positive integer n." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    number: n,
    isPerfect: isPerfect(n),
  });
}
