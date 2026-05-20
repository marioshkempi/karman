import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Sparco assets
const SPARCO_BG_1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sparco-background-bAU4mGqlgP3mpfq3he2t8m5tSiAtA1.jpg"
const SPARCO_BG_2 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sparco-background-2-rC3GAGNAvCMwT0yvW5qYAJFGJHMeh2.jpg"
const CUSTOM_EASY_BG = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Custom-easy-iIQHrup3Soa0mNh67r9WUzDkEH063h.jpg"
const BODY_ICON = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%207082-CvbUmPCmRMB5dNIJ7KvNoeiwiAf6hr.png"

export default function SparcoPromo() {
  return (
    <section className="bg-white">
      {/* SPARCO Brand Banner - Full width background with helmets */}
      <div 
        className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${SPARCO_BG_2})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* SPARCO Motorsport Section */}
      <div 
        className="relative w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${SPARCO_BG_1})` }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="flex justify-end">
            {/* Motorsport Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md">
              {/* Sparco logo placeholder */}
              <div className="mb-4">
                <span className="text-[#1a3a6e] font-bold text-xl tracking-wider">sparco</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                SPARCO MOTORSPORT
              </h3>
              
              <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                Gear up for victory with Sparco, Motorsport excellence since 1977. From racing suits to pro helmets, find everything you need to own the track!
              </p>
              
              <LocalizedClientLink
                href="/categories/sparco"
                className="inline-block border-2 border-gray-900 text-gray-900 font-semibold px-6 py-2.5 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
              >
                LEARN MORE
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Easy Suit Configurator Section */}
      <div 
        className="relative w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CUSTOM_EASY_BG})` }}
      >
        {/* Gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="flex items-center gap-8 max-w-lg">
            {/* Body icon */}
            <div className="hidden md:block flex-shrink-0">
              <img 
                src={BODY_ICON} 
                alt="" 
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain opacity-80"
              />
            </div>
            
            {/* Text content */}
            <div>
              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                CUSTOM EASY
              </h3>
              <p className="text-[#4a90d9] text-lg md:text-xl font-semibold mb-4 uppercase tracking-wide">
                SUIT CONFIGURATOR
              </p>
              
              <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed max-w-sm">
                Choose colors, configure the setup, add your name and create your custom motorsport suit with the Sparco 3D configurator.
              </p>
              
              <LocalizedClientLink
                href="/configurator"
                className="inline-block bg-[#1a3a6e] text-white font-semibold px-6 py-2.5 text-sm uppercase tracking-wide hover:bg-[#0d2d5a] transition-colors"
              >
                START NOW
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
