"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const HeaderMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return null
}

export default HeaderMenu
