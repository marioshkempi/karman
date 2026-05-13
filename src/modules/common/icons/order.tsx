import React from "react"
import { IconProps } from "types/icon"

const Order: React.FC<IconProps> = ({
                                       size = 20,
                                       color = "currentColor",
                                       ...attributes
                                     }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 17.5 21.5"
      stroke={color}
      fill="none"
      {...attributes}
    >
      <g transform="translate(3092.75 12116.75)">
        <g transform="translate(-3097.215 -12120.357)">
          <rect
            width="16"
            height="20"
            rx="2"
            transform="translate(5.215 4.357)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M9,9h7.185"
            transform="translate(0.407 0.927)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9,13h7.185"
            transform="translate(0.407 1.665)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9,17h4.79"
            transform="translate(0.482 2.403)"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  )
}

export default Order
