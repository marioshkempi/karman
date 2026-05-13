"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import sanitizeHtml from "sanitize-html"
import Link from "next/link"

export interface StoreBanner {
  id: string
  title: string
  description: string | null
  image_url: string
  mobile_image_url: string | null
  cta_text: string | null
  cta_url: string | null
  hook: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  query_parameters?: Array<{
    id: string
    param_key: string
    param_value: string
  }>
}
interface BannerCarouselProps {
  banners: StoreBanner[]
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const sanitizeContent = (html: string) => {
    return sanitizeHtml(html, {
      allowedTags: ['p', 'strong', 'em', 'br', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div'],
      allowedAttributes: {
        'a': ['href', 'target', 'rel'],
        'span': ['style'],
        'div': ['style'],
        'p': ['style']
      },
      allowedStyles: {
        '*': {
          'color': [/^#[0-9a-fA-F]{3,6}$/],
          'text-align': [/^(left|right|center|justify)$/],
          'font-weight': [/^\d+$/],
        }
      }
    })
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide()
    }
    if (touchStart - touchEnd < -50) {
      prevSlide()
    }
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-[16/8] overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              className="object-cover hidden md:block"
              priority
            />
            {banner.mobile_image_url && (
              <Image
                src={banner.mobile_image_url}
                alt={banner.title}
                fill
                className="object-cover md:hidden"
                priority
              />
            )}
            
            {/* Content overlay */}
            {(banner.description || banner.cta_text) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  {banner.description && (
                    <div 
                      className="prose prose-lg prose-invert max-w-none mb-6"
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeContent(banner.description) 
                      }}
                    />
                  )}
                  
                  {banner.cta_text && banner.cta_url && (
                    <Link
                      href={banner.cta_url}
                      className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      {banner.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-8" : "bg-white/50"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BannerCarousel