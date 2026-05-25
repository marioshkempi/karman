import Image from "next/image"
import { PromoBanner } from "@modules/home/components/promo-banner"

// Brand logos data
const BRANDS = [
  { name: "ISUZU", logo: "/images/brands/isuzu.png" },
  { name: "PORSCHE", logo: "/images/brands/porsche.png" },
  { name: "DACIA", logo: "/images/brands/dacia.png" },
  { name: "PEUGEOT", logo: "/images/brands/peugeot.png" },
  { name: "HONDA", logo: "/images/brands/honda.png" },
  { name: "TESLA", logo: "/images/brands/tesla.png" },
]

// Banner data - hardcoded/static
const BANNERS = {
  lighting: {
    subtitle: "ΥΨΗΛΗ ΑΠΟΔΟΣΗ",
    title: "Φωτισμός",
    description: "Φωτίστε τη διαδρομή σας: Εξειδικευμένες λύσεις φωτισμού για ασφάλεια και στυλ που ξεχωρίζει στον δρόμο.",
    ctaText: "Αγόρασε τώρα",
    ctaHref: "/store?category=lighting",
    image: "/images/banners/lighting-banner.png",
  },
  wipers: {
    subtitle: "ΑΕΡΟΔΥΝΑΜΙΚΟΣ ΣΧΕΔΙΑΣΜΟΣ",
    title: "Υαλοκαθαριστήρες",
    description: "Επιλέξτε κορυφαίους υαλοκαθαριστήρες για αθόρυβη λειτουργία και μέγιστη απόδοση ακόμη και στις πιο έντονες βροχοπτώσεις.",
    ctaText: "Αγόρασε τώρα",
    ctaHref: "/store?category=wipers",
    image: "/images/banners/wipers-banner.png",
  },
  karmanStore: {
    title: "KARMAN STORE",
    description: "Στο Karman Store αναβαθμίζουμε κάθε σας διαδρομή, προσφέροντας κορυφαία αξεσουάρ και προϊόντα φροντίδας που συνδυάζουν το προσωπικό στυλ με την απόλυτη άνεση και προστασία του αυτοκινήτου σας.",
    ctaText: "Μάθετε περισσότερα",
    ctaHref: "/about",
    image: "/images/banners/karman-store-banner.png",
  },
}

// Small image cards - static images only
const SMALL_CARDS = [
  { image: "/images/banners/store-shelf-1.png", alt: "Automotive products" },
  { image: "/images/banners/store-shelf-2.png", alt: "Car parts store" },
  { image: "/images/banners/store-shelf-3.png", alt: "Automotive chemicals" },
  { image: "/images/banners/store-shelf-1.png", alt: "Store products" },
]

export const HomepagePromoBanners = () => {
  return (
    <section className="w-full bg-[#F1F5F9] py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Brands Row - placeholder text for now */}
        <div className="hidden md:flex items-center justify-between mb-8 px-4">
          {BRANDS.map((brand) => (
            <span key={brand.name} className="font-extrabold text-sm text-gray-400 tracking-wider">
              {brand.name}
            </span>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Top Row - 2 banners side by side */}
          <div className="flex gap-6 mb-6">
            {/* Lighting Banner */}
            <PromoBanner
              {...BANNERS.lighting}
              containerClassName="w-[624px] h-[270px]"
              buttonClassName="bg-white text-gray-900 hover:bg-gray-100"
              overlayClassName="bg-black/50"
            />
            
            {/* Wipers Banner */}
            <PromoBanner
              {...BANNERS.wipers}
              containerClassName="w-[624px] h-[270px]"
              buttonClassName="bg-white text-gray-900 hover:bg-gray-100"
              overlayClassName="bg-gradient-to-r from-black/60 to-transparent"
            />
          </div>

          {/* Bottom Layout */}
          <div className="flex gap-6">
            {/* Left Large Banner - KARMAN STORE */}
            <PromoBanner
              {...BANNERS.karmanStore}
              containerClassName="w-[624px] h-[588px]"
              buttonClassName="bg-[#007BFF] text-white hover:bg-[#0069d9]"
              overlayClassName="bg-black/40"
            />

            {/* Right Side - 2x2 Grid of Small Cards */}
            <div className="grid grid-cols-2 gap-6">
              {SMALL_CARDS.map((card, index) => (
                <div
                  key={index}
                  className="relative w-[296px] h-[277px] rounded-lg overflow-hidden"
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover"
                    sizes="296px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Lighting Banner */}
          <PromoBanner
            {...BANNERS.lighting}
            containerClassName="w-full h-[250px]"
            buttonClassName="bg-white text-gray-900 hover:bg-gray-100"
            overlayClassName="bg-black/50"
          />
          
          {/* Wipers Banner */}
          <PromoBanner
            {...BANNERS.wipers}
            containerClassName="w-full h-[250px]"
            buttonClassName="bg-white text-gray-900 hover:bg-gray-100"
            overlayClassName="bg-gradient-to-r from-black/60 to-transparent"
          />
          
          {/* KARMAN STORE Banner */}
          <PromoBanner
            {...BANNERS.karmanStore}
            containerClassName="w-full h-[306px]"
            buttonClassName="bg-[#007BFF] text-white hover:bg-[#0069d9]"
            overlayClassName="bg-black/40"
          />

          {/* Small Cards - 2 column grid */}
          <div className="grid grid-cols-2 gap-2">
            {SMALL_CARDS.map((card, index) => (
              <div
                key={index}
                className="relative w-full aspect-square max-h-[175px] rounded-lg overflow-hidden"
              >
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 186px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomepagePromoBanners
