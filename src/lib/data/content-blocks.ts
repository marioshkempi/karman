// lib/data/content-blocks.ts
import "server-only"
import { sdk } from "@lib/config"
import {
  getAuthHeaders,
  getCacheOptions,
  getSimpleCacheOptions,
} from "@lib/data/cookies"

import type {
  ContentBlock,
  GetContentBlocksParams,
} from "@constants/content-blocks"

export async function getContentBlocks({
  identifier,
  identifiers,
  type,
}: GetContentBlocksParams = {}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const queryParams = new URLSearchParams()

  if (identifier) {
    queryParams.append("identifier", identifier)
  }
  if (identifiers && identifiers.length > 0) {
    queryParams.append("identifiers", identifiers.join(","))
  }
  if (type) {
    queryParams.append("type", type)
  }

  const url =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL +
    `/store/content-blocks${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`

  const response: any = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      ...headers,
    },
    next: getSimpleCacheOptions("content-blocks"),
    cache: "force-cache",
  })
  const parsedResponse = await response.json()
  if (!parsedResponse || !parsedResponse.content_blocks) {
    throw new Error("Failed to fetch content blocks")
  }

  return {
    response: {
      contentBlocks: parsedResponse.content_blocks as ContentBlock[],
      count: parsedResponse.content_blocks.length,
    },
  }
}

export async function getContentBlockByIdentifier(
  identifier: string
): Promise<ContentBlock | null> {
  const { response } = await getContentBlocks({ identifier })
  return response.contentBlocks[0] || null
}
