import Image from "next/image"
import React from "react"

interface LogoProps {
  showText?: boolean
  width?: number
  height?: number
  className?: string
  src?: any
  classNameImage?:string
}

function Logo({
  showText = true,
  width = 40,
  height = 40,
  className = "",
  src,
  classNameImage = "",
}: LogoProps) {
  if (!src) return null // prevents rendering undefined

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt="Logo"
        className={classNameImage}
        width={width === 35 ? 45 : 235}
        height={width === 35 ? 45 : 70}
        priority
      />
      {/*{showText && (*/}
      {/*  <Image*/}
      {/*    src={src}*/}
      {/*    alt="Logo Text"*/}
      {/*    width={width * 2.5}*/}
      {/*    height={height}*/}
      {/*    priority*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  )
}

export default Logo
