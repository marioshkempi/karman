import Image from "next/image"
import Link from "next/link"

interface PromoBannerProps {
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  image: string
  containerClassName?: string
  textClassName?: string
  buttonClassName?: string
  imageClassName?: string
  overlayClassName?: string
}

export const PromoBanner = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = "#",
  image,
  containerClassName = "",
  textClassName = "",
  buttonClassName = "",
  imageClassName = "",
  overlayClassName = "bg-black/40",
}: PromoBannerProps) => {
  return (
    <div className={`relative overflow-hidden rounded-lg ${containerClassName}`}>
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className={`object-cover ${imageClassName}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      
      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col justify-center p-6 md:p-8 ${textClassName}`}>
        {subtitle && (
          <span className="font-extrabold text-xs uppercase tracking-wide text-white/50 mb-1" style={{ lineHeight: '32px' }}>
            {subtitle}
          </span>
        )}
        
        <h3 className="font-extrabold text-[26px] md:text-[32px] leading-8 md:leading-9 text-white mb-3">
          {title}
        </h3>
        
        {description && (
          <p className="font-medium text-sm leading-5 text-white/70 mb-4 max-w-[299px]">
            {description}
          </p>
        )}
        
        {ctaText && (
          <Link
            href={ctaHref}
            className={`inline-flex items-center justify-center px-5 py-2.5 rounded-full font-extrabold text-xs transition-colors w-fit ${buttonClassName}`}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  )
}

export default PromoBanner
