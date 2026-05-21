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

  // If no slides, show static KARMAN hero
  if (!slides.length) {
    return (
      <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero/car-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 italic leading-tight">
              Φροντίδα & στυλ για κάθε<br />σας διαδρομή
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Προϊόντα που αναδεικνύουν την άνεση και την<br />προσωπικότητα του αυτοκινήτου σας
            </p>
            <Link 
              href="/store"
              className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Όλα τα προϊόντα
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

  // Use local fallback image if slide.image_url fails or is empty
  const heroImageUrl = slide.image_url || "/images/hero/car-hero.jpg"
  const mobileImageUrl = slide.mobile_image_url || heroImageUrl

  return (
    <div 
      className="relative w-full h-[400px] md:h-[600px]"
      style={{ 
        backgroundImage: `url('/images/hero/car-hero.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {slide.mobile_image_url ? (
        <>
          <Image
            src={heroImageUrl}
            alt={slide.title || "Slide"}
            fill
            className="object-cover hidden md:block"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <Image
            src={mobileImageUrl}
            alt={slide.title || "Slide"}
            fill
            className="object-cover md:hidden"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </>
      ) : (
        <Image
          src={heroImageUrl}
          alt={slide.title || "Slide"}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      )}

      {/* Hero content overlay - KARMAN style */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 italic leading-tight">
            Φροντίδα & στυλ για κάθε<br />σας διαδρομή
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Προϊόντα που αναδεικνύουν την άνεση και την<br />προσωπικότητα του αυτοκινήτου σας
          </p>
          <Link 
            href="/store"
            className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Όλα τα προϊόντα
          </Link>
        </div>
      </div>
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
