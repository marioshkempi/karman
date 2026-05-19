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
      {/* MOMO Promo Section - Matching LEFT reference */}
      <section className="w-full bg-white overflow-hidden">
        <div className="relative max-w-[1400px] mx-auto">
          
          {/* Top-right: Tagline and MOMO Logo - positioned absolutely */}
          <div className="absolute top-6 right-6 lg:top-10 lg:right-10 z-20 flex items-start gap-3 md:gap-4">
            <div className="flex flex-col text-right leading-tight">
              <span className="text-gray-800 text-xs md:text-sm font-light tracking-widest uppercase">
                DESIGNED FOR
              </span>
              <span className="text-gray-900 text-base md:text-lg lg:text-xl font-bold tracking-wide uppercase">
                SAFETY<span className="font-light">, BUILT</span>
              </span>
              <span className="text-gray-800 text-xs md:text-sm font-light tracking-widest uppercase">
                FOR <span className="font-bold">SPEED</span>
              </span>
            </div>
            <img 
              src={MOMO_LOGO} 
              alt="MOMO" 
              className="h-12 md:h-16 lg:h-20 w-auto flex-shrink-0"
            />
          </div>

          {/* Main layout container */}
          <div className="relative min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex items-end">
            
            {/* Large wheel composition - left side, overlapping the red card */}
            <div className="absolute left-0 bottom-0 z-10 flex items-end pl-4 lg:pl-8">
              <div className="relative flex items-end">
                {/* Left wheel (silver) - smaller, behind */}
                <img 
                  src={WHEEL_3} 
                  alt="MOMO Wheel" 
                  className="w-40 md:w-52 lg:w-64 xl:w-72 h-auto relative z-0 -mr-6 md:-mr-10 lg:-mr-14"
                />
                {/* Center wheel (black) - largest, front */}
                <img 
                  src={WHEEL_1} 
                  alt="MOMO Wheel" 
                  className="w-52 md:w-72 lg:w-80 xl:w-96 h-auto relative z-20"
                />
                {/* Right wheel (silver/black) - medium, behind */}
                <img 
                  src={WHEEL_2} 
                  alt="MOMO Wheel" 
                  className="w-40 md:w-52 lg:w-64 xl:w-72 h-auto relative z-10 -ml-6 md:-ml-10 lg:-ml-14"
                />
              </div>
            </div>
            
            {/* Red configurator card - horizontal band at bottom-right, behind wheels */}
            <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 right-0 left-0 md:left-auto md:w-[70%] lg:w-[60%] z-0">
              <div className="bg-[#b91c1c] py-6 md:py-8 lg:py-10 px-6 md:px-8 lg:px-12 md:rounded-l-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-8 text-right md:text-left md:pl-32 lg:pl-48">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <h2 className="text-white text-lg md:text-xl lg:text-2xl tracking-wide">
                      <span className="font-black">MOMO</span>{" "}
                      <span className="font-light">WHEEL CONFIGURATOR</span>
                    </h2>
                    <p className="text-white/80 text-xs md:text-sm max-w-sm">
                      Find aluminium rims for your vehicle quickly and easily.
                    </p>
                  </div>
                  
                  <LocalizedClientLink 
                    href="/categories/wheels"
                    className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 bg-transparent border-2 border-white text-white text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-[#b91c1c] transition-colors duration-300 whitespace-nowrap self-end md:self-center"
                  >
                    START NOW
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
            
          </div>
        </div>
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
