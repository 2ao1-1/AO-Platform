import { CreatePostData, Post, UploadImageResponse } from "../_types/postsType";

class ApiService {
  private baseURL = "http://144.91.75.57:8080/api";
  // private baseURL = "https://platform.2ao1.space/api";

  private getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Get feed posts
  async getFeed(token: string): Promise<{ posts: Post[] }> {
    const response = await fetch(`${this.baseURL}/posts/feed`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (response.status === 500) {
      throw new Error("Server is having issues. Please try again later.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  }

  // Upload image
  async uploadImage(token: string, file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${this.baseURL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { msg: `Upload failed with status ${response.status}` };
      }
      throw new Error(errorData.msg || "Image upload failed");
    }

    return await response.json();
  }

  // Create post
  async createPost(
    token: string,
    postData: CreatePostData
  ): Promise<{ post: Post }> {
    const response = await fetch(`${this.baseURL}/posts`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(postData),
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || "Failed to create post");
    }

    return await response.json();
  }

  // likes
  async toggleLike(
    token: string,
    postId: string
  ): Promise<{ isLiked: boolean }> {
    const res = await fetch(`${this.baseURL}/posts/${postId}/like`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error("Failed to toggle like");
    }

    return await res.json();
  }
}

export const apiService = new ApiService();
