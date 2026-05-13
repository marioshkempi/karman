"use client"
import { useState, useEffect, useRef } from "react"
import { User } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signout } from "@lib/data/customer"
import { useParams } from "next/navigation"
import Logout from "@modules/common/icons/logout"
import MapPin from "@modules/common/icons/map-pin"
import Order from "@modules/common/icons/order"
import ChevronDown from "@modules/common/icons/chevron-down"

const menuItems = [
  { label: "Ο Λογαριασμός μου", href: "/account", icon: User },
  { label: "Παραγγελίες", href: "/account/orders", icon: Order },
  { label: "Διευθύνσεις", href: "/account/addresses", icon: MapPin },
]

export default function AccountMenu({ customer }: any) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => await signout(countryCode)

  // click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!customer)
    return (
      <LocalizedClientLink
        href="/account"
        className="flex items-center gap-1 p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16.971"
          height="19.799"
          viewBox="0 0 16.971 19.799"
        >
          <g
            id="Group_15316"
            data-name="Group 15316"
            transform="translate(18586 2063)"
          >
            <path
              id="Path_32769"
              data-name="Path 32769"
              d="M13.95,11.9A4.95,4.95,0,1,0,9,6.95a4.95,4.95,0,0,0,4.95,4.95Zm0-8.485A3.536,3.536,0,1,1,10.414,6.95,3.536,3.536,0,0,1,13.95,3.414Z"
              transform="translate(-18591.465 -2065)"
              fill="#513d31"
            />
            <path
              id="Path_32770"
              data-name="Path 32770"
              d="M13.193,18H11.778A7.778,7.778,0,0,0,4,25.778a.707.707,0,0,0,.707.707H20.264a.707.707,0,0,0,.707-.707A7.778,7.778,0,0,0,13.193,18ZM5.457,25.071a6.364,6.364,0,0,1,6.322-5.657h1.414a6.364,6.364,0,0,1,6.322,5.657Z"
              transform="translate(-18590 -2069.686)"
              fill="#513d31"
            />
          </g>
        </svg>
        {/*<span className="text-[14px] hidden md:inline">Σύνδεση</span>*/}
      </LocalizedClientLink>
    )

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16.971"
          height="19.799"
          viewBox="0 0 16.971 19.799"
        >
          <g
            id="Group_15317"
            data-name="Group 15317"
            transform="translate(18561 2063)"
          >
            <path
              id="Path_32772"
              data-name="Path 32772"
              d="M13.95,11.9A4.95,4.95,0,1,0,9,6.95a4.95,4.95,0,0,0,4.95,4.95Z"
              transform="translate(-18566.465 -2065)"
              fill="#513d31"
            />
            <path
              id="Path_32771"
              data-name="Path 32771"
              d="M13.193,18H11.778A7.778,7.778,0,0,0,4,25.778a.707.707,0,0,0,.707.707H20.264a.707.707,0,0,0,.707-.707A7.778,7.778,0,0,0,13.193,18Z"
              transform="translate(-18565 -2069.686)"
              fill="#513d31"
            />
          </g>
        </svg>
        <span className="text-[14px] hidden md:inline">
          {customer.first_name?.[0]}.{customer.last_name}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`
          absolute right-[0] md:left-[2%] mt-2 w-44 bg-white shadow-lg rounded border text-sm z-50
          transition-all duration-300 origin-top
          ${
            open
              ? "opacity-100 scale-100 translate-y-0 max-h-96"
              : "opacity-0 scale-95 -translate-y-2 max-h-0 pointer-events-none"
          }
        `}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <LocalizedClientLink
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" /> {item.label}
            </LocalizedClientLink>
          )
        })}

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 w-full px-3 py-2 hover:bg-primary hover:text-white transition-colors"
        >
          <Logout className="w-4 h-4 group-hover:text-white" />
          Αποσύνδεση
        </button>
      </div>
    </div>
  )
}
