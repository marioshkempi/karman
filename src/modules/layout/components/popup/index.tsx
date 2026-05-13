"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { StorePopup, ListPopupsParams, fetchPopups } from "@lib/data/popups"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { sdk } from "@lib/config"

function normalizeUrl(url: string | null | undefined): string {
  if (!url) return "/"

  let normalized = url.trim()

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const urlObj = new URL(normalized)
      let path = urlObj.pathname

      const pathParts = path.split("/").filter(Boolean)
      if (pathParts.length > 0 && pathParts[0].match(/^[a-z]{2}$/i)) {
        pathParts.shift()
      }

      path = "/" + pathParts.join("/")

      if (path.length > 1 && path.endsWith("/")) {
        path = path.slice(0, -1)
      }

      return path || "/"
    } catch (e) {
      return normalized
    }
  }

  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized
  }

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1)
  }

  return normalized || "/"
}

export const fetchPopupsClient = async (
  params: ListPopupsParams
): Promise<{ popups: StorePopup[]; count: number }> => {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  const queryParams = new URLSearchParams()
  if (params.page_type) queryParams.append("page_type", params.page_type)
  if (params.category_id) queryParams.append("category_id", params.category_id)
  if (params.path) queryParams.append("path", params.path)
  if (params.is_mobile !== undefined) {
    queryParams.append("is_mobile", params.is_mobile.toString())
  }

  try {
    const res = await fetch(
      `${backendUrl}/store/popups?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(publishableKey
            ? { "x-publishable-api-key": publishableKey }
            : {}),
        },
        cache: "no-store",
      }
    )

    if (!res.ok) return { popups: [], count: 0 }

    const { popups = [], count = 0 } = await res.json()
    return { popups, count }
  } catch (error) {
    console.error("Error fetching popups:", error)
    return { popups: [], count: 0 }
  }
}

export default function PopupManager() {
  const [popups, setPopups] = useState<StorePopup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visiblePopup, setVisiblePopup] = useState<StorePopup | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const scrollListenerRef = useRef<(() => void) | null>(null)
  const exitIntentListenerRef = useRef<(() => void) | null>(null)
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getPageType = useCallback((): {
    page_type: "homepage" | "checkout" | "category" | "product" | "custom"
    category_id?: string
    path?: string
  } => {
    if (!pathname) {
      return { page_type: "custom", path: "/" }
    }

    const pathWithoutCountry = pathname.split("/").slice(2).join("/") || "/"

    if (pathWithoutCountry === "/" || pathWithoutCountry === "") {
      return { page_type: "homepage" }
    }

    if (pathWithoutCountry.startsWith("checkout")) {
      return { page_type: "checkout" }
    }

    if (pathWithoutCountry.startsWith("products/")) {
      return { page_type: "product" }
    }

    if (pathWithoutCountry.startsWith("categories/")) {
      const categoryPath = pathWithoutCountry.replace("categories/", "")
      const categoryHandle = categoryPath.split("/")[0]
      return { page_type: "category", category_id: categoryHandle }
    }

    return { page_type: "custom", path: normalizeUrl(pathWithoutCountry) }
  }, [pathname])

  const shouldShowPopup = useCallback((popup: StorePopup): boolean => {
    const cookieName = popup.cookie_name || `popup_${popup.id}`

    const lastShown = localStorage.getItem(cookieName)
    const now = Date.now()

    switch (popup.frequency_type) {
      case "once_ever":
        if (lastShown) return false
        break

      case "once_per_session":
        const sessionKey = `session_${cookieName}`
        if (sessionStorage.getItem(sessionKey)) return false
        break

      case "daily":
        if (lastShown) {
          const lastShownTime = parseInt(lastShown)
          const oneDayAgo = now - 24 * 60 * 60 * 1000
          if (lastShownTime > oneDayAgo) return false
        }
        break

      case "always":
        break

      default:
        const defaultSessionKey = `session_${cookieName}`
        if (sessionStorage.getItem(defaultSessionKey)) return false
    }

    return true
  }, [])

  const markPopupAsShown = useCallback((popup: StorePopup) => {
    const cookieName = popup.cookie_name || `popup_${popup.id}`

    switch (popup.frequency_type) {
      case "once_ever":
      case "daily":
        localStorage.setItem(cookieName, Date.now().toString())
        break

      case "once_per_session":
        const sessionKey = `session_${cookieName}`
        sessionStorage.setItem(sessionKey, "true")
        break

      case "always":
        break

      default:
        const defaultSessionKey = `session_${cookieName}`
        sessionStorage.setItem(defaultSessionKey, "true")
    }
  }, [])

  const isMobile = useCallback((): boolean => {
    if (typeof window === "undefined") return false
    return window.innerWidth < 768
  }, [])

  const getCtaButtonClasses = useCallback(() => {
    return "inline-block px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base text-center"
  }, [])

  const fetchPopupsData = useCallback(async () => {
    setIsLoading(true)
    try {
      const deviceMobile = isMobile()
      const pageInfo = getPageType()

      const { popups: fetchedPopups } = await fetchPopups({
        page_type: pageInfo.page_type,
        category_id: pageInfo.category_id,
        path: pageInfo.path,
        is_mobile: deviceMobile,
      })

      setPopups(fetchedPopups || [])
    } catch (error) {
      console.error("Error fetching popups:", error)
      setPopups([])
    } finally {
      setIsLoading(false)
    }
  }, [isMobile, getPageType])

  useEffect(() => {
    fetchPopupsData()
  }, [pathname, fetchPopupsData])

  const findPopupToShow = useCallback((): StorePopup | null => {
    if (popups.length === 0) return null

    const eligiblePopups = popups.filter((popup) => {
      if (!shouldShowPopup(popup)) return false
      return true
    })

    if (eligiblePopups.length === 0) return null

    eligiblePopups.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    return eligiblePopups[0]
  }, [popups, shouldShowPopup])

  const showPopupWithDelay = useCallback(
    (popup: StorePopup) => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current)
      }

      delayTimeoutRef.current = setTimeout(() => {
        setVisiblePopup(popup)
        setIsVisible(true)
        markPopupAsShown(popup)
      }, popup.delay_seconds * 1000)
    },
    [markPopupAsShown]
  )

  useEffect(() => {
    const popup = findPopupToShow()
    if (!popup || !popup.show_on_scroll_percent) return

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100

      if (scrollPercent >= popup.show_on_scroll_percent!) {
        if (!isVisible && shouldShowPopup(popup)) {
          setVisiblePopup(popup)
          setIsVisible(true)
          markPopupAsShown(popup)
        }
        window.removeEventListener("scroll", handleScroll)
      }
    }

    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollHandler, { passive: true })
    scrollListenerRef.current = () =>
      window.removeEventListener("scroll", scrollHandler)

    return () => {
      if (scrollListenerRef.current) {
        scrollListenerRef.current()
      }
    }
  }, [findPopupToShow, isVisible, shouldShowPopup, markPopupAsShown])

  useEffect(() => {
    const popup = findPopupToShow()
    if (!popup || !popup.show_on_exit_intent) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && shouldShowPopup(popup)) {
        setVisiblePopup(popup)
        setIsVisible(true)
        markPopupAsShown(popup)
        document.removeEventListener("mouseleave", handleMouseLeave)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    exitIntentListenerRef.current = () =>
      document.removeEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (exitIntentListenerRef.current) {
        exitIntentListenerRef.current()
      }
    }
  }, [findPopupToShow, shouldShowPopup, markPopupAsShown])

  useEffect(() => {
    const popup = findPopupToShow()
    if (!popup) return

    if (popup.show_on_scroll_percent || popup.show_on_exit_intent) {
      return
    }

    if (popup.delay_seconds > 0) {
      showPopupWithDelay(popup)
    } else {
      setVisiblePopup(popup)
      setIsVisible(true)
      markPopupAsShown(popup)
    }

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current)
      }
    }
  }, [findPopupToShow, showPopupWithDelay, markPopupAsShown])

  useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (scrollListenerRef.current) scrollListenerRef.current()
      if (exitIntentListenerRef.current) exitIntentListenerRef.current()
    }
  }, [])

  const closePopup = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      setVisiblePopup(null)
    }, 300)
  }, [])

  if (isLoading || !visiblePopup || !isVisible) return null

  const {
    title,
    text,
    html_content,
    image_url,
    cta_button_text,
    cta_button_link,
    cta_button_position,
    link,
    background_color,
    text_color,
    overlay_color,
    overlay_opacity,
    position,
    width,
    max_width,
  } = visiblePopup

  const backdropStyle = {
    backgroundColor: overlay_color || "rgba(0, 0, 0, 0.5)",
    opacity: overlay_opacity || 0.5,
  }

  const popupStyle = {
    backgroundColor: background_color || "#ffffff",
    color: text_color || "#000000",
    width: width || "auto",
    maxWidth: max_width || "600px",
  }

  const positionClasses: Record<string, string> = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-8",
    bottom: "items-end justify-center pb-8",
    left: "items-center justify-start pl-8",
    right: "items-center justify-end pr-8",
  }

  const ctaPositionClasses: Record<string, string> = {
    bottom_left: "justify-start",
    bottom_right: "justify-end",
    bottom_center: "justify-center",
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex ${
        positionClasses[position || "center"]
      } transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closePopup}
    >
      <div className="fixed inset-0" style={backdropStyle} />
      <div
        className={`relative bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 my-2 sm:my-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-50 p-2 rounded-full hover:bg-gray-100 bg-white shadow-md"
          aria-label="Close popup"
          style={{ zIndex: 9999 }}
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="space-y-3 sm:space-y-4">
          {image_url && (
            <div className="relative w-full h-40 sm:h-48 md:h-64 mb-3 sm:mb-4 rounded-md overflow-hidden">
              {link ? (
                <LocalizedClientLink
                  href={normalizeUrl(link)}
                  className="block w-full h-full"
                >
                  <Image
                    src={image_url}
                    alt={title || "Popup image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 600px"
                  />
                </LocalizedClientLink>
              ) : (
                <Image
                  src={image_url}
                  alt={title || "Popup image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 600px"
                />
              )}
            </div>
          )}

          {title && (
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold pr-4"
              style={{ color: text_color || "#000000" }}
            >
              {title}
            </h2>
          )}

          {html_content ? (
            <div
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800"
              style={{ color: text_color || "#000000" }}
              dangerouslySetInnerHTML={{ __html: html_content }}
            />
          ) : text ? (
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed"
              style={{ color: text_color || "#000000" }}
            >
              {text}
            </p>
          ) : null}

          {cta_button_text && cta_button_link && (
            <div
              className={`pt-2 sm:pt-4 flex ${
                ctaPositionClasses[cta_button_position || "bottom_center"] ||
                "justify-center"
              }`}
            >
              <LocalizedClientLink
                href={normalizeUrl(cta_button_link)}
                className={getCtaButtonClasses()}
                onClick={closePopup}
              >
                {cta_button_text}
              </LocalizedClientLink>
            </div>
          )}

          {link && !cta_button_link && (
            <div
              className={`pt-2 sm:pt-4 flex ${
                ctaPositionClasses[cta_button_position || "bottom_center"] ||
                "justify-center"
              }`}
            >
              <LocalizedClientLink
                href={normalizeUrl(link)}
                className={getCtaButtonClasses()}
                onClick={closePopup}
              >
                Learn More
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
