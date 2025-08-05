export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  phone: number;
  socialLinks: string[];
  isVerified: boolean;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export interface ProfileData {
  user: User;
}
