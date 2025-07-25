"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [tagName, setTagName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // useEffect(() => {
  //   const handleContextMenu = (e: MouseEvent) => e.preventDefault();
  //   const handleDragStart = (e: DragEvent) => e.preventDefault();

  //   document.addEventListener("contextmenu", handleContextMenu);
  //   document.addEventListener("dragstart", handleDragStart);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //     document.removeEventListener("dragstart", handleDragStart);
  //   };
  // }, []);
  // ✅ NEW: Token validation utility
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
      // Basic JWT structure check
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.log("❌ Token expired at:", new Date(payload.exp * 1000));
        return false;
      }

      console.log(
        "✅ Token is valid, expires at:",
        new Date(payload.exp * 1000)
      );
      return true;
    } catch (error) {
      console.error("❌ Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) {
      router.push("/auth");
    } else {
      // ✅ DEBUG: Log token to check if it exists
      // console.log("Token found:", jwtToken ? "Yes" : "No");
      // console.log("Token starts with:", jwtToken?.substring(0, 20) + "...");

      // ✅ NEW: Validate token before using it
      if (!isTokenValid(jwtToken)) {
        // console.log("❌ Token is invalid or expired, redirecting to login");
        localStorage.removeItem("token");
        router.push("/auth");
        return;
      }

      setToken(jwtToken);
      loadFeed(jwtToken);
    }
  }, [router]);

  // ✅ IMPROVED: Better error handling and token validation
  const loadFeed = async (authToken: string) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const res = await fetch("http://localhost:3003/api/posts/feed", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json", // ✅ ADDED: Content-Type header
        },
      });

      // ✅ IMPROVED: Handle different error statuses
      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        router.push("/auth");
        return;
      }

      if (res.status === 500) {
        // Server error - show user-friendly message
        setError("Server is having issues. Please try again later.");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      setFeed(data.posts || []);
    } catch (err) {
      console.error("Fetching feed failed:", err);

      // ✅ IMPROVED: Better error handling based on error type
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to load feed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPROVED: Retry function for failed requests
  const retryLoadFeed = () => {
    if (token) {
      loadFeed(token);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    // Create preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async (authToken: string, file: File) => {
    // ✅ DEBUG: Log token and file info
    console.log(
      "🔍 Uploading image with token:",
      authToken?.substring(0, 20) + "..."
    );
    console.log("📁 File info:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3003/api/upload/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // ✅ REMOVED: Don't add Content-Type for FormData - browser sets it automatically
        },
        body: formData,
      });

      // ✅ DEBUG: Log response status
      console.log("📤 Upload response status:", res.status);

      // ✅ IMPROVED: Better error handling for image upload
      if (res.status === 401) {
        console.error("❌ Token expired or invalid");
        localStorage.removeItem("token");
        router.push("/auth");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const errorText = await res.text(); // Get raw response first
        console.error("❌ Upload failed:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { msg: `Upload failed with status ${res.status}` };
        }

        throw new Error(errorData.msg || "Image upload failed");
      }

      const data = await res.json();
      console.log("✅ Upload successful:", data);
      return { imageUrl: data.imageUrl, imageKey: data.imageKey };
    } catch (error) {
      console.error("💥 Upload error:", error);
      throw error;
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ IMPROVED: Better validation messages
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/auth");
      return;
    }

    if (!file) {
      alert("Please select an image to upload");
      return;
    }

    if (!title.trim()) {
      alert("Title is required and cannot be empty");
      return;
    }

    // ✅ DEBUG: Log current state
    console.log("🚀 Creating post with:", {
      hasToken: !!token,
      hasFile: !!file,
      title: title.trim(),
      fileSize: file?.size,
      fileType: file?.type,
    });

    try {
      setUploading(true);

      // ✅ IMPROVED: Check token validity before upload
      const currentToken = localStorage.getItem("token");
      if (!currentToken || currentToken !== token) {
        console.error("❌ Token mismatch or missing");
        alert("Session expired. Please login again.");
        router.push("/auth");
        return;
      }

      // Upload image first
      console.log("📤 Starting image upload...");
      const { imageUrl, imageKey } = await uploadImage(currentToken, file);
      console.log("✅ Image uploaded successfully");

      // Create post
      console.log("📝 Creating post...");
      const res = await fetch("http://localhost:3003/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: caption.trim() || undefined,
          category: category.trim() || undefined,
          tagName: tagName.trim() || undefined,
          imageUrl,
          imageKey,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.msg || "Failed to create post");
      }

      const data = await res.json();
      console.log("✅ Post created successfully:", data);

      // Add new post to the beginning of feed immediately
      setFeed((prevFeed) => [data.post, ...prevFeed]);

      // Clear form
      resetForm();

      alert("Post created successfully! 🎉");
    } catch (err) {
      console.error("💥 Error creating post:", err);
      alert(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCaption("");
    setCategory("");
    setTagName("");
    setFile(null);
    setImagePreview(null);

    // Reset file input
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ IMPROVED: Better loading state
  if (loading) {
    return (
      <main className="flex-1 p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      </main>
    );
  }

  // ✅ NEW: Error state with retry option
  if (error) {
    return (
      <main className="flex-1 p-4 flex justify-center items-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={retryLoadFeed}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <main className="flex-1 p-4 container mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Art Gallery Feed
          </h1>
          <p className="text-gray-600">Share your art with the world</p>
          <button onClick={handleLogout}>logout</button>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border w-1/4 absolute top-20">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image *
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs h-40 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                placeholder="Enter post title"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Tell us about your artwork..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Digital Art, Painting, Sculpture"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g., Abstract, Portrait, Landscape"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  disabled={uploading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !file || !title.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Post...
                </div>
              ) : (
                "Create Post"
              )}
            </button>
          </form>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Posts</h2>

          {feed.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts yet. Be the first to share your art!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-12 gap-6">
              {feed.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow col-span-2 md:col-span-3"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      {post.author.avatar ? (
                        <Image
                          src={post.author.avatar}
                          width={100}
                          height={100}
                          alt={`${post.author.firstName} ${post.author.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {post.author.firstName.charAt(0)}
                            {post.author.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {post.author.firstName} {post.author.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-gray-600 mb-4">{post.description}</p>
                    )}

                    {post.imageUrl && (
                      <div className="mb-4">
                        <Image
                          width={100}
                          height={100}
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full max-h-96 object-cover rounded-lg"
                          loading={"lazy"}
                        />
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 pt-2 border-t">
                      <span>❤️ {post._count.likes} likes</span>
                      <span>💬 {post._count.comments} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
