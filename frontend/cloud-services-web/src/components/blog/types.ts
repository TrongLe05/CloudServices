export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}
