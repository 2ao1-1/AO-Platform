"use client";
import { useAuth } from "./_hooks/useAuth";
import { useFeed } from "./_hooks/useFeed";
import { useCreatePost } from "./_hooks/useCreatePost";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_API_BASE_URL;

export default function Home() {
  // Authentication hook
  const {
    token,
    isLoading: authLoading,
    logout,
    handleUnauthorized,
  } = useAuth();

  // Feed hook
  const {
    feed,
    loading: feedLoading,
    error,
    retryLoadFeed,
    addPostToFeed,
  } = useFeed(token, handleUnauthorized);

  // Post creation hook
  const {
    file,
    title,
    caption,
    category,
    tagName,
    imagePreview,
    uploading,
    setTitle,
    setCaption,
    setCategory,
    setTagName,
    handleFileChange,
    createPost,
  } = useCreatePost(token, handleUnauthorized, addPostToFeed);

  // Format date utility
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading during auth check
  if (authLoading) {
    return (
      <main className="flex-1 p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </main>
    );
  }

  // Show loading during feed fetch
  if (feedLoading) {
    return (
      <main className="flex-1 p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      </main>
    );
  }

  // Show error state
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

  return (
    <main className="flex-1 p-4 container mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Art Gallery Feed
          </h1>
          <p className="text-gray-600">Share your art with the world</p>
          <button onClick={logout}>logout</button>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border w-1/4 absolute top-20">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

          <form onSubmit={createPost} className="space-y-4">
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
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
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
