"use client"

import Breadcrumb from "@modules/common/components/breadcrumb"
import { Search, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import BlogDetailView from "../components/blog-detail-view"
import { HttpBlogPost } from "@constants/blog"
import { PuckPageRenderer } from "@modules/page-renderer/puck-renderer"
import { useTranslations } from "next-intl"

interface BlogViewTemplateProps {
  post: any
}

const BlogViewTemplate = ({ post }: BlogViewTemplateProps) => {
  const t = useTranslations()
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const categories: any = useMemo(() => {
    if (!post?.category) return []
    return [
      {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
      },
    ]
  }, [post?.category])

  if (!post) return null

  const toggleCategory = (categoryId: string) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-5 py-6 lg:py-8">
        <div className="mb-6">
          <Breadcrumb
            showEllipsis={true}
            ellipsisPosition={1}
            tree={[{ label: "Blog", href: "/blog" }]}
            lastLabel={post.title}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0">
            {post.type === "editor" && post.content ? (
              <PuckPageRenderer page={post} />
            ) : (
              <BlogDetailView
                blog={{
                  title: post.title,
                  image: post.featured_image ?? "",
                  content: post.content ? [post.content] : [],
                  publishedAt: post.published_at,
                  category: post.category?.name,
                }}
              />
            )}
          </div>

          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-6">
              <div className="w-full max-w-[290px]">
                <div className="mb-4">
                  <div className="bg-menubg text-white px-4 py-2 text-[17px] font-medium rounded-[6px]">
                    {t("navigation.categories")}
                  </div>

                  <div className="bg-white">
                    {categories.length === 0 && (
                      <div className="px-4 py-3 text-[13px] text-gray-500">
                        {t("blog.noCategory")}
                      </div>
                    )}

                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-secondary text-[14px] hover:bg-gray-50 transition-colors"
                        >
                          <span>{category.name}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              openCategory === category.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("common.search")}
                      className="w-full h-[35px] pl-4 pr-12 border-2 border-primary rounded-[20.61px] text-sm placeholder:text-primary placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    />
                    <Search
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default BlogViewTemplate
