import { deleteLineItem } from "@lib/data/cart"
import { Spinner } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Trash } from "lucide-react"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center text-tertiary justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex items-center justify-center gap-x-1 bg-tertiary rounded-full p-2 hover:opacity-80 cursor-pointer transition-opacity"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? (
          <Spinner className="animate-spin text-white" />
        ) : (
          <Trash className="text-white" size={16} />
        )}
        {children && <span className="text-white">{children}</span>}
      </button>
    </div>
  )
}

export default DeleteButton

// import { deleteLineItem } from "@lib/data/cart"
// import { Spinner, Trash } from "@medusajs/icons"
// import { clx } from "@medusajs/ui"
// import { useState } from "react"
//
// const DeleteButton = ({
//   id,
//   children,
//   className,
// }: {
//   id: string
//   children?: React.ReactNode
//   className?: string
// }) => {
//   const [isDeleting, setIsDeleting] = useState(false)
//
//   const handleDelete = async (id: string) => {
//     setIsDeleting(true)
//     await deleteLineItem(id).catch((err) => {
//       setIsDeleting(false)
//     })
//   }
//
//   return (
//     <div
//       className={clx(
//         "flex items-center text-primary justify-between text-small-regular",
//         className
//       )}
//     >
//       <button
//         className="flex gap-x-1 text-ui-fg-subtle text-primary hover:text-ui-fg-base cursor-pointer"
//         onClick={() => handleDelete(id)}
//       >
//         {isDeleting ? <Spinner className="animate-spin" /> : <Trash className="text-primary" />}
//         <span>{children}</span>
//       </button>
//     </div>
//   )
// }
//
// export default DeleteButton
