import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative min-h-screen flex flex-col">
      <Nav checkout={true} customer={undefined} cart={undefined} />

      <div
        className="relative flex-1 flex flex-col"
        data-testid="checkout-container"
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}
