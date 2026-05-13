import React from "react"
import { IconProps } from "types/icon"

const Checkmark: React.FC<IconProps> = ({
  size = "14",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke={color}
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M3 8L6 11L11 3.5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Checkmark
