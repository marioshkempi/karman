import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MOMO_LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Momo-logo-tr9SbRKJB5Elj3eAFAe8kudcYWG5gd.png"
const WHEEL_1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wheel-1-pnkW6CVmqPBhwAPBLLMCXMywEhePsp.png"
const WHEEL_2 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wheel-2-1wQGLyXTXcQ0H16BLkTaD13OCG0miG.png"
const WHEEL_3 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NoPath%20-%20Copy%20%286%29-UjtsQZzU2X0GxGOoDmbJ5DGDDj9Jfy.png"

export default function MomoPromo() {
  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Main container with relative positioning */}
        <div className="relative">
          
          {/* Top-right: Tagline and MOMO Logo */}
          <div className="flex items-start justify-end gap-4 md:gap-6 mb-8 lg:mb-0 lg:absolute lg:top-0 lg:right-0 lg:z-10">
            <div className="flex flex-col text-right">
              <span className="text-gray-900 text-sm md:text-base lg:text-lg font-light tracking-wide">
                DESIGNED FOR
              </span>
              <span className="text-gray-900 text-lg md:text-xl lg:text-2xl font-bold tracking-wide">
                SAFETY<span className="font-light">, BUILT</span>
              </span>
              <span className="text-gray-900 text-sm md:text-base lg:text-lg font-light tracking-wide">
                FOR <span className="font-bold">SPEED</span>
              </span>
            </div>
            <img 
              src={MOMO_LOGO} 
              alt="MOMO" 
              className="h-14 md:h-16 lg:h-20 w-auto flex-shrink-0"
            />
          </div>

          {/* Main content area: Wheels + Red Configurator Card */}
          <div className="relative flex flex-col lg:flex-row lg:items-end">
            
            {/* Left: Wheels composition - overlapping the red card */}
            <div className="relative z-10 flex items-end justify-center lg:justify-start lg:w-1/2 lg:-mr-20">
              <div className="relative flex items-end">
                {/* Back-left wheel (silver) */}
                <img 
                  src={WHEEL_3} 
                  alt="MOMO Wheel" 
                  className="w-32 md:w-44 lg:w-56 h-auto -mr-8 md:-mr-12 lg:-mr-16 relative z-0"
                />
                {/* Center wheel (black matte - largest) */}
                <img 
                  src={WHEEL_1} 
                  alt="MOMO Wheel" 
                  className="w-44 md:w-56 lg:w-72 h-auto relative z-20"
                />
                {/* Right wheel (silver/black) */}
                <img 
                  src={WHEEL_2} 
                  alt="MOMO Wheel" 
                  className="w-32 md:w-44 lg:w-56 h-auto -ml-8 md:-ml-12 lg:-ml-16 relative z-10"
                />
              </div>
            </div>
            
            {/* Right: Red Configurator Card */}
            <div className="relative lg:w-2/3 lg:-ml-20 mt-[-40px] lg:mt-0">
              <div className="bg-[#b91c1c] rounded-xl lg:rounded-2xl p-6 md:p-8 lg:p-10 lg:pl-32">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-white text-xl md:text-2xl lg:text-3xl tracking-wide">
                      <span className="font-black">MOMO</span>{" "}
                      <span className="font-light">WHEEL CONFIGURATOR</span>
                    </h2>
                    <p className="text-white/80 text-sm md:text-base max-w-md">
                      Find aluminium rims for your vehicle quickly and easily.
                    </p>
                  </div>
                  
                  <LocalizedClientLink 
                    href="/categories/wheels"
                    className="inline-flex items-center justify-center px-6 md:px-8 py-3 bg-transparent border-2 border-white text-white text-xs md:text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-[#b91c1c] transition-colors duration-300 whitespace-nowrap"
                  >
                    START NOW
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
