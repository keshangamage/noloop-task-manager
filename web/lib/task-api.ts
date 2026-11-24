export function fetchTaskApi(path = "", options?: RequestInit) {
  const apiUrl = process.env.TASK_API_URL ?? "http://localhost:3001";

  return fetch(`${apiUrl.replace(/\/+$/, "")}/tasks${path}`, {
    ...options,
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
}
