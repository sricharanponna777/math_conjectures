// app/api/perfect/route.ts

// quick prime test
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

// Lucas–Lehmer test
function isMersennePrime(p: number): boolean {
  if (p === 2) return true;
  const Mp = (1n << BigInt(p)) - 1n;
  let s = 4n;
  for (let i = 0; i < p - 2; i++) {
    s = (s * s - 2n) % Mp;
  }
  return s === 0n;
}

// worker: try exponent p
async function checkExponent(p: number) {
  if (!isPrime(p)) return null;
  if (!isMersennePrime(p)) return null;
  const Mp = (1n << BigInt(p)) - 1n;
  const perfect = (1n << BigInt(p - 1)) * Mp;
  return { p, perfect: perfect.toString() };
}

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let found = 0;
      let p = 2;
      const limit = 20;     // how many perfect numbers
      const batchSize = 4;  // how many exponents to check in parallel

      while (found < limit) {
        const batch = Array.from({ length: batchSize }, (_, i) => p + i);
        p += batchSize;

        const results = await Promise.all(batch.map(checkExponent));

        for (const r of results) {
          if (r) {
            const chunk = JSON.stringify(r) + '\n';
            controller.enqueue(encoder.encode(chunk));
            found++;
            if (found >= limit) break;
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
