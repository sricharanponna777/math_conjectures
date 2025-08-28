import { NextRequest } from "next/server";
import { spawn } from "child_process";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "50";

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const py = spawn("python3", ["app/api/perfectNums.py", limit]);

      let closed = false;

      const onData = (data: Buffer) => {
        if (closed) return;
        const lines = data.toString().split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            controller.enqueue(encoder.encode(`data: ${line}\n\n`));
          } catch {
            // stream already closed
          }
        }
      };

      const onClose = () => {
        if (!closed) {
          closed = true;
          controller.close();
        }
      };

      py.stdout.on("data", onData);
      py.stderr.on("data", (data) => console.error("Python error:", data.toString()));
      py.on("close", onClose);
      py.on("exit", onClose);

      // Handle client disconnect (important for SSE!)
      // @ts-ignore (not typed in Next.js yet)
      req.signal?.addEventListener("abort", () => {
        py.kill("SIGINT");
        onClose();
      });
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
