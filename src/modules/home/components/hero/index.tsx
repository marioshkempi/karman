import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero/car-hero.jpg"
          alt="Luxury car on the road"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-[1350px] w-full mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            {/* Main Heading - Italic style */}
            <h1 className="text-white text-[28px] md:text-[40px] lg:text-[52px] font-light italic leading-tight mb-4 text-balance">
              Φροντίδα & στυλ για κάθε
              <br />
              σας διαδρομή
            </h1>

            {/* Subheading */}
            <p className="text-white/80 text-[14px] md:text-[16px] lg:text-[18px] font-light leading-relaxed mb-8 max-w-[600px] text-balance">
              Προϊόντα που αναδεικνύουν την άνεση και την
              <br className="hidden md:block" />
              προσωπικότητα του αυτοκινήτου σας
            </p>

            {/* CTA Button */}
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center bg-white text-secondary px-8 py-3 rounded-full text-[14px] md:text-[15px] font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Όλα τα προϊόντα
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
