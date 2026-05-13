"use client"

import Breadcrumb from "@modules/common/components/breadcrumb"
import PaginatedBlogs from "../components/paginated-blogs"
import { Search, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import { HttpBlogCategory, HttpBlogPost } from "@constants/blog"
import { useTranslations } from "next-intl"

interface BlogTemplateProps {
  posts: HttpBlogPost[]
  categories: HttpBlogCategory[]
  page: number
  pageSize: number
  total: number
}

const BlogTemplate = ({
  posts,
  categories,
  page,
  pageSize,
  total,
}: BlogTemplateProps) => {
  const t = useTranslations()
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId))
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-6">
          <Breadcrumb showEllipsis={true} ellipsisPosition={1} lastLabel={"Blog"}/>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* MAIN CONTENT */}
          <div className="flex-1">
            <PaginatedBlogs
              posts={posts}
              page={page}
              pageSize={pageSize}
              total={posts.length}
            />
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-6">
              <div className="w-full max-w-[290px]">
                {/* Categories */}
                <div className="mb-4">
                  <div className="bg-menubg text-white px-4 py-2 text-[17px] font-medium rounded-[6px]">
                    {t("navigation.categories")}
                  </div>

                  <div className="bg-white">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-secondary text-[14px] hover:bg-gray-50 transition-colors"
                        >
                          <span>
                            {category.name}{" "}
                            <span className="text-gray-400">
                              ({category.posts.length})
                            </span>
                          </span>

                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              openCategory === category.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openCategory === category.id && (
                          <div className="px-4 pb-3 bg-gray-50 space-y-1">
                            {category.posts.map((post) => (
                              <a
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="block text-[13px] text-secondary hover:text-primary"
                              >
                                {post.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search (future-ready) */}
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

export default BlogTemplate
