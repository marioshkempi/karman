// lib/data/blog.ts
import { sdk } from "@lib/config"
import {
  HttpBlogCategoriesResponse,
  HttpBlogPostsResponse,
} from "@constants/blog"
import {
  getAuthHeaders,
  getCacheOptions,
  getSimpleCacheOptions,
} from "./cookies"
import { getLocaleHeader } from "@lib/locale"

export const getBlogPosts = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("blog")),
  }

  const limit = Number(query?.limit) || 10
  const offset = Number(query?.offset) || 0

  return sdk.client.fetch<HttpBlogPostsResponse>("/store/blog", {
    query: {
      fields: "*",
      limit,
      offset,
      ...query,
    },
    next: getSimpleCacheOptions("blogs"),
    cache: "force-cache",
  })
}
export type StoreBlog = {
  id: string
  title: string
  slug: string
  content: string
  featured_image?: string | null
  date: string
  created_at: string
  updated_at: string
}
export const getBlogByHandle = async (
  handle: string
): Promise<StoreBlog | null> => {
  // const headers = {
  //   ...(await getAuthHeaders()),
  // }
  const headers = {
    ...(await getLocaleHeader()),
  }
  const next = {
    ...(await getCacheOptions("blogs")),
  }

  return sdk.client
    .fetch<{ blog: any }>(`/store/blog/${handle}`, {
      method: "GET",
      headers,
      next,
      // cache: "force-cache",
    })
    .then(({ blog }) => blog)
    .catch(() => null)
}

// export const getBlogPostByHandle = async (handle: string) => {
//   const headers = {
//     ...(await getLocaleHeader()),
//   }
//
//   const { blog_posts } = await sdk.client.fetch<HttpBlogPostsResponse>(
//     "/store/blog",
//     {
//       query: {
//         fields: "*",
//         handle,
//         limit: 1,
//         headers,
//       },
//
//       next: getSimpleCacheOptions("blog"),
//       cache: "force-cache",
//     }
//   )
//
//   return blog_posts[0] ?? null
// }

export const getBlogCategories = async (query?: {
  limit?: number
  offset?: number
}) => {
  const next = {
    ...(await getCacheOptions("blog-categories")),
  }

  const limit = Number(query?.limit) || 1
  const offset = Number(query?.offset) || 0

  return sdk.client.fetch<HttpBlogCategoriesResponse>(
    "/store/blog/categories",
    {
      query: {
        fields: "*",
        take: limit,
        offset,
      },
      next,
      cache: "force-cache",
    }
  )
}
