import { Metadata } from "next"
import { Car } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404",
  description: "Η σελίδα δεν βρέθηκε",
}

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center bg-white px-6 py-16 sm:py-24 text-center">
      {/* 404 graphic */}
      <div className="flex items-center justify-center gap-1 sm:gap-3">
        <span className="text-[#1A2B3C] font-extrabold leading-none text-[100px] sm:text-[150px] lg:text-[180px]">
          4
        </span>

        {/* circular road / "0" */}
        <div className="relative shrink-0 w-[120px] h-[120px] sm:w-[170px] sm:h-[170px] lg:w-[200px] lg:h-[200px]">
          {/* road ring */}
          <div className="absolute inset-0 rounded-full border-[14px] sm:border-[20px] border-[#4D4D4D]" />
          {/* dashed center line on the road */}
          <div className="absolute inset-[14px] sm:inset-[20px] rounded-full border-2 border-dashed border-white/70" />

          {/* orbiting cars (clockwise) */}
          <div className="absolute inset-0 karman-404-orbit">
            <Car
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-[#FF8C00] w-5 h-5 sm:w-6 sm:h-6"
              fill="#FF8C00"
              aria-hidden="true"
            />
          </div>

          {/* orbiting car (counter-clockwise) */}
          <div className="absolute inset-0 karman-404-orbit-reverse">
            <Car
              className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 text-[#1A2B3C] w-5 h-5 sm:w-6 sm:h-6"
              fill="#1A2B3C"
              aria-hidden="true"
            />
          </div>
        </div>

        <span className="text-[#1A2B3C] font-extrabold leading-none text-[100px] sm:text-[150px] lg:text-[180px]">
          4
        </span>
      </div>

      {/* text */}
      <h1 className="mt-8 text-2xl sm:text-3xl font-bold text-[#1A2B3C]">
        404 Error
      </h1>

      {/* button */}
      <LocalizedClientLink
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#FF8C00] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#E67E00]"
      >
        Επιστροφή στην αρχική σελίδα
      </LocalizedClientLink>
    </main>
  )
}
