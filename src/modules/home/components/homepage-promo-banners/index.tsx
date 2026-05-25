import Image from "next/image"
import Link from "next/link"

// 5 promo cards data - ΠΡΟΣΤΑΣΙΑ category cards
const PROMO_CARDS = [
  {
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Λιπαντικά",
    description: "Κορυφαία λιπαντικά για μέγιστη προστασία και απόδοση του κινητήρα σας.",
    image: "/images/banners/lighting-banner.png",
    href: "/store?category=lipantika",
  },
  {
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Αρωματικά",
    description: "Απολαύστε φρεσκάδα σε κάθε διαδρομή με premium αρωματικά αυτοκινήτου.",
    image: "/images/banners/store-shelf-1.png",
    href: "/store?category=aromatika",
  },
  {
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Καθαρισμός & Περιποίηση",
    description: "Προϊόντα καθαρισμού για αστραφτερό αυτοκίνητο μέσα κι έξω.",
    image: "/images/banners/store-shelf-2.png",
    href: "/store?category=katharismos",
  },
  {
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Αξεσουάρ",
    description: "Πρακτικά αξεσουάρ που αναβαθμίζουν την εμπειρία οδήγησης.",
    image: "/images/banners/karman-store-banner.png",
    href: "/store?category=aksessouar",
  },
  {
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Πρόσθετα κινητήρα",
    description: "Ενισχύστε την απόδοση με εξειδικευμένα πρόσθετα κινητήρα.",
    image: "/images/banners/wipers-banner.png",
    href: "/store?category=prostheta",
  },
]

export const HomepagePromoBanners = () => {
  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Desktop Layout - 5 cards in a row */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {PROMO_CARDS.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group relative h-[281px] rounded-lg overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1280px) 20vw, 240px"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-5">
                {/* Label */}
                <span 
                  className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1"
                  style={{ fontSize: '12px', lineHeight: '15px' }}
                >
                  {card.label}
                </span>
                
                {/* Title */}
                <h3 
                  className="text-white font-extrabold mb-2"
                  style={{ fontSize: '30px', lineHeight: '36px' }}
                >
                  {card.title}
                </h3>
                
                {/* Description */}
                <p 
                  className="text-white/70 font-normal mb-4 line-clamp-2"
                  style={{ fontSize: '14px', lineHeight: '21px' }}
                >
                  {card.description}
                </p>
                
                {/* CTA Button - Pill outline, white fill on hover */}
                <span className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white text-white text-xs font-medium transition-colors w-fit group-hover:bg-white group-hover:text-gray-900">
                  Αγόρασε τώρα
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Layout - 1 card per row, compact */}
        <div className="md:hidden flex flex-col gap-3">
          {PROMO_CARDS.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group relative h-[180px] rounded-lg overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                {/* Label */}
                <span className="text-white/70 text-[10px] font-medium uppercase tracking-wide mb-0.5">
                  {card.label}
                </span>
                
                {/* Title */}
                <h3 className="text-white font-extrabold text-xl mb-1">
                  {card.title}
                </h3>
                
                {/* Description - shorter on mobile */}
                <p className="text-white/70 text-xs font-normal mb-3 line-clamp-2">
                  {card.description}
                </p>
                
                {/* CTA Button */}
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white text-white text-xs font-medium w-fit">
                  Αγόρασε τώρα
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomepagePromoBanners
