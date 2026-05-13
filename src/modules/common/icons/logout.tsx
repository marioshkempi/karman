import React from "react"

import { IconProps } from "types/icon"

const Logout: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19.808"
      height="19.5"
      viewBox="0 0 19.808 19.5"
      stroke={color}
      {...attributes}
    >
      <g transform="translate(3095.058 12083.75)">
        <g transform="translate(-3096 -12085)">
          <path
            d="M9,6.5c.011-1.958.1-3.018.789-3.709C10.582,2,11.855,2,14.4,2h.9c2.546,0,3.818,0,4.609.791S20.7,4.854,20.7,7.4v7.2c0,2.546,0,3.818-.791,4.609S17.846,20,15.3,20h-.9c-2.546,0-3.818,0-4.609-.791C9.1,18.518,9.013,17.458,9,15.5"
            transform="translate(-0.7)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M13.7,11.7H2m0,0L5.15,9M2,11.7l3.15,2.7"
            transform="translate(0 -0.7)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  )
}

export default Logout
