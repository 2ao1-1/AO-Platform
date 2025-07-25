import { useState } from "react";
import { Post } from "../_types/postsType";
import { apiService } from "../_service/Api";

export const useCreatePost = (
  token: string | null,
  onUnauthorized: () => void,
  onPostCreated: (post: Post) => void
) => {
  const [uploading, setUploading] = useState(false);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [tagName, setTagName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

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

  // Reset form
  const resetForm = () => {
    setTitle("");
    setCaption("");
    setCategory("");
    setTagName("");
    setFile(null);
    setImagePreview(null);

    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Create post
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      onUnauthorized();
      return;
    }

    if (!file) {
      return;
    }

    if (!title.trim()) {
      return;
    }

    try {
      setUploading(true);

      const currentToken = localStorage.getItem("token");
      if (!currentToken || currentToken !== token) {
        onUnauthorized();
        return;
      }

      // Upload image first
      const { imageUrl, imageKey } = await apiService.uploadImage(
        currentToken,
        file
      );

      // Create post
      const postData = {
        title: title.trim(),
        description: caption.trim() || undefined,
        category: category.trim() || undefined,
        tagName: tagName.trim() || undefined,
        imageUrl,
        imageKey,
      };

      const result = await apiService.createPost(currentToken, postData);

      // Add new post to feed
      onPostCreated(result.post);

      // Clear form
      resetForm();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          onUnauthorized();
          return;
        }
        alert(err.message);
      } else {
        alert("Failed to create post");
      }
    } finally {
      setUploading(false);
    }
  };

  return {
    // Form states
    file,
    title,
    caption,
    category,
    tagName,
    imagePreview,
    uploading,

    // Form setters
    setTitle,
    setCaption,
    setCategory,
    setTagName,

    // Functions
    handleFileChange,
    createPost,
    resetForm,
  };
};
