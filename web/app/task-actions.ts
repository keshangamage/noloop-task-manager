"use server";

import { revalidatePath } from "next/cache";
import { fetchTaskApi } from "@/lib/task-api";

export async function saveTask(id: string | null, form: FormData): Promise<string | null> {
  const description = form.get("description");
  const dueDate = form.get("dueDate");
  const payload = {
    title: form.get("title") ?? undefined,
    description: description === "" ? null : description ?? undefined,
    status: form.get("status") ?? undefined,
    dueDate: dueDate === "" ? null : dueDate ?? undefined,
  };

  let response: Response;
  try {
    response = await fetchTaskApi(id === null ? "" : `/${encodeURIComponent(id)}`, {
      method: id === null ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return "Couldn’t reach the API. Check that it’s running and try again.";
  }

  if (!response.ok) {
    const result: { message?: string | string[] } | null = await response.json().catch(() => null);
    const message = Array.isArray(result?.message) ? result.message.join(" ") : result?.message;
    return typeof message === "string" && message ? message : "Couldn’t save the task. Try again.";
  }

  revalidatePath("/");
  return null;
}
