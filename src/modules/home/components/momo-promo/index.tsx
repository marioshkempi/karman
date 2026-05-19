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
      <section className="w-full bg-white overflow-hidden">
        <div className="max-w-[1350px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
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

            {/* Main content: Wheels + Red Configurator Card */}
            <div className="relative flex flex-col lg:flex-row lg:items-end">
              
              {/* Left: Wheels composition */}
              <div className="relative z-10 flex items-end justify-center lg:justify-start lg:w-1/2 lg:-mr-20">
                <div className="relative flex items-end">
                  <img 
                    src={WHEEL_3} 
                    alt="MOMO Wheel" 
                    className="w-32 md:w-44 lg:w-56 h-auto -mr-8 md:-mr-12 lg:-mr-16 relative z-0"
                  />
                  <img 
                    src={WHEEL_1} 
                    alt="MOMO Wheel" 
                    className="w-44 md:w-56 lg:w-72 h-auto relative z-20"
                  />
                  <img 
                    src={WHEEL_2} 
                    alt="MOMO Wheel" 
                    className="w-32 md:w-44 lg:w-56 h-auto -ml-8 md:-ml-12 lg:-ml-16 relative z-10"
                  />
                </div>
              </div>
              
              {/* Right: Red Configurator Card - with proper padding for text visibility */}
              <div className="relative lg:w-2/3 lg:-ml-20 mt-[-40px] lg:mt-0">
                <div className="bg-[#b91c1c] rounded-xl lg:rounded-2xl p-6 md:p-8 lg:py-10 lg:pl-36 lg:pr-10">
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
