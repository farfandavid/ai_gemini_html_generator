import type { APIRoute } from "astro";
import { gemini } from "../../config/gemini";

export const POST: APIRoute = async ({ request }) => {
  const { history } = await request.json();
  console.log(JSON.stringify(history, null, 2));
  //const prompt = message;
  const result = await gemini.generateContentStream({
    contents: history,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of result.stream) {
        const jsonChunk = await chunk.text();

        // Codificamos y enviamos el chunk
        const encodedChunk = encoder.encode(jsonChunk + '\n');
        controller.enqueue(encodedChunk);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  });
};

