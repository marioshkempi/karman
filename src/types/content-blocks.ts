// lib/types/content-blocks.ts

/**
 * Content Block Type
 * Represents a content block from the database
 */
export interface ContentBlock {
  id: string
  title: string
  identifier: string
  type: "image" | "html"
  content: string | null
  image_url: string | null
  alt_text: string | null
  is_active: boolean
  sort_order: number | null
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

/**
 * Parameters for fetching content blocks
 */
export interface GetContentBlocksParams {
  identifier?: string
  identifiers?: string[]
  type?: "image" | "html"
}

/**
 * Response from getContentBlocks function
 */
export interface GetContentBlocksResponse {
  response: {
    contentBlocks: ContentBlock[]
    count: number
  }
}

/**
 * Response from getContentBlockByIdentifier function
 */
export interface GetContentBlockByIdentifierResponse {
  response: {
    contentBlock: ContentBlock | null
  }
}

/**
 * API response from the backend
 */
export interface ContentBlocksApiResponse {
  content_blocks: ContentBlock[]
}

/**
 * Type guard to check if a block is an image type
 */
export function isImageBlock(block: ContentBlock): block is ContentBlock & {
  type: "image"
  image_url: string
} {
  return block.type === "image" && !!block.image_url
}

/**
 * Type guard to check if a block is an html type
 */
export function isHtmlBlock(block: ContentBlock): block is ContentBlock & {
  type: "html"
  content: string
} {
  return block.type === "html" && !!block.content
}

/**
 * Props for ContentBlockRenderer component
 */
export interface ContentBlockRendererProps {
  blocks: ContentBlock[]
  className?: string
  imageClassName?: string
  renderBlock?: (block: ContentBlock) => React.ReactNode
}

/**
 * Props for server ContentBlock component
 */
export interface ContentBlockProps {
  identifier?: string
  identifiers?: string[]
  type?: "image" | "html"
  className?: string
  imageClassName?: string
  renderBlock?: (block: ContentBlock) => React.ReactNode
}

/**
 * Error type for content block operations
 */
export interface ContentBlockError {
  message: string
  code?: string
  statusCode?: number
}