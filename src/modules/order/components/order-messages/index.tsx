"use client"

import React, { useState } from "react"
import { ChevronDown } from "@medusajs/icons"
import { formatDate } from "@lib/util/formatDate"

type OrderMessage = {
  id: number
  orderId: string
  title: string
  message: string
  employee: string
  employeeReceiver: string
  creationDate: string | null
  sentMessageDate: string | null
  updateDate: string | null
  assigneeEmployeeId: number
  orderKey: string
  userId: string
}

type OrderMessagesProps = {
  messages: OrderMessage[]
}

const OrderMessages: React.FC<OrderMessagesProps> = ({ messages }) => {
  const [isOpen, setIsOpen] = useState(false)

  // console.log(messages)
  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between  pb-3 bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl-semi text-black font-extrabold">
            Μηνύματα Παραγγελίας
          </h2>
          {messages.length > 0 && (
            <span className="text-xs font-medium bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
              {messages.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          {messages.length === 0 && (
            <p className="text-sm text-gray-500">
              Δεν υπάρχουν μηνύματα για αυτή την παραγγελία.
            </p>
          )}

          {messages.length > 0 && (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-lg p-4 bg-gray-50 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-1">
                    {msg.creationDate && (
                      <span className="text-xs text-gray-400">
                        {formatDate(msg.creationDate)}
                      </span>
                    )}
                  </div>
                  {msg.title && (
                    <p className="text-sm font-semibold text-black mb-1">
                      {msg.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderMessages