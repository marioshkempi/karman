import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const MOMO_LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Momo-logo-tr9SbRKJB5Elj3eAFAe8kudcYWG5gd.png"
const WHEEL_1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wheel-1-pnkW6CVmqPBhwAPBLLMCXMywEhePsp.png"
const WHEEL_2 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wheel-2-1wQGLyXTXcQ0H16BLkTaD13OCG0miG.png"
const WHEEL_3 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NoPath%20-%20Copy%20%286%29-UjtsQZzU2X0GxGOoDmbJ5DGDDj9Jfy.png"
const WHEEL_4 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NoPath%20-%20Copy%20%285%29-RWOu2HUFm5XbSPWSfjTmet9zYb4wEq.png"
const ROAD_WHEELS_BG = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Road-wheels-background-s79ykRLzKirQ1j2jcuA5OH9BPNCOF9.jpg"

// Static wheel product data for visual mockup
const WHEEL_PRODUCTS = [
  { id: 1, name: "HEAVY DUTY SUV", price: "€1.659,89", image: WHEEL_1 },
  { id: 2, name: "REVENGE 2.0 EVO", price: "€1.269,89", image: WHEEL_2 },
  { id: 3, name: "REVENGE 2.0", price: "€14.659,00", image: WHEEL_3 },
  { id: 4, name: "COMPETIZIONE", price: "€4.865,00", image: WHEEL_4 },
]

export default function MomoPromo() {
  return (
    <>
      {/* MOMO Promo Section */}
      <section className="w-full bg-white pt-8 lg:pt-12">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          
          {/* Top area: Tagline and MOMO Logo - right aligned */}
          <div className="flex justify-end mb-4 lg:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex flex-col text-right leading-tight">
                <span className="text-gray-600 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                  DESIGNED FOR
                </span>
                <span className="text-gray-900 text-sm md:text-base lg:text-lg font-bold tracking-wide uppercase">
                  SAFETY<span className="text-gray-600 font-normal">, BUILT</span>
                </span>
                <span className="text-gray-600 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                  FOR <span className="text-gray-900 font-bold">SPEED</span>
                </span>
              </div>
              <img 
                src={MOMO_LOGO} 
                alt="MOMO" 
                className="h-14 md:h-16 lg:h-20 w-auto flex-shrink-0"
              />
            </div>
          </div>

          {/* Main composition area */}
          <div className="relative">
            
            {/* Red configurator card - full width band */}
            <div className="bg-[#b91c1c] rounded-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-6 md:px-10 lg:px-12 py-6 md:py-8 lg:py-10">
                
                {/* Left side: Text content with padding for wheel overlap */}
                <div className="lg:w-1/2 lg:pl-4 xl:pl-8">
                  <h2 className="text-white text-xl md:text-2xl lg:text-3xl tracking-wide mb-2">
                    <span className="font-black">MOMO</span>{" "}
                    <span className="font-light">WHEEL CONFIGURATOR</span>
                  </h2>
                  <p className="text-white/80 text-sm md:text-base max-w-md">
                    Find aluminium rims for your vehicle quickly and easily.
                  </p>
                </div>
                
                {/* Right side: Button */}
                <div className="mt-6 lg:mt-0 lg:w-1/2 flex justify-start lg:justify-end">
                  <LocalizedClientLink 
                    href="/categories/wheels"
                    className="inline-flex items-center justify-center px-8 md:px-10 py-3 bg-transparent border-2 border-white text-white text-xs md:text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-[#b91c1c] transition-colors duration-300"
                  >
                    START NOW
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
            
            {/* Wheels composition - centered, overlapping the red card from above */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[15%] z-10 pointer-events-none">
              <div className="flex items-end justify-center">
                {/* Left wheel (silver) */}
                <img 
                  src={WHEEL_3} 
                  alt="MOMO Wheel" 
                  className="w-32 md:w-44 lg:w-56 xl:w-64 h-auto relative z-0 -mr-4 md:-mr-8 lg:-mr-12"
                />
                {/* Center wheel (black) - largest */}
                <img 
                  src={WHEEL_1} 
                  alt="MOMO Wheel" 
                  className="w-44 md:w-60 lg:w-72 xl:w-80 h-auto relative z-20"
                />
                {/* Right wheel (machined) */}
                <img 
                  src={WHEEL_2} 
                  alt="MOMO Wheel" 
                  className="w-32 md:w-44 lg:w-56 xl:w-64 h-auto relative z-10 -ml-4 md:-ml-8 lg:-ml-12"
                />
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Spacer for wheel overflow */}
        <div className="h-16 md:h-24 lg:h-32"></div>
      </section>

      {/* Road Wheels Section - Static Visual Mockup */}
      <section className="relative w-full overflow-hidden">
        {/* Faded background image with strong white overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ROAD_WHEELS_BG})` }}
        />
        <div className="absolute inset-0 bg-white/90" />
        
        {/* Content */}
        <div className="relative z-10 max-w-[1350px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Road Wheels
              </h2>
              <LocalizedClientLink 
                href="/categories/wheels"
                className="text-sm text-gray-500 hover:text-gray-700 uppercase tracking-wide"
              >
                VIEW ALL
              </LocalizedClientLink>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Product grid - 4 static wheel cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {WHEEL_PRODUCTS.map((product) => (
              <LocalizedClientLink 
                key={product.id}
                href="/categories/wheels"
                className="group flex flex-col items-center text-center"
              >
                {/* Wheel image */}
                <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Product name */}
                <h3 className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-wide mb-1">
                  {product.name}
                </h3>
                
                {/* Price */}
                <p className="text-sm md:text-base text-gray-700">
                  {product.price}
                </p>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
