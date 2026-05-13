"use client"

import Image from "next/image"

type BlogDetailProps = {
  blog: {
    title: string
    image: string
    content: string[] // each item may contain HTML
    publishedAt: any
    category:any
  }
}

export default function BlogDetailView({ blog }: BlogDetailProps) {
  return (
    <div className="bg-white">
      {/* Hero Image */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="py-8 max-w-4xl">
        <h1 className="text-[42px] text-secondary font-bold mb-6">
          {blog.title}
        </h1>

        {/* ✅ Render HTML content safely */}
        <div className="space-y-6 leading-relaxed text-[20px] prose prose-lg max-w-none">
          {blog.content.map((html, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
