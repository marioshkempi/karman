// types/http/blog.ts

export type BlogPostStatus = "draft" | "published" | "archived"

export interface HttpBlogCategory {
  id: string
  name: string
  slug: string
  description: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface HttpBlogPost {
  id: string
  title: string
  slug: string
  content: string
  published_at: string | null
  author_id: string
  metadata: Record<string, any>
  featured_image: string | null
  status: BlogPostStatus
  is_enabled: boolean
  category_id: string
  category: HttpBlogCategory | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  seo: any
}

export interface HttpBlogPostsResponse {
  blog_posts: HttpBlogPost[]
  count: number
  limit: number
  offset: number
}

// @constants/blog.ts

export interface HttpBlogCategoryPost {
  slug: string
  title: string
}

export interface HttpBlogCategory {
  id: string
  name: string
  slug: string
  description: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  posts: HttpBlogCategoryPost[]
}

export interface HttpBlogCategoriesResponse {
  blog_categories: HttpBlogCategory[]
  count: number
  limit: number
  offset: number
}
