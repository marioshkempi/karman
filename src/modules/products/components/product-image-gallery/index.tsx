"use client"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ImageModal from "@modules/common/components/zoom-modal"

type ImageGalleryProps = {
  images: string[]
  productTitle: string
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productTitle,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [images])

  const [isHovering, setIsHovering] = useState(false)
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
  const [absoluteLensPosition, setAbsoluteLensPosition] = useState({
    x: 0,
    y: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const leftButtonRef = useRef<HTMLButtonElement>(null)
  const rightButtonRef = useRef<HTMLButtonElement>(null)

  const displayImages =
    images.length > 0 ? images : ["/api/placeholder/400/500"]

  const hasMultipleImages = displayImages.length > 1

  const lensSize = 350
  const zoomLevel = 2.5

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    )
  }

  const isOverButton = (e: React.MouseEvent<HTMLDivElement>) => {
    if (leftButtonRef.current && rightButtonRef.current) {
      const leftRect = leftButtonRef.current.getBoundingClientRect()
      const rightRect = rightButtonRef.current.getBoundingClientRect()

      const x = e.clientX
      const y = e.clientY

      const overLeft =
        x >= leftRect.left &&
        x <= leftRect.right &&
        y >= leftRect.top &&
        y <= leftRect.bottom
      const overRight =
        x >= rightRect.left &&
        x <= rightRect.right &&
        y >= rightRect.top &&
        y <= rightRect.bottom

      return overLeft || overRight
    }
    return false
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return

    if (hasMultipleImages && isOverButton(e)) {
      setIsHovering(false)
      return
    }

    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLensPosition({ x, y })
    setAbsoluteLensPosition({
      x: e.clientX,
      y: e.clientY,
    })

    setIsHovering(true)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleImageClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const getBackgroundPosition = () => {
    if (!imageContainerRef.current) return "0% 0%"

    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = (lensPosition.x / rect.width) * 100
    const y = (lensPosition.y / rect.height) * 100

    return `${x}% ${y}%`
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4 relative">
        <div
          ref={imageContainerRef}
          className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/4] sm:aspect-[4/5] group cursor-crosshair max-h-[650px] w-[100%]"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
        >
          <div className="relative w-full h-full bg-white">
            <Image
              src={displayImages[currentImageIndex]}
              alt={`${productTitle} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>

          {hasMultipleImages && (
            <button
              ref={leftButtonRef}
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              onMouseEnter={() => setIsHovering(false)}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:shadow-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-200 z-9 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {hasMultipleImages && (
            <button
              ref={rightButtonRef}
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              onMouseEnter={() => setIsHovering(false)}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:shadow-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-200 z-9 transition-all hover:scale-110"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs sm:hidden">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
            {displayImages.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 rounded-lg overflow-hidden p-0 flex-shrink-0 border transition-all ${
                  currentImageIndex === index
                    ? "border-2 border-gray"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productTitle} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isHovering && (
        <div
          className="fixed pointer-events-none rounded-full overflow-hidden border-4 border-white shadow-2xl"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${absoluteLensPosition.x}px`,
            top: `${absoluteLensPosition.y}px`,
            transform: "translate(-50%, -50%)",
            boxShadow:
              "0 0 0 3px rgba(0,0,0,0.15), 0 12px 24px rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${displayImages[currentImageIndex]})`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundPosition: getBackgroundPosition(),
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={displayImages}
        currentIndex={currentImageIndex}
        productTitle={productTitle}
        onPrevious={prevImage}
        onNext={nextImage}
      />
    </>
  )
}

export default ImageGallery
