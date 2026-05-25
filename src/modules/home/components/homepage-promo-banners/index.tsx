"use client"

import Image from "next/image"

const PROMO_CARDS = [
  {
    id: 1,
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Λιπαντικά",
    description: "Κορυφαία λιπαντικά για μέγιστη προστασία και...",
    image: "/images/promo/lipantika.jpg",
    href: "/el/categories/lipantika",
  },
  {
    id: 2,
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Αρωματικά",
    description: "Απολαύστε φρεσκάδα σε κάθε διαδρομή με premium...",
    image: "/images/promo/aromatika.jpg",
    href: "/el/categories/aromatika",
  },
  {
    id: 3,
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Καθαρισμός & Περιποίηση",
    description: "Προϊόντα καθαρισμού για αστραφτερό αυτοκίνητο μέσ...",
    image: "/images/promo/katharismos.jpg",
    href: "/el/categories/katharismos-peripoiisi",
  },
  {
    id: 4,
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Αξεσουάρ",
    description: "Πρακτικά αξεσουάρ που αναβαθμίζουν την εμπειρία...",
    image: "/images/promo/aksesoyar.jpg",
    href: "/el/categories/aksesoyar",
  },
  {
    id: 5,
    label: "ΠΡΟΣΤΑΣΙΑ",
    title: "Πρόσθετα κινητήρα",
    description: "Ενισχύστε την απόδοση με εξειδικευμένα πρόσθετα...",
    image: "/images/promo/prostheta-kinitera.jpg",
    href: "/el/categories/prostheta-kinitera",
  },
]

export default function HomepagePromoBanners() {
  return (
    <section className="w-full bg-white py-6 lg:py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Desktop: 5 cards in a row */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4">
          {PROMO_CARDS.map((card) => (
            <a
              key={card.id}
              href={card.href}
              className="relative w-full h-[281px] rounded-lg overflow-hidden group"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="text-white/70 text-[12px] font-medium tracking-wide mb-1">
                  {card.label}
                </span>
                <h3 className="text-white text-[30px] font-extrabold leading-tight mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {card.title}
                </h3>
                <p className="text-white/70 text-[14px] leading-snug mb-4 line-clamp-2">
                  {card.description}
                </p>
                <span className="inline-flex items-center justify-center w-fit px-5 py-2.5 border border-white text-white text-[14px] font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-colors">
                  Αγόρασε τώρα
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile: 1 card per row */}
        <div className="flex flex-col gap-3 lg:hidden">
          {PROMO_CARDS.map((card) => (
            <a
              key={card.id}
              href={card.href}
              className="relative w-full h-[180px] rounded-lg overflow-hidden group"
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-white/70 text-[10px] font-medium tracking-wide mb-1">
                  {card.label}
                </span>
                <h3 className="text-white text-[22px] font-extrabold leading-tight mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {card.title}
                </h3>
                <p className="text-white/70 text-[12px] leading-snug mb-3 line-clamp-2">
                  {card.description}
                </p>
                <span className="inline-flex items-center justify-center w-fit px-4 py-2 border border-white text-white text-[12px] font-semibold rounded-full">
                  Αγόρασε τώρα
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
