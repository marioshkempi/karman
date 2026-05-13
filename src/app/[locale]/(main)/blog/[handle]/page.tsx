import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBlogByHandle } from "@lib/data/blog"
import BlogViewTemplate from "@modules/blog/view-template"

type Params = {
  params: Promise<{
    handle: string
    countryCode: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const blog:any = await getBlogByHandle(params.handle)

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  // Extract plain text from HTML content for description
  const plainTextContent = blog.content
    ? blog.content.replace(/<[^>]*>/g, "").substring(0, 160)
    : ""

  return {
    title: blog.title,
    description: plainTextContent || blog.title,
    openGraph: {
      title: blog.title,
      description: plainTextContent || blog.title,
      type: "article",
      publishedTime: blog.published_at,
      authors: [blog.author_id],
      images: blog.featured_image
        ? [
          {
            url: blog.featured_image,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: plainTextContent || blog.title,
      images: blog.featured_image ? [blog.featured_image] : [],
    },
    alternates: {
      canonical: `/blogs/${params.handle}`,
    },
  }
}

export default async function BlogPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { page } = searchParams

  const blog = await getBlogByHandle(params.handle)

  if (!blog) {
    notFound()
  }

  return (
    <>
      <BlogViewTemplate post={blog} />
    </>
  )
}