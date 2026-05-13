import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import NavbarClient from "./nav-client"
import NavbarCheckoutClient from "./nav-client-checkout"
import HeaderTopBar from "@modules/layout/components/header-top-bar"
import { retrieveCart } from "@lib/data/cart"
import { getWishlistCount } from "@lib/data/wishlist"
import { getMenu } from "@lib/data/nav-item"
import { getSiteSetting } from "@lib/data/site-settings"
import { retrieveCustomer } from "@lib/data/customer"
import { getContentBlockByIdentifier } from "@lib/data/content-blocks"

type NavProps = {
  checkout?: boolean // <-- optional prop
}

export default async function Nav({
  customer,
  cart,
  checkout = false,
  topbarText
}: {
  customer: any
  cart: any
  checkout?: boolean
  topbarText?: string
}) {
  const wishlistCount = await getWishlistCount().catch(() => 0)
  const menu: any = await getMenu()
  const headerLogo: any = await getSiteSetting("header_logo")
  console.log(menu)
  return (
    <>
      <HeaderTopBar topbarText={topbarText} />

      {checkout ? (
        <NavbarCheckoutClient headerLogo={headerLogo} customer={customer} />
      ) : (
        <NavbarClient
          cart={cart}
          wishlistCount={wishlistCount}
          menu={menu}
          headerLogo={headerLogo}
          customer={customer}
        />
      )}
    </>
  )
}
