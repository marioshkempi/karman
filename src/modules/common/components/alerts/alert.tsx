import React from "react"
import clsx from "clsx"

export type AlertType = "info" | "success" | "warning" | "danger" | "dark"

interface AlertProps {
  type?: AlertType
  title?: string
  message: string
  className?: string
}

const alertStyles: Record<AlertType, string> = {
  info: "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
  success: "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400",
  warning: "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
  danger: "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
  dark: "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
}

const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  message,
  className,
}) => {
  return (
    <div
      className={clsx(
        "p-4 mb-4 text-sm rounded-lg",
        alertStyles[type],
        className
      )}
      role="alert"
    >
      {title && <span className="font-medium">{title} </span>}
      {message}
    </div>
  )
}

export default Alert
