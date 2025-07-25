export interface Post {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  tagName?: string;
  category?: string;
  author: Author;
  isLiked: boolean;
  _count: {
    likes: number;
    comments: number;
    bids: number;
  };
  comments?: Comment[];
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  description?: string;
  category?: string;
  tagName?: string;
  imageUrl: string | undefined;
  imageKey: string;
}

export interface UploadImageResponse {
  imageUrl: string;
  imageKey: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}
