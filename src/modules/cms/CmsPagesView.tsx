import { sanitizeHTML } from "@lib/util/sanitizeHTML"
import { PuckPageRenderer } from "@modules/page-renderer/puck-renderer"

// export const dynamic = "force-static"
// export const revalidate = 3600
//
// type PageViewProps = {
//   page: any
// }
//
// export async function generateStaticParams() {
//   const { pages } = await listPages()
//
//   return pages.map((page) => ({
//     slug: [page.handle],
//   }))
// }
type PageViewProps = {
  page: any
}

export default function PageView({ page }: PageViewProps) {
  const sanitizedContent: any = sanitizeHTML(page.content)
  if (page.type === "builder") {
    return <PuckPageRenderer page={page} />
  }
    return (
      <div className="content-container py-12">
        <article className="max-w-[1350px] mx-auto px-4 sm:px-6">
          {page.title && (
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-menubg">
                {page.title}
              </h1>
            </header>
          )}

          {page.images?.length ? (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.images.map((img: any) => (
                <div
                  key={img.id}
                  className="relative aspect-video overflow-hidden rounded-lg"
                >
                  <img
                    src={img.url}
                    alt={img.alt ?? page.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </article>
      </div>
    )
}
