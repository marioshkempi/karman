// @modules/checkout/components/checkout-step-header.tsx
import { Text } from "@medusajs/ui"
import CheckCircleSolid from "@modules/common/icons/check-circle-solid"

type CheckoutStepHeaderProps = {
  title: string
  isOpen: boolean
  isCompleted: boolean
  onEdit?: () => void
  editLabel?: string
  testId?: string
}

const CheckoutStepHeader = ({
  title,
  isOpen,
  isCompleted,
  onEdit,
  editLabel = "Επεξεργασία",
  testId,
}: CheckoutStepHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between mb-4 lg:mb-6">
      <h2 className="flex flex-row text-[16px] lg:text-[20px] gap-x-2 items-center text-black font-bold">
        {!isOpen && isCompleted && (
          <CheckCircleSolid className="text-primary w-4 h-4 lg:w-5 lg:h-5 bg-promary" />
        )}
        {title}
      </h2>
      {!isOpen && isCompleted && onEdit && (
        <Text>
          <button
            onClick={onEdit}
            className="text-black text-[14px] lg:text-base hover:opacity-80"
            data-testid={testId || "edit-step-button"}
          >
            {editLabel}
          </button>
        </Text>
      )}
    </div>
  )
}

export default CheckoutStepHeader
