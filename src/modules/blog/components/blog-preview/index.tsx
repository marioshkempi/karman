import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type BlogPost = {
  id: string
  date: string
  title: string
  image: string
  handle: string
}

export default function BlogPreview({ blog }: { blog: BlogPost }) {
  return (
    <LocalizedClientLink
      href={`/blog/${blog.handle}`}
      className="group block"
    >
      <div className="bg-white overflow-hidden">
        <div className="relative w-full aspect-[4/2]">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-fill"
          />
        </div>
        <div className="pt-4">
          <p className="text-quaternary mb-2" style={{ fontSize: "20px" }}>
            {blog.date}
          </p>
          <h3
            className="text-secondary font-semibold"
            style={{ fontSize: "26px" }}
          >
            {blog.title}
          </h3>
        </div>
      </div>
    </LocalizedClientLink>
  )
}