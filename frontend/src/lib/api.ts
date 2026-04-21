import type { QuizResponse } from "@/types/quiz";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function parseDocument(file: File): Promise<QuizResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/v1/parse`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) {
        message = String(body.detail);
      }
    } catch {
      // non-JSON body — keep generic message
    }
    throw new Error(message);
  }

  return res.json() as Promise<QuizResponse>;
}
