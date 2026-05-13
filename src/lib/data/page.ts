"use server"

import { sdk } from "@lib/config"
import {
  getAuthHeaders,
  getCacheOptions,
  getSimpleCacheOptions,
} from "./cookies"

export interface StorePageImage {
  id: string
  url: string
  alt: string | null
  page_id: string
}

export interface StorePage {
  id: string
  handle: string
  name: string
  title: string | null
  content: string
  images?: StorePageImage[]
  created_at: string
  updated_at: string
}

export const getPageByHandle = async (
  handle: string
): Promise<StorePage | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // const next = {
  //   ...(await getCacheOptions("pages")),
  // }

  try {
    const { page } = await sdk.client.fetch<{
      page: StorePage
    }>(`/store/pages/${handle}`, {
      method: "GET",
      headers,
      next: getSimpleCacheOptions("page"),
      cache: "force-cache",
    })

    return page
  } catch (error) {
    return null
  }
}

export const listPages = async ({
  queryParams,
}: {
  queryParams?: Record<string, string>
} = {}): Promise<{
  pages: StorePage[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("pages")),
  }

  try {
    const { pages, count } = await sdk.client.fetch<{
      pages: StorePage[]
      count: number
    }>(`/store/pages`, {
      method: "GET",
      query: queryParams,
      headers,
      next,
      cache: "force-cache",
    })
    //console.log(pages, 'pages frm listPages')

    return {
      pages,
      count,
    }
  } catch (error) {
    return {
      pages: [],
      count: 0,
    }
  }
}
