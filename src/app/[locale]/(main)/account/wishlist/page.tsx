import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import WishlistTemplate from "@modules/wishlist/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getCustomerWishlist } from "@lib/data/wishlist"
import NotFoundData from "@modules/common/components/not-found-data"
import { retrieveCustomer } from "@lib/data/customer"

type Props = {
  params: Promise<{}>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export const metadata: Metadata = {
  title: "Λίστα επιθυμιών",
  description: "Τα αποθηκευμένα σας προϊόντα",
}

export default async function WishlistPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    redirect(`/account`)
  }

  const wishlist = await getCustomerWishlist()

  if (!wishlist) {
    return (
      <NotFoundData
        title="Δεν βρέθηκε λίστα επιθυμιών"
        description="Δεν βρήκαμε κάποια λίστα επιθυμιών"
        linkText="Δείτε όλα τα προϊόντα"
        linkHref="/"
      />
    )
  }

  return <WishlistTemplate wishlist={wishlist} sortBy={sortBy} page={page} />
}
