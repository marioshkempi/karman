"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  addAcsPointEntry,
  getAcsPointEntry,
  getAcsPointLocations,
} from "@lib/data/acspoints"
import Modal from "@modules/common/components/modal"
import { X } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface AcsLocation {
  id: string
  name: string
  street: string
  city: string
  lat: number
  lon: number
  icon: string
  type: string
  is_24h?: boolean
  weekdays?: string
  saturday?: string
  title?: string
  notes?: string
}

interface AcsPointsMeta {
  title: string
  description: string
  icon: string
}

interface AcsPointsMapProps {
  cartId: string
  language?: "el" | "en"
  onPointSelect?: (storeId: string) => void
}

// ─── Haversine distance helper ───────────────────────────────────────────────

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const AcsPointsMap: React.FC<AcsPointsMapProps> = ({
                                                     cartId,
                                                     language = "el",
                                                     onPointSelect,
                                                   }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [locations, setLocations] = useState<AcsLocation[]>([])
  const [meta, setMeta] = useState<AcsPointsMeta[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStore, setSelectedStore] = useState<AcsLocation | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  const mapRef = useRef<any>(null) // L.Map
  const markersRef = useRef<any[]>([]) // L.Marker[]
  const mapWrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const leafletLoadedRef = useRef(false)
  const selectPointRef = useRef<(idx: number) => void>(() => {
  })

  const t = useCallback(
    (el: string, en: string) => (language === "el" ? el : en),
    [language],
  )

  useEffect(() => {
    if (!cartId) return
    getAcsPointEntry(cartId).then((entry) => {
      if (entry?.store_content) {
        try {
          const data =
            typeof entry.store_content === "string"
              ? JSON.parse(entry.store_content)
              : entry.store_content
          setSelectedStore(data)
        } catch {
          // ignore
        }
      }
    })
  }, [cartId])

  const loadLeaflet = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).L) {
        resolve()
        return
      }
      if (leafletLoadedRef.current) {
        const interval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(interval)
            resolve()
          }
        }, 100)
        return
      }
      leafletLoadedRef.current = true

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }, [])

  const fetchLocations = useCallback(async () => {
    const data = await getAcsPointLocations()
    setLocations(data.points)
    setMeta(data.meta)
    return data.points
  }, [])

  const cleanupMap = useCallback(() => {
    markersRef.current = []
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    if (mapWrapperRef.current) {
      mapWrapperRef.current.innerHTML = ""
    }
  }, [])

  const closeModal = useCallback(() => {
    cleanupMap()
    setIsOpen(false)
  }, [cleanupMap])

  const initMap = useCallback(
    async (points: AcsLocation[]) => {
      if (!mapWrapperRef.current) return

      await loadLeaflet()
      const L = (window as any).L

      // Fresh map div
      mapWrapperRef.current.innerHTML = ""
      const mapDiv = document.createElement("div")
      mapDiv.style.width = "100%"
      mapDiv.style.height = "100%"
      mapWrapperRef.current.appendChild(mapDiv)

      const map = L.map(mapDiv, {
        center: [38.0045, 23.7145],
        zoom: 7,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
      }).addTo(map)

      mapRef.current = map
      markersRef.current = []

      points.forEach((loc, idx) => {
        const lat = parseFloat(String(loc.lat))
        const lng = parseFloat(String(loc.lon))
        if (isNaN(lat) || isNaN(lng)) return

        let markerOptions: any = {}
        if (loc.icon) {
          markerOptions.icon = L.icon({
            iconUrl: loc.icon,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
          })
        }

        const marker = L.marker([lat, lng], markerOptions).addTo(map)

        let hours = ""
        if (loc.type === "smartlocker") {
          hours = `<span style="display:inline-block;padding:1px 6px;background:#4caf50;color:#fff;font-size:10px;font-weight:700;border-radius:3px;">24${language === "el" ? "ΩΡΟ" : "H"}</span>`
        } else {
          const parts: string[] = []
          if (loc.weekdays) parts.push(`${language === "el" ? "Δευ-Παρ" : "Mon-Fri"}: ${loc.weekdays}`)
          if (loc.saturday) parts.push(`${language === "el" ? "Σάβ" : "Sat"}: ${loc.saturday}`)
          hours = parts.join("<br/>")
        }

        let notes = ""
        if (loc.type === "smartlocker") {
          notes = language === "el"
            ? "Δυνατότητα πληρωμής με Visa/Mastercard."
            : "Payment available with Visa/Mastercard."
        }

        const popupHtml = `
                    <div style="max-width:220px;font-family:system-ui;font-size:13px;line-height:1.5">
                        <div style="font-weight:600;margin-bottom:4px">${loc.title || loc.name}</div>
                        <div style="color:#555">${loc.street}</div>
                        <div style="color:#555">${loc.city}</div>
                        ${notes ? `<div style="color:#888;margin-top:4px;font-size:12px">${notes}</div>` : ""}
                        ${hours ? `<div style="margin-top:6px;font-size:12px;color:#666">${hours}</div>` : ""}
                        <button data-acs-select="${idx}" style="
                            margin-top:8px;width:100%;padding:6px 12px;
                            background:#d32f2f;color:#fff;border:none;border-radius:4px;
                            cursor:pointer;font-weight:600;font-size:13px;
                        ">${language === "el" ? "Επιλογή" : "Select"}</button>
                    </div>
                `

        marker.bindPopup(popupHtml)

        marker.on("click", () => {
          setActiveIndex(idx)
          scrollToListItem(idx)
        })

        markersRef.current.push(marker)
      })

      // Bind select buttons inside popups when they open
      map.on("popupopen", (e: any) => {
        const container = e.popup.getElement()
        if (!container) return
        const btn = container.querySelector("[data-acs-select]")
        if (btn) {
          btn.addEventListener("click", (ev: Event) => {
            ev.stopPropagation()
            const idx = (ev.target as HTMLElement).getAttribute("data-acs-select")
            if (idx !== null) {
              selectPointRef.current(parseInt(idx))
            }
          })
        }
      })
    },
    [loadLeaflet, language],
  )

  const scrollToListItem = (idx: number) => {
    const el = listRef.current?.querySelector(`[data-acs-idx="${idx}"]`)
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }

  const handleSelectPoint = useCallback(
    async (idx: number) => {
      const loc = locations[idx]
      if (!loc) return

      setSelectedStore(loc)
      closeModal()
    },
    [locations, closeModal],
  )

  useEffect(() => {
    selectPointRef.current = handleSelectPoint
  }, [handleSelectPoint])

  const handleListItemClick = (idx: number) => {
    const loc = locations[idx]
    if (!loc || !mapRef.current) return

    const lat = parseFloat(String(loc.lat))
    const lng = parseFloat(String(loc.lon))

    setActiveIndex(idx)
    mapRef.current.setView([lat, lng], 14)

    const marker = markersRef.current[idx]
    if (marker) {
      marker.openPopup()
    }

    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapRef.current) return

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Greece")}&limit=1`,
      )
      const results = await resp.json()

      if (!results?.length) return

      const { lat: sLat, lon: sLon } = results[0]
      const searchLat = parseFloat(sLat)
      const searchLon = parseFloat(sLon)

      mapRef.current.setView([searchLat, searchLon], 14)

      let minDist = Infinity
      let nearestIdx = 0
      locations.forEach((p, i) => {
        const d = haversineKm(
          searchLat,
          searchLon,
          parseFloat(String(p.lat)),
          parseFloat(String(p.lon)),
        )
        if (d < minDist) {
          minDist = d
          nearestIdx = i
        }
      })

      setActiveIndex(nearestIdx)
      scrollToListItem(nearestIdx)

      const marker = markersRef.current[nearestIdx]
      if (marker) {
        marker.openPopup()
      }
    } catch (err) {
      console.error("Search failed:", err)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(async () => {
      setLoading(true)
      const points =
        locations.length > 0 ? locations : await fetchLocations()
      await initMap(points)
      setLoading(false)
    }, 350)

    return () => {
      clearTimeout(timer)
      cleanupMap()
    }
  }, [isOpen])

  useEffect(() => {
    if (!selectedStore?.id) return

    onPointSelect?.(selectedStore.id)

    const save = async () => {
      try {
        await addAcsPointEntry(cartId, selectedStore.id, selectedStore)
      } catch (err) {
        console.error("ACS point save failed", err)
      }
    }

    save()
  }, [selectedStore?.id])

  return (
    <div className="acs-points-container">
      {/* Trigger Button */}
      <button
        type="button"
        className="acs-pick-button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
      >
        {selectedStore
          ? t("Αλλαγή ACS Point", "Change ACS Point")
          : t("Επιλέξτε ένα ACS Point", "Choose an ACS Point")}
      </button>

      {/* Selected point display */}
      {selectedStore && (
        <div className="acs-selected-info">
          <strong>
            {t("Σημείο Παραλαβής:", "Pickup Point:")}
          </strong>{" "}
          {selectedStore.name}
          {selectedStore.street && (
            <>
              <br />
              <span className="acs-selected-address">
                                {selectedStore.street}
                            </span>
            </>
          )}
          {selectedStore.city && (
            <>
              <br />
              <span className="acs-selected-address">
                                {selectedStore.city}
                            </span>
            </>
          )}
        </div>
      )}

      <input
        type="hidden"
        name="acs_store_id"
        value={selectedStore?.id || ""}
        readOnly
      />
      <input
        type="hidden"
        name="acs_store_content"
        value={selectedStore ? JSON.stringify(selectedStore) : ""}
        readOnly
      />

      <Modal isOpen={isOpen} close={closeModal} size="xxlarge">
        <X
          className="absolute right-3 top-3 cursor-pointer z-10 text-white hover:text-gray-200"
          onClick={closeModal}
          size={24}
        />
        <Modal.Body>
          <div className="acs-modal-inner">

            <div className="acs-modal-header">
                            <span className="acs-modal-header-text">
                                {t(
                                  "Επιλέξτε το ACS Point που σας εξυπηρετεί",
                                  "Choose the ACS Point nearest to you",
                                )}
                            </span>
            </div>

            <div className="acs-modal-body">

              <div
                className={`acs-sidebar ${sidebarOpen ? "" : "closed"}`}
              >

                <div className="acs-search-wrapper">
                  <input
                    type="text"
                    className="acs-search-input"
                    placeholder={t(
                      "Αναζήτηση με Τ.Κ. ή διεύθυνση...",
                      "Search by postcode or address...",
                    )}
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch()
                    }}
                  />
                  <button
                    className="acs-search-btn"
                    onClick={handleSearch}
                  >
                    {t("Αναζήτηση", "Search")}
                  </button>
                </div>

                <div className="acs-points-list" ref={listRef}>
                  {locations.map((loc, idx) => (
                    <button
                      key={loc.id}
                      type="button"
                      data-acs-idx={idx}
                      className={`acs-points-list-item ${
                        activeIndex === idx
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleListItemClick(idx)
                      }
                    >
                      {loc.icon && (
                        <img
                          src={loc.icon}
                          alt=""
                          className="acs-list-icon"
                        />
                      )}
                      <span className="acs-list-content">
                                                <span className="acs-list-title">
                                                    {loc.name}
                                                </span>
                                                <span className="acs-list-address">
                                                    {loc.street}
                                                </span>
                        {loc.is_24h && (
                          <span className="acs-badge-24h">
                                                        24{t("ΩΡΟ", "H")}
                                                    </span>
                        )}
                                            </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="acs-sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? "◀" : "▶"}
              </button>

              <div className="acs-map">
                <div
                  ref={mapWrapperRef}
                  style={{ width: "100%", height: "100%" }}
                />
                {loading && (
                  <div className="acs-map-loading">
                    {t(
                      "Φόρτωση χάρτη...",
                      "Loading map...",
                    )}
                  </div>
                )}
              </div>
            </div>

            {meta.length > 0 && (
              <div className="acs-modal-footer">
                {meta.map((m, i) => (
                  <span
                    key={i}
                    className="acs-footer-item"
                    title={m.description}
                  >
                                        {m.icon && (
                                          <img src={m.icon} alt={m.title} />
                                        )}
                    <span>{m.title}</span>
                                    </span>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <style jsx>{`
          .acs-points-container {
              width: 100%;
          }

          .acs-pick-button {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              height: auto !important;
              max-height: 38px;
              padding: 8px 16px;
              background-color: #d32f2f !important;
              color: #fff !important;
              border: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              white-space: nowrap;
              box-shadow: none !important;
              transition: background 0.15s;
          }

          .acs-pick-button:hover {
              background-color: #b71c1c !important;
          }

          .acs-selected-info {
              background: #ffffff;
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 8px 12px;
              font-size: 14px;
              line-height: 1.5;
              color: #333;
              margin-top: 8px;
          }

          .acs-selected-address {
              color: #666;
              font-size: 13px;
          }

          .acs-modal-inner {
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 70vh;
              min-height: 500px;
              overflow: hidden;
              border-radius: 8px;
          }

          .acs-modal-header {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              background: #d32f2f;
              color: #fff;
              flex-shrink: 0;
          }

          .acs-modal-header-text {
              font-weight: 600;
              font-size: 15px;
          }

          .acs-modal-body {
              display: flex;
              flex: 1;
              overflow: hidden;
              position: relative;
          }

          .acs-sidebar {
              width: 320px;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
              border-right: 1px solid #e0e0e0;
              background: #fff;
              transition: margin-left 0.25s ease;
          }

          .acs-sidebar.closed {
              margin-left: -320px;
          }

          .acs-search-wrapper {
              display: flex;
              gap: 0;
              padding: 10px;
              border-bottom: 1px solid #eee;
              flex-shrink: 0;
          }

          .acs-search-input {
              flex: 1;
              padding: 8px 10px;
              border: 1px solid #ccc;
              border-right: none;
              border-radius: 4px 0 0 4px;
              font-size: 13px;
              outline: none;
          }

          .acs-search-input:focus {
              border-color: #d32f2f;
          }

          .acs-search-btn {
              padding: 8px 14px;
              background: #d32f2f;
              color: #fff;
              border: none;
              border-radius: 0 4px 4px 0;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              white-space: nowrap;
          }

          .acs-search-btn:hover {
              background: #b71c1c;
          }

          .acs-points-list {
              flex: 1;
              overflow-y: auto;
          }

          .acs-points-list-item {
              display: flex;
              align-items: center;
              gap: 10px;
              width: 100%;
              padding: 10px 12px;
              background: none;
              border: none;
              border-bottom: 1px solid #f0f0f0;
              cursor: pointer;
              text-align: left;
              transition: background 0.1s;
          }

          .acs-points-list-item:hover {
              background: #fafafa;
          }

          .acs-points-list-item.active {
              background: #fce4ec;
              border-left: 3px solid #d32f2f;
          }

          .acs-list-icon {
              width: 28px;
              height: 28px;
              flex-shrink: 0;
          }

          .acs-list-content {
              display: flex;
              flex-direction: column;
              min-width: 0;
          }

          .acs-list-title {
              font-size: 13px;
              font-weight: 600;
              color: #333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .acs-list-address {
              font-size: 12px;
              color: #777;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .acs-badge-24h {
              display: inline-block;
              margin-top: 3px;
              padding: 1px 6px;
              background: #4caf50;
              color: #fff;
              font-size: 10px;
              font-weight: 700;
              border-radius: 3px;
              width: fit-content;
          }

          .acs-sidebar-toggle {
              display: none;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              z-index: 2;
              background: #fff;
              border: 1px solid #ddd;
              border-left: none;
              border-radius: 0 4px 4px 0;
              padding: 12px 4px;
              cursor: pointer;
              font-size: 12px;
              color: #666;
              box-shadow: 2px 0 4px rgba(0, 0, 0, 0.08);
          }

          .acs-map {
              flex: 1;
              position: relative;
              min-height: 300px;
          }

          .acs-map-loading {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f5f5f5;
              color: #999;
              font-size: 14px;
              z-index: 1000;
          }

          .acs-modal-footer {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 8px 16px;
              border-top: 1px solid #eee;
              background: #fafafa;
              flex-shrink: 0;
              overflow-x: auto;
          }

          .acs-footer-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: #555;
              white-space: nowrap;
          }

          .acs-footer-item img {
              width: 20px;
              height: 20px;
          }

          @media (max-width: 767px) {
              .acs-modal-inner {
                  height: 80vh;
                  min-height: 400px;
              }

              .acs-sidebar {
                  width: 280px;
                  position: absolute;
                  z-index: 1001;
                  height: 100%;
                  background: #fff;
                  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
              }

              .acs-sidebar.closed {
                  margin-left: -280px;
              }

              .acs-sidebar-toggle {
                  display: block;
              }

              .acs-sidebar.closed ~ .acs-sidebar-toggle {
                  left: 0;
              }

              .acs-sidebar:not(.closed) ~ .acs-sidebar-toggle {
                  left: 280px;
              }
          }
      `}</style>
    </div>
  )
}

export default AcsPointsMap