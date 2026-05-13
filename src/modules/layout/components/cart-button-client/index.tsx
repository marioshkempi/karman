"use client"

import { HttpTypes } from "@medusajs/types"
import CartSideDrawer from "../cart-dropdown"

export default function CartButtonClient({
  cart,
}: {
  cart?: HttpTypes.StoreCart | null
}) {
  return <CartSideDrawer cart={cart} />
}
