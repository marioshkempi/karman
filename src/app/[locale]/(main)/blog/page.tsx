// app/blog/page/[page]/page.tsx
import { Metadata } from "next"
import BlogTemplate from "@modules/blog/templates"
import { getBlogCategories, getBlogPosts } from "@lib/data/blog"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"
import NotFound from "../not-found"

export const dynamic = "force-static"
export const revalidate = 3600 // ISR: rebuild in background every hour

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("blog")

  return toNextMetadata(seo, {
    title: "Blog",
    description: "Explore our blog posts.",
  })
}

const PAGE_SIZE = 5

// 🔥 Pre-generate static params so pages are SSG
export async function generateStaticParams() {
  const { count } = await getBlogPosts({
    limit: 1,
    offset: 0,
  })

  const totalPages = Math.ceil(count / PAGE_SIZE)

  return Array.from({ length: totalPages }).map((_, i) => ({
    page: (i + 1).toString(),
  }))
}

type PageProps = {
  params: {
    page: string
  }
}

export default async function BlogPage({ params }: PageProps) {
  const currentPage = Math.max(Number(params.page) || 1, 1)
  const offset = (currentPage - 1) * PAGE_SIZE

  const [{ blog_posts, count }, { blog_categories }, seo] = await Promise.all([
    getBlogPosts({ limit: PAGE_SIZE, offset }),
    getBlogCategories(),
    getPageSeo("blog"),
  ])

  if (count === 0) return NotFound()

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <BlogTemplate
        posts={blog_posts}
        categories={blog_categories}
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={count}
      />
    </>
  )
}
