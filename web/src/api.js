export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Gọi API, luôn trả về { ok, data }
export async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}
