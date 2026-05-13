import { toast } from "@medusajs/ui"
import { reorder } from "../../../../lib/data/orders"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Redo2 } from "lucide-react"

type ReorderActionProps = {
  orderId: string
}

export default function ReorderAction({ orderId }: ReorderActionProps) {
    //console.log(orderId, "orderId")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleReorder = async () => {
    setIsLoading(true)
    try {
      const cart = await reorder(orderId)

      setIsLoading(false)
      toast.success("Prepared cart to reorder. Proceeding to checkout...")
      router.push(`/${cart.shipping_address!.country_code}/checkout?step=payment`)
    } catch (error) {
      setIsLoading(false)
      toast.error(`Error reordering: ${error}`)
    }
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      disabled={isLoading}
      className="flex items-center gap-1 text-secondary text-[14px] hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Redo2 size={14} />
      <span>Επανάληψη παραγγελίας</span>
    </button>
  )
}