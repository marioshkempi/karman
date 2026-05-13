// components/content-block-renderer.tsx
"use client"

import Image from "next/image"

interface ContentBlockRendererProps {
  blocks: any
  className?: string
  imageClassName?: string
  renderBlock?: (block: any) => React.ReactNode
}

export default function ContentBlockRenderer({
  blocks,
  className,
  imageClassName,
  renderBlock,
}: ContentBlockRendererProps) {

  if (!blocks || blocks.length === 0) {
    return null
  }

  const defaultRender = (block: any) => {
    if (!block) return null
    if (block.type === "image" && block.image_url) {
      return (
        <div key={block.id} className="content-block-image">
          {block.title && (
            <h2 className="text-xl font-semibold mb-4">{block.title}</h2>
          )}
          <Image
            src={block.image_url}
            alt={block.alt_text || block.title || "Content image"}
            width={1200}
            height={600}
            className={imageClassName || "w-full h-auto rounded-lg"}
          />
        </div>
      )
    }

    if (block.type === "html" && block.content) {
      return (
        <div key={block.id} className="content-block-html">
          {/*{block.title && (*/}
          {/*  <h2 className="text-xl font-semibold mb-4">{block.title}</h2>*/}
          {/*)}*/}
          <div
            className=" max-w-none"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className={className}>
      {blocks.map((block: any) =>
        renderBlock ? renderBlock(block) : defaultRender(block)
      )}
    </div>
  )
}
