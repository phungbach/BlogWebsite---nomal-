export type PostCategory =
  | 'AI & Machine Learning'
  | 'Distributed Systems'
  | 'DevSecOps & Cloud'
  | 'Software Architecture'
  | 'Semiconductors & Hardware';

export type PostStatus = 'published' | 'draft' | 'archived';

export interface Author {
  name: string;
  role: string;
  avatar?: string;
  bio: string;
  github?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  coverImage: string;
  coverImageCaption?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  claps: number;
  views: number;
  featured?: boolean;
  isPinned?: boolean;
  status: PostStatus;
  tags: string[];
  techStack?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  claps: number;
  status: 'approved' | 'pending' | 'spam';
}

export type AdminTab = 'overview' | 'posts' | 'create' | 'comments' | 'settings';
export type ThemeMode = 'dark' | 'light';

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  token: string;
  loginAt: string;
}
