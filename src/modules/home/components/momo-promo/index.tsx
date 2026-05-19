import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MOMO_LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Momo-logo-tr9SbRKJB5Elj3eAFAe8kudcYWG5gd.png"
const ROAD_WHEELS_BANNER = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Road-wheels-banner-L92U82UFDdromI3OXBmdVnolBrUxlG.png"

export default function MomoPromo() {
  return (
    <section className="w-full bg-white">
      {/* Top section with tagline and logo */}
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8 pt-12 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Tagline */}
          <div className="flex flex-col">
            <span className="text-gray-900 text-lg md:text-xl font-light tracking-wide">
              DESIGNED FOR
            </span>
            <span className="text-gray-900 text-2xl md:text-3xl font-bold tracking-wide">
              SAFETY<span className="font-light">, BUILT</span>
            </span>
            <span className="text-gray-900 text-lg md:text-xl font-light tracking-wide">
              FOR <span className="font-bold">SPEED</span>
            </span>
          </div>
          
          {/* Right: MOMO Logo */}
          <div className="flex-shrink-0">
            <img 
              src={MOMO_LOGO} 
              alt="MOMO" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Road Wheels Banner Image */}
      <div className="w-full">
        <img 
          src={ROAD_WHEELS_BANNER} 
          alt="MOMO Road Wheels" 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Wheel Configurator Card - Red Background */}
      <div className="w-full bg-[#c41e3a]">
        <div className="max-w-[1350px] mx-auto px-4 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Text content */}
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                <span className="font-black">MOMO</span>{" "}
                <span className="font-light">WHEEL CONFIGURATOR</span>
              </h2>
              <p className="text-white/90 text-sm md:text-base max-w-md">
                Find aluminium rims for your vehicle quickly and easily.
              </p>
            </div>
            
            {/* Right: CTA Button */}
            <LocalizedClientLink 
              href="/categories/wheels"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-[#c41e3a] transition-colors duration-300"
            >
              START NOW
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
