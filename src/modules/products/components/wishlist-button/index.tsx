"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { isInWishlist, toggleWishlistItem } from "@lib/data/wishlist"
import { isAuthenticated } from "@lib/data/isUserAuthenticated"

type WishlistButtonProps = {
  variantId: string | undefined
  showLabel?: boolean
  onLoginRequired?: () => void
}

const WishlistButton = ({
  variantId,
  showLabel = true,
  onLoginRequired,
}: WishlistButtonProps) => {
  const [isInWishlistState, setIsInWishlistState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      if (variantId) {
        const inWishlist = await isInWishlist(variantId)
        setIsInWishlistState(inWishlist)
      }
    }
    checkStatus()
  }, [variantId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!variantId) return

    const isLoggedIn = await isAuthenticated()
    if (!isLoggedIn) {
      onLoginRequired?.()
      return
    }

    setIsLoading(true)
    try {
      const { success, isInWishlist } = await toggleWishlistItem(variantId)
      if (success) {
        setIsInWishlistState(isInWishlist)
        toast.success(
          isInWishlist
            ? "Προστέθηκε στα αγαπημένα"
            : "Αφαιρέθηκε από τα αγαπημένα"
        )
      }
    } catch {
      toast.error("Κάτι πήγε στραβά!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!variantId || isLoading}
      className="flex items-center gap-2 disabled:opacity-50 py-1 rounded hover:opacity-80 transition-opacity"
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          isInWishlistState 
            ? "fill-red-500 text-red-500" 
            : "fill-transparent text-gray-500"
        }`}
        strokeWidth={1.5}
      />
      {showLabel && (
        <span className={`text-[16px] ${isInWishlistState ? "text-red-500" : "text-gray-600"}`}>
          {isLoading
            ? "..."
            : isInWishlistState
            ? "Στα αγαπημένα"
            : "Αγαπημένα"}
        </span>
      )}
    </button>
  )
}

export default WishlistButton
