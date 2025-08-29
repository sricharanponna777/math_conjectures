// app/api/perfect/route.ts
import { NextRequest } from "next/server";

// Function to check if a number is perfect
function isPerfect(num: number): boolean {
  if (num <= 1) return false;

  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for (let n = 2; n <= limit; n++) {
          if (isPerfect(n)) {
            controller.enqueue(encoder.encode(`data: ${n}\n\n`));
            // simulate streaming delay (optional)
            await new Promise((r) => setTimeout(r, 50));
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${(err as Error).message}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
