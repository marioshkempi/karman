interface ReassurancesProps {
  language?: string
  page_type?: "home" | "product" | "cart"
}

// Static fallback trust badges for when no data from API
const STATIC_TRUST_BADGES = [
  {
    id: "1",
    icon: "/images/icons/trust-badge-1.png",
    title: "Εγγύηση Συμβατότητας",
    description: "Βρίσκουμε το σωστό ανταλλακτικό για το μοντέλο σας.",
  },
  {
    id: "2",
    icon: "/images/icons/trust-badge-2.png",
    title: "Ασφαλείς Πληρωμές",
    description: "Κρυπτογραφημένες συναλλαγές με πιστοποίηση SSL.",
  },
  {
    id: "3",
    icon: "/images/icons/trust-badge-3.png",
    title: "Premium Quality",
    description: "Ελεγμένα ανταλλακτικά για μέγιστη απόδοση.",
  },
]

export default async function Reassurances({
  language,
  page_type,
}: ReassurancesProps) {
  // Always use static KARMAN trust badges for visual consistency
  // The API data is intentionally not used for this visual redesign
  
  return (
    <div className="w-full bg-white py-6 lg:py-8 border-b border-gray-100">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {STATIC_TRUST_BADGES.map((badge) => (
            <div key={badge.id} className="flex justify-center">
              <div className="flex flex-row items-center gap-5 p-2">
                <div className="flex-shrink-0">
                  <img
                    src={badge.icon}
                    alt={badge.title}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[#283882] text-[15px] lg:text-[17px] font-bold mb-0.5">
                    {badge.title}
                  </h3>
                  <p className="text-gray-500 text-[12px] lg:text-[13px] leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
