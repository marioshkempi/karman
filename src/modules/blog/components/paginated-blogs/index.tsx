import { Pagination } from "@modules/store/components/pagination"
import BlogPreview from "@modules/blog/components/blog-preview"
import { HttpBlogPost } from "@constants/blog"

interface PaginatedBlogsProps {
  posts: HttpBlogPost[]
  page: number
  pageSize: number
  total: number
}

export default function PaginatedBlogs({
  posts,
  page,
  pageSize,
  total,
}: PaginatedBlogsProps) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <ul
        className="grid grid-cols-1 md:grid-cols-2 w-full gap-x-6 gap-y-8"
        data-testid="blogs-list"
      >
        {posts.map((post) => (
          <li key={post.id}>
            <BlogPreview
              blog={{
                id: post.id,
                title: post.title,
                handle: post.slug,
                image: post.featured_image ?? "",
                date: post.published_at
                  ? new Date(post.published_at).toLocaleDateString("el-GR")
                  : "",
              }}
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          data-testid="blog-pagination"
          placement="left"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
