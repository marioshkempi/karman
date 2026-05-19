import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Uploaded assets
const MICHELIN_BANNER = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Classic-tires-banner-i754tFkviwBBYtJWf6XssJ4PpqW1x6.png"
const CLASSIC_TIRES_BG = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Classic-tires-background-HQ2IXeGk3JGohfUVYnpZS2lpkRmcgi.jpg"

// Static fallback tire products (visual preview only)
const STATIC_TIRES = [
  {
    id: "tire-1",
    name: "PILOT SPORT PS2",
    price: "€659.89",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tire-1-TMLV7lRWBE6XAe8KauwkjUbEW5S7Ko.png"
  },
  {
    id: "tire-2",
    name: "MXV3-A",
    price: "€999.89",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tire-2-Vj7UNZg1O1NGnLDozYAWdXQyPyPFnJ.png"
  },
  {
    id: "tire-3",
    name: "PILOT SX MXX3",
    price: "€12.999.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tire-3-Re0BAYdvrTWPI2irNFC28M294IaSTW.png"
  },
  {
    id: "tire-4",
    name: "PRIMACY 3 VINTAGE",
    price: "€1.119.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tire-4-S9UzpTmPHqVmHNaxfVLjzGswM1xpHl.png"
  }
]

export default function MichelinPromo() {
  return (
    <section className="w-full bg-white">
      {/* MICHELIN Promo Banner */}
      <div className="py-12 lg:py-16">
        <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
          {/* Blue Banner Card */}
          <div className="relative w-full bg-[#0d2d5a] rounded-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side: Text Content */}
              <div className="w-full lg:w-[45%] flex items-center p-8 lg:p-12 xl:p-16">
                <div className="max-w-md">
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-wide mb-4">
                    MICHELIN
                  </h2>
                  <p className="text-sm lg:text-base text-white/80 mb-6 leading-relaxed">
                    Tour our collection and use our wheel configurator to find the perfect Michelin tire for your vehicle.
                  </p>
                  <LocalizedClientLink
                    href="/categories/tires"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors rounded"
                  >
                    LEARN MORE
                  </LocalizedClientLink>
                </div>
              </div>
              
              {/* Right Side: Tires + Mascot Image */}
              <div className="w-full lg:w-[55%] flex items-end justify-end">
                <img 
                  src={MICHELIN_BANNER} 
                  alt="Michelin Tires with Bibendum Mascot" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classic Tires Product Section */}
      <div className="relative w-full py-12 lg:py-16 overflow-hidden">
        {/* Faded background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${CLASSIC_TIRES_BG})` }}
        />
        {/* Strong white overlay */}
        <div className="absolute inset-0 bg-white/90" />

        <div className="relative z-10 max-w-[1350px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl lg:text-2xl text-gray-900 font-bold tracking-tight">
                Classic Tires
              </h2>
              <LocalizedClientLink 
                href="/categories/tires"
                className="text-xs lg:text-sm text-gray-500 hover:text-gray-700 uppercase tracking-wider mt-1 inline-block"
              >
                VIEW ALL
              </LocalizedClientLink>
            </div>
            
            {/* Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {STATIC_TIRES.map((tire) => (
              <LocalizedClientLink 
                key={tire.id}
                href="/categories/tires"
                className="group block"
              >
                <div className="bg-white rounded-lg p-4 lg:p-6 transition-shadow hover:shadow-lg border border-gray-100">
                  {/* Product Image */}
                  <div className="aspect-square mb-4 flex items-center justify-center">
                    <img 
                      src={tire.image} 
                      alt={tire.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="text-sm lg:text-base font-bold text-gray-900 uppercase tracking-wide mb-1">
                      {tire.name}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-700">
                      {tire.price}
                    </p>
                  </div>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
