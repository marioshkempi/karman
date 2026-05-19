"use client"

import { Play } from "lucide-react"
import { StoreSlide } from "@lib/data/slider"
import Link from "next/link"

// Static hero background - always visible
const HERO_BG_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-racing-car-D3V1omw0T3wKqF5Yi4r8llJVl7VO6Z.jpg"

interface SliderCarouselProps {
  slides: StoreSlide[]
}

// This component now renders ONLY a single static hero.
// No carousel, no dots, no arrows, no autoplay, no multiple slides.
// The slides prop is kept for API compatibility but is ignored.
const SliderCarousel = ({ slides }: SliderCarouselProps) => {
  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Static hero content */}
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

export default SliderCarousel
