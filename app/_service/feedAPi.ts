import { Post } from "../_types/postsType";

const API_BASE_URL = process.env.NEXT_API_BASE_URL;

export async function feedAPi(token: string): Promise<Post[]> {
  const res = await fetch(`${API_BASE_URL}/posts/feed`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) throw new Error("unauthorized");
  if (res.status === 500) throw new Error("server-error");

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch feed");
  }

  const data = await res.json();
  return data.post || [];
}
