import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden -mt-[72px] pt-[72px]">
      {/* Background Image - Dark racing car/wheel */}
      <div className="absolute inset-0">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Site%20video%20Header-5%20-%20frame%20at%200m0s-JVxOofxepyZmstA5FBaQSQ1jOnRjYb.jpg"
          alt="Racing car drifting with smoke"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay - Left aligned */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1350px] w-full mx-auto px-6">
          <div className="flex flex-col items-start text-left max-w-[600px]">
            {/* Main Heading - White uppercase racing typography */}
            <h1 className="text-white text-[32px] md:text-[48px] lg:text-[56px] font-bold uppercase leading-tight mb-4 tracking-tight">
              Φροντίδα & στυλ
              <br />
              για κάθε διαδρομή
            </h1>

            {/* Subheading */}
            <p className="text-white/80 text-[14px] md:text-[16px] lg:text-[18px] font-normal leading-relaxed mb-8 max-w-[480px]">
              Προϊόντα που αναδεικνύουν την άνεση και την
              προσωπικότητα του αυτοκινήτου σας
            </p>

            {/* CTA Button - Black/dark with small red accent */}
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-8 py-3.5 text-[14px] md:text-[15px] font-semibold uppercase tracking-wide transition-colors duration-200 border-l-4 border-[#ff0d00]"
            >
              Όλα τα προϊόντα
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
