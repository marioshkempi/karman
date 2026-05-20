"use client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Blog images
const BLOG_1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blog-1-QjSeQAnLvDBDzDBQVMp6tfMKTP19go.jpg"
const BLOG_2 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blog-2-SNQCicS3kxDN6TW6EqYHMVDa3ux3O9.jpg"
const BLOG_3 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blog-3-YAFxkT9CYFGuyHnWmZ8ofgNGIvTszl.jpg"
const BLOG_4 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blog-4-j1eREgTBCr9aExh53m7JCGcyAN6ROd.jpg"

// Static blog data
const FEATURED_BLOG = {
  date: "07-02-2025",
  title: "SPARCO: FROM MOTORSPORT TO OCCUPATIONAL SAFETY.",
  tags: ["NEWS", "ARTICLE", "EVENT"],
  description: "World Day for Safety and Health at Work draws attention to a key issue for companies, workers, and institutions: promoting a culture in which prevention and safety are increasingly embedded in everyday professional life.",
  image: BLOG_1,
}

const SMALL_BLOGS = [
  {
    date: "06-02-2025",
    title: "MICHELIN AND BRIDGESTONE TACKLE ENVIRONMENTAL INITIATIVE",
    tags: ["NEWS", "ARTICLE"],
    image: BLOG_2,
  },
  {
    date: "04-05-2025",
    title: "DEBUNKING 7 MYTHS ABOUT RETREAD TIRES",
    tags: ["ARTICLE"],
    image: BLOG_3,
  },
  {
    date: "12-02-2025",
    title: "GEAR UP FOR CHANGE: TRUCKING INDUSTRY REGULATIONS IN 2025",
    tags: ["NEWS", "ARTICLE", "EVENT"],
    image: BLOG_4,
  },
]

export default function BlogBanner(banner: any) {
  return (
    <section className="bg-[#0a0a0a] py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold tracking-wide mb-2">
            BLOG & NEWS
          </h2>
          <LocalizedClientLink 
            href="/blog" 
            className="text-gray-400 text-sm uppercase tracking-wide hover:text-white transition-colors"
          >
            VIEW ALL ARTICLES
          </LocalizedClientLink>
        </div>

        {/* Featured Blog - Large */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Featured Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] rounded-xl overflow-hidden">
            <img 
              src={FEATURED_BLOG.image} 
              alt={FEATURED_BLOG.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Featured Content Card */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 md:p-8 flex flex-col justify-center">
            <span className="text-gray-300 text-sm mb-3">{FEATURED_BLOG.date}</span>
            
            <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
              {FEATURED_BLOG.title}
            </h3>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {FEATURED_BLOG.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs font-medium text-white border border-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
              {FEATURED_BLOG.description}
            </p>
            
            <LocalizedClientLink
              href="/blog"
              className="inline-block self-start border-2 border-white text-white font-semibold px-6 py-2.5 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
            >
              READ MORE
            </LocalizedClientLink>
          </div>
        </div>

        {/* Small Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SMALL_BLOGS.map((blog, index) => (
            <div key={index} className="group cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <span className="text-gray-300 text-xs mb-2 block">{blog.date}</span>
              
              <h4 className="text-white text-sm md:text-base font-bold mb-3 leading-tight group-hover:text-gray-300 transition-colors">
                {blog.title}
              </h4>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-medium text-white border border-gray-500 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
