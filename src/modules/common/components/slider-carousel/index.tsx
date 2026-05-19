"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { StoreSlide } from "@lib/data/slider"
import Link from "next/link"

// Static hero background - always visible
const HERO_BG_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-racing-car-D3V1omw0T3wKqF5Yi4r8llJVl7VO6Z.jpg"

interface SliderCarouselProps {
  slides: StoreSlide[]
}

const SliderCarousel = ({ slides }: SliderCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length)
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)

  useEffect(() => {
    const interval = setInterval(nextSlide, 15000)
    return () => clearInterval(interval)
  }, [currentIndex, slides.length])

  // If no slides or slides array is empty, show the static hero
  if (!slides || !slides.length) {
    return <StaticHero />
  }

  return (
    <div className="relative w-full overflow-hidden -mt-[72px] pt-[72px]">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full">
            <SlideWrapper handle={slide.handle}>
              <SlideContent slide={slide} isFirst={index === 0} />
            </SlideWrapper>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10 backdrop-blur-sm border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10 backdrop-blur-sm border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-white w-10" 
                    : "bg-white/40 w-3 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Static hero component - shown when no slides or as fallback
const StaticHero = () => {
  return (
    <div className="relative w-full overflow-hidden -mt-[72px] pt-[72px]">
      <div 
        className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Hero content */}
        <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-20">
          <div className="flex flex-col items-start text-left max-w-[600px]">
            <span className="text-white text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mb-4">
              AGLOPOULOS RACING
            </span>
            
            <h1 className="text-white text-[32px] md:text-[48px] lg:text-[60px] font-bold uppercase leading-[1.05] mb-4 md:mb-6 tracking-tight">
              <span className="font-light">ENGINEERED FOR</span>
              <br />
              <span className="font-bold">THE PODIUM</span>
            </h1>
            
            <p className="text-white/80 text-[14px] md:text-[16px] max-w-lg mb-6 md:mb-8 leading-relaxed">
              {"Whether you're shaving seconds off your lap time or building a custom powerhouse from the ground up, we supply the authentic, track-tested parts you need to dominate every corner."}
            </p>
            
            <Link 
              href="/store"
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[13px] md:text-[14px] font-semibold uppercase tracking-wider transition-all border-l-4 border-red-600"
            >
              LEARN MORE
              <Play size={14} className="text-red-500 fill-red-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SlideWrapperProps {
  handle: string
  children: React.ReactElement
}

const SlideWrapper = ({ handle, children }: SlideWrapperProps) => {
  if (!handle) return children

  return (
    <Link href={handle} className="block cursor-pointer">
      {children}
    </Link>
  )
}

interface SlideContentProps {
  slide: StoreSlide
  isFirst?: boolean
}

const SlideContent = ({ slide, isFirst }: SlideContentProps) => {
  // For the first slide, ALWAYS use the static hero background and content
  // This ensures the homepage hero always looks correct regardless of backend data
  if (isFirst) {
    return (
      <div 
        className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Static hero content - ignores backend slide data */}
        <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-20">
          <div className="flex flex-col items-start text-left max-w-[600px]">
            <span className="text-white text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mb-4">
              AGLOPOULOS RACING
            </span>
            
            <h1 className="text-white text-[32px] md:text-[48px] lg:text-[60px] font-bold uppercase leading-[1.05] mb-4 md:mb-6 tracking-tight">
              <span className="font-light">ENGINEERED FOR</span>
              <br />
              <span className="font-bold">THE PODIUM</span>
            </h1>
            
            <p className="text-white/80 text-[14px] md:text-[16px] max-w-lg mb-6 md:mb-8 leading-relaxed">
              {"Whether you're shaving seconds off your lap time or building a custom powerhouse from the ground up, we supply the authentic, track-tested parts you need to dominate every corner."}
            </p>
            
            <Link 
              href="/store"
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[13px] md:text-[14px] font-semibold uppercase tracking-wider transition-all border-l-4 border-red-600"
            >
              LEARN MORE
              <Play size={14} className="text-red-500 fill-red-500" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // For other slides, use backend data with fallback background
  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-cover bg-center bg-no-repeat bg-[#1a1a1a]"
      style={{ backgroundImage: slide.image_url ? `url(${slide.image_url})` : `url(${HERO_BG_IMAGE})` }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-20">
        <div className="flex flex-col items-start text-left max-w-[600px]">
          {slide.subtitle && (
            <span className="text-white text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mb-4">
              {slide.subtitle}
            </span>
          )}

          {slide.title && (
            <h2 className="text-white text-[32px] md:text-[48px] lg:text-[60px] font-bold uppercase leading-[1.05] mb-4 md:mb-6 tracking-tight">
              {slide.title}
            </h2>
          )}

          {slide.description && (
            <p className="text-white/80 text-[14px] md:text-[16px] max-w-lg mb-6 md:mb-8 leading-relaxed">
              {slide.description}
            </p>
          )}

          {slide.cta_text && (
            <CTAButton
              text={slide.cta_text}
              url={slide.cta_url}
              isWrapped={Boolean(slide.handle)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface CTAButtonProps {
  text: string
  url: string | null
  isWrapped?: boolean
}

const CTAButton = ({ text, url, isWrapped }: CTAButtonProps) => {
  const buttonContent = (
    <button className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[13px] md:text-[14px] font-semibold uppercase tracking-wider transition-all border-l-4 border-red-600">
      {text}
      <Play size={14} className="text-red-500 fill-red-500" />
    </button>
  )

  if (isWrapped) return buttonContent

  if (url) {
    return (
      <Link href={url} className="pointer-events-auto">
        {buttonContent}
      </Link>
    )
  }

  return <div className="pointer-events-auto">{buttonContent}</div>
}

export default SliderCarousel
