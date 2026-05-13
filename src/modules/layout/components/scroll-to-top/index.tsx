"use client"

import { useEffect, useState } from "react"
import { clx } from "@medusajs/ui"

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Επιστροφή στην κορυφή"
      className={clx(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center !bg-primary !text-white",
        "rounded-full bg-ui-bg-base text-ui-fg-base shadow-elevation-card-rest",
        "border border-primary",
        "transition-all duration-300 ease-in-out",
        "hover:bg-ui-bg-base-hover hover:shadow-elevation-card-hover",
        "active:scale-95",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}

export default ScrollToTop
