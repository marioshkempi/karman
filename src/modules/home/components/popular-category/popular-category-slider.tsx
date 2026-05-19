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
      {/* Previous Button */}
      {!isMobile && canGoPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-14 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 hover:border-red-500 transition-all group"
          aria-label="Previous categories"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-red-600 transition-colors" strokeWidth={2} />
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
          className={`flex gap-4 lg:gap-5 ${!isMobile ? 'transition-transform duration-500 ease-out' : ''}`}
          style={!isMobile ? {
            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
          } : {}}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={!isMobile ? { 
                width: `calc((100% - ${(slidesPerView - 1) * (slidesPerView === 2 ? 16 : 20)}px) / ${slidesPerView})`
              } : {
                width: 'calc((100% - 16px) / 2)'
              }}
            >
              <PopularCategoryCard item={item} ctaText={ctaText} />
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      {!isMobile && canGoNext && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-14 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 hover:border-red-500 transition-all group"
          aria-label="Next categories"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-red-600 transition-colors" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

function PopularCategoryCard({ item, ctaText }: { item: StorePopularCategoryItem; ctaText: string }) {
  const href = item.url || '#'
  const isExternal = href.startsWith('http')

  const content = (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-300" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
        <h3 className="text-white text-base lg:text-lg font-bold uppercase tracking-wide mb-2">
          {item.title}
        </h3>
        <span className="inline-flex items-center text-xs lg:text-sm text-white/90 font-medium group-hover:text-red-400 transition-colors">
          {ctaText}
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
