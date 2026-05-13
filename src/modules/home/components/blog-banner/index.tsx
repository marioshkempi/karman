"use client"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BlogBanner(banner: any) {
  const blogBanner = banner.banner

  return (
    <div className="w-full mb-8 lg:mb-16">
      <div className="max-w-[1350px] mx-auto px-4">
        <div className="relative w-full md:h-[572.67px] overflow-hidden">
          <div className="relative md:hidden">
            <Image
              src={blogBanner.image_url}
              alt={blogBanner.image_alt}
              width={1350}
              height={572}
              className="w-full h-auto"
            />
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 blog-triangle-badge">
                <span className="blog-triangle-text text-white px-4 py-2 text-lg">
                  {blogBanner.title}
                </span>
              </div>

              <div className="absolute left-2 bottom-4 p-4 max-w-[300px]">
                <h2 className="text-secondary text-[18px] font-bold">
                  {blogBanner.content}
                </h2>
                <LocalizedClientLink
                  href={blogBanner.cta_link}
                  className="bg-secondary text-white px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90 rounded"
                  onClick={() => window.open(blogBanner.cta_link)}
                >
                  {blogBanner.cta_text}
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative w-full h-full">
            <Image
              src={blogBanner.image_url}
              alt={blogBanner.image_alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 blog-triangle-badge blog-triangle-badge-md">
                <span className="blog-triangle-text text-white px-8 py-4 text-2xl">
                  {blogBanner.title}
                </span>
              </div>

              <div className="absolute left-4 bottom-8 p-8 max-w-[400px]">
                <h2 className="text-secondary text-[20px] font-bold">
                  {blogBanner.content}
                </h2>
                <LocalizedClientLink
                  href={blogBanner.cta_link}
                  className="bg-secondary text-white px-6 py-2 text-sm font-medium transition-opacity hover:opacity-90 rounded"
                >
                  {blogBanner.cta_text}
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
