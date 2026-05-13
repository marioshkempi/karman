"use client"

import { useRouter } from "next/navigation"
import Modal from "@modules/common/components/modal"
import { Heading } from "@medusajs/ui"

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function LoginPromptModal({
  isOpen,
  onClose,
  message = "Πρέπει να συνδεθείτε για να σώσετε προϊόντα στην λίστα επιθυμιών.",
}: LoginPromptModalProps) {
  const router = useRouter()

  const handleLoginAction = () => {
    onClose()
    router.push("/account")
  }

  return (
    <Modal isOpen={isOpen} close={onClose} size="small">
      <Modal.Title>
        <Heading className="mb-2 text-secondary p-3">Σύνδεση</Heading>
      </Modal.Title>
      <Modal.Body>
        <p className="text-secondary text-[12px] !text-left !block">
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-3 justify-end mt-4 p-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary border border-gray-300 rounded hover:bg-gray-50 transition-colors text-[12px]"
          >
            Ακύρωση
          </button>
          <button
            onClick={handleLoginAction}
            className="px-4 py-2 bg-primary2 text-white rounded hover:opacity-90 transition-opacity text-[12px]"
          >
            Σύνδεση
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
