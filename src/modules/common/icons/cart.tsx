import Image from 'next/image'
import React from 'react'

interface CartProps {
  width?: number
  height?: number
  className?: string
  imagePath?: string
}

function CartIcon({ 
  width = 24, 
  height = 24,
  className = '',
  imagePath = '/images/carticon.svg'
}: CartProps) {
  return (
    <div className={className}>
      <Image
        src={imagePath}
        alt="Shopping Cart"
        width={width}
        height={height}
        priority
      />
    </div>
  )
}

export default CartIcon