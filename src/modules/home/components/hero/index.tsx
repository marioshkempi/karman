import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Play } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden -mt-[72px] pt-[72px]">
      {/* Background Image - Racing car with smoke */}
      <div className="absolute inset-0">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-racing-car-D3V1omw0T3wKqF5Yi4r8llJVl7VO6Z.jpg"
          alt="Racing car drifting"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay - Left aligned */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1350px] w-full mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-start text-left max-w-[600px]">
            {/* Brand Name */}
            <span className="text-white text-[14px] md:text-[16px] font-bold uppercase tracking-[0.3em] mb-4">
              AGLOPOULOS RACING
            </span>
            
            {/* Main Heading - White uppercase racing typography */}
            <h1 className="text-white text-[36px] md:text-[52px] lg:text-[64px] uppercase leading-[1.05] mb-6 tracking-tight">
              <span className="font-light">ENGINEERED FOR</span>
              <br />
              <span className="font-bold">THE PODIUM</span>
            </h1>

            {/* Subheading */}
            <p className="text-white/80 text-[14px] md:text-[16px] lg:text-[17px] font-normal leading-relaxed mb-8 max-w-[480px]">
              {"Whether you're shaving seconds off your lap time or building a custom powerhouse from the ground up, we supply the authentic, track-tested parts you need to dominate every corner."}
            </p>

            {/* CTA Button - Dark with red left border accent */}
            <LocalizedClientLink
              href="/store"
              className="group inline-flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white pl-6 pr-5 py-4 text-[13px] md:text-[14px] font-semibold uppercase tracking-wider transition-all duration-300 border-l-4 border-red-600"
            >
              LEARN MORE
              <Play size={14} className="text-red-500 fill-red-500 group-hover:translate-x-0.5 transition-transform" />
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
