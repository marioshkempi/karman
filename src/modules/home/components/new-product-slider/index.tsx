"use client"

import React, { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

interface ProductSliderProps {
  children: React.ReactNode[]
}

export function ProductSlider({ children }: ProductSliderProps) {
  const [slidesPerView, setSlidesPerView] = useState(4)
  const [isMobile, setIsMobile] = useState(false)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      if (mobile) setSlidesPerView(2)
      else if (window.innerWidth < 1024) setSlidesPerView(3)
      else setSlidesPerView(4)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: isMobile ? 2 : 1,
    containScroll: "trimSnaps",
    dragFree: isMobile,
  })

  const totalPages = emblaApi?.scrollSnapList().length ?? 0

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setCurrentPage(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  const gap = isMobile ? 16 : 20
  const slideWidth = `calc((100% - ${
    (slidesPerView - 1) * gap
  }px) / ${slidesPerView})`

  return (
    <div className="relative overflow-hidden">
      {!isMobile && canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all text-primary/60 hover:text-primary cursor-pointer"
          aria-label="Previous products"
        >
          <ChevronLeft
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            strokeWidth={1.5}
          />
        </button>
      )}

      <div
        className={`overflow-hidden ${
          !isMobile && (canScrollPrev || canScrollNext)
            ? "mx-8 md:mx-10 lg:mx-0"
            : ""
        }`}
        ref={emblaRef}
      >
        <div className="flex gap-4 lg:gap-5">
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 min-w-0"
              style={{ width: slideWidth }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {!isMobile && canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all text-primary/60 hover:text-primary cursor-pointer"
          aria-label="Next products"
        >
          <ChevronRight
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            strokeWidth={1.5}
          />
        </button>
      )}

      {isMobile && children.length > 2 && (
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentPage ? "bg-primary" : "bg-primary/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
