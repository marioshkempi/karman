"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { StorePopularCategoryItem } from "@lib/data/popular-categories"

interface PopularCategorySliderProps {
  items: StorePopularCategoryItem[]
  ctaText: string
}

export default function PopularCategorySlider({ items, ctaText }: PopularCategorySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(4)
  const [isMobile, setIsMobile] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      if (mobile) {
        setSlidesPerView(2)
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(3)
      } else {
        setSlidesPerView(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, items.length - slidesPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  return (
    <div className="relative">
      {!isMobile && canGoPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 lg:-translate-x-20 z-10 transition-all text-primary/60 hover:text-primary cursor-pointer"
          aria-label="Previous categories"
        >
          <ChevronLeft className="w-12 h-12 lg:w-20 lg:h-20" strokeWidth={1} />
        </button>
      )}

      <div 
        className={isMobile ? 'overflow-x-auto' : 'overflow-hidden'}
        ref={sliderRef}
        style={isMobile ? {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        } : {}}
      >
        <div
          className={`flex gap-4 lg:gap-6 ${!isMobile ? 'transition-transform duration-500 ease-out' : ''}`}
          style={!isMobile ? {
            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
          } : {}}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={!isMobile ? { 
                width: `calc((100% - ${(slidesPerView - 1) * (slidesPerView === 2 ? 16 : 24)}px) / ${slidesPerView})`
              } : {
                width: 'calc((100% - 16px) / 2)'
              }}
            >
              <PopularCategoryCard item={item} ctaText={ctaText} />
            </div>
          ))}
        </div>
      </div>

      {!isMobile && canGoNext && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 lg:translate-x-20 z-10 transition-all text-primary/60 hover:text-primary cursor-pointer"
          aria-label="Next categories"
        >
          <ChevronRight className="w-12 h-12 lg:w-20 lg:h-20" strokeWidth={1} />
        </button>
      )}
    </div>
  )
}

function PopularCategoryCard({ item, ctaText }: { item: StorePopularCategoryItem; ctaText: string }) {
  const href = item.url || '#'
  const isExternal = href.startsWith('http')

  const content = (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Content inside card */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
        <h3 className="text-white text-lg lg:text-xl font-semibold drop-shadow-lg">
          {item.title}
        </h3>
        <span className="inline-block px-4 py-2 bg-white text-gray-800 text-xs lg:text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
          {ctaText}
        </span>
      </div>
    </div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  )
}

