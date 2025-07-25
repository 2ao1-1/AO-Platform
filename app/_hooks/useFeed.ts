import { useEffect, useState } from "react";
import { Post } from "../_types/postsType";
import { apiService } from "../_service/Api";

export const useFeed = (token: string | null, onUnauthorized: () => void) => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load feed function
  const loadFeed = async (authToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.getFeed(authToken);
      setFeed(data.posts || []);
    } catch (err) {
      console.error("Fetching feed failed:", err);

      if (err instanceof Error) {
        if (err.message === "Unauthorized") {
          onUnauthorized();
          return;
        }

        if (err.message.includes("fetch")) {
          setError(
            "Cannot connect to server. Please check if the server is running."
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to load feed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Retry function
  const retryLoadFeed = () => {
    if (token) {
      loadFeed(token);
    }
  };

  // Add new post to feed
  const addPostToFeed = (newPost: Post) => {
    setFeed((prevFeed) => [newPost, ...prevFeed]);
  };

  // Load feed when token changes
  useEffect(() => {
    if (token) {
      loadFeed(token);
    }
  }, [token]);

  return {
    feed,
    loading,
    error,
    retryLoadFeed,
    addPostToFeed,
    refetch: () => token && loadFeed(token),
  };
};
