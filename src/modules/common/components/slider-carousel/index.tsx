"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
    <div className="relative w-full overflow-hidden mb-10 md:mb-20">
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
            className="absolute left-[-5] md:left-4 top-1/2 -translate-y-1/2 text-black hover:text-white p-1 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft
              className="w-8 h-8 md:w-10 md:h-10"
              strokeWidth={1.5}
            />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-black hover:text-white p-1 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight
              className="w-8 h-8 md:w-10 md:h-10"
              strokeWidth={1.5}
            />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2"
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
  const textColor = slide.text_color || "#FFFFFF"
  const hasOverlay =
    slide.title || slide.subtitle || slide.description || slide.cta_text
  const desktopAlignment =
    DESKTOP_ALIGNMENT[slide.text_alignment] || DESKTOP_ALIGNMENT.right

  return (
    <div className="relative w-full h-[300px] md:h-[640px] md:max-h-[650px]">
      {slide.mobile_image_url ? (
        <>
          <Image
            src={slide.image_url}
            alt={slide.title || "Slide"}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover hidden md:block"
            priority
          />
          <Image
            src={slide.mobile_image_url}
            alt={slide.title || "Slide"}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover md:hidden"
            priority
          />
        </>
      ) : (
        <Image
          src={slide.image_url}
          alt={slide.title || "Slide"}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
          priority
        />
      )}

      {hasOverlay && (
        <div className="absolute inset-0 flex items-center px-6 md:px-16 pointer-events-none">
          <div
            className={`flex flex-col items-start text-left md:ml-auto md:items-end md:text-right ${desktopAlignment}`}
          >
            {slide.title && (
              <h2
                className="text-2xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4"
                style={{ color: textColor }}
              >
                {slide.title}
              </h2>
            )}

            {slide.subtitle && (
              <p
                className="text-sm md:text-base font-medium mb-2 opacity-90"
                style={{ color: textColor }}
              >
                {slide.subtitle}
              </p>
            )}

            {slide.description && (
              <p
                className="text-sm md:text-lg max-w-2xl mb-4 md:mb-6 opacity-90"
                style={{ color: textColor }}
              >
                {slide.description}
              </p>
            )}

            {slide.cta_text && (
              <CTAButton
                text={slide.cta_text}
                url={slide.cta_url}
                style={slide.cta_style}
                textColor={textColor}
                isWrapped={Boolean(slide.handle)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const CTA_STYLES: Record<string, string> = {
  primary: "bg-primary text-white border-primary",
  secondary: "bg-secondary text-white border-secondary",
  tertiary: "bg-tertiary text-[#513D31] border-tertiary",
  quaternary: "bg-quaternary text-[#513D31] border-quaternary",
}

interface CTAButtonProps {
  text: string
  url: string | null
  style: "primary" | "secondary" | "tertiary" | "quaternary"
  textColor: string
  isWrapped?: boolean
}

const CTAButton = ({
  text,
  url,
  style,
  textColor,
  isWrapped,
}: CTAButtonProps) => {
  const buttonClasses = CTA_STYLES[style] || "bg-black text-white border-black"

  const buttonContent = (
    <button
      className={`px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-semibold transition-opacity hover:opacity-80 pointer-events-auto ${buttonClasses}`}
      style={
        style === "secondary"
          ? { color: textColor, borderColor: textColor }
          : undefined
      }
    >
      {text}
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
