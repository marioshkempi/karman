"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { StoreSlide } from "@lib/data/slider"
import Link from "next/link"

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

  if (!slides.length) return null

  return (
    <div className="relative w-full overflow-hidden -mt-[72px] pt-[72px]">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full">
            <SlideWrapper handle={slide.handle}>
              <SlideContent slide={slide} />
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

const DESKTOP_ALIGNMENT: Record<string, string> = {
  left: "md:text-left md:items-start md:mr-auto md:ml-0",
  center: "md:text-center md:items-center md:mx-auto",
  right: "md:text-right md:items-end md:ml-auto md:mr-0",
}

interface SlideContentProps {
  slide: StoreSlide
}

const SlideContent = ({ slide }: SlideContentProps) => {
  const hasOverlay =
    slide.title || slide.subtitle || slide.description || slide.cta_text
  const desktopAlignment =
    DESKTOP_ALIGNMENT[slide.text_alignment] || DESKTOP_ALIGNMENT.left

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
      {slide.mobile_image_url ? (
        <>
          <Image
            src={slide.image_url}
            alt={slide.title || "Slide"}
            fill
            sizes="100vw"
            className="object-cover hidden md:block"
            priority
          />
          <Image
            src={slide.mobile_image_url}
            alt={slide.title || "Slide"}
            fill
            sizes="100vw"
            className="object-cover md:hidden"
            priority
          />
        </>
      ) : (
        <Image
          src={slide.image_url}
          alt={slide.title || "Slide"}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {hasOverlay && (
        <div className="absolute inset-0 flex items-center px-6 md:px-16 lg:px-20 pointer-events-none">
          <div
            className={`flex flex-col items-start text-left max-w-[600px] ${desktopAlignment}`}
          >
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
                style={slide.cta_style}
                isWrapped={Boolean(slide.handle)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface CTAButtonProps {
  text: string
  url: string | null
  style: "primary" | "secondary" | "tertiary" | "quaternary"
  isWrapped?: boolean
}

const CTAButton = ({
  text,
  url,
  style,
  isWrapped,
}: CTAButtonProps) => {
  const buttonContent = (
    <button className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[13px] md:text-[14px] font-semibold uppercase tracking-wider transition-all pointer-events-auto border-l-4 border-red-600">
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
