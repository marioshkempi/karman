import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  productTitle: string;
  onPrevious: () => void;
  onNext: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  productTitle,
  onPrevious,
  onNext,
}) => {
  const [modalScale, setModalScale] = useState(1);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalImageRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => {
    setModalScale(prev => Math.min(prev + 0.5, 4));
  };

  const zoomOut = () => {
    setModalScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setModalPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const handleModalMouseDown = (e: React.MouseEvent) => {
    if (modalScale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y
      });
    }
  };

  const handleModalMouseMove = (e: React.MouseEvent) => {
    if (isDragging && modalScale > 1) {
      setModalPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleModalMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (modalScale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - modalPosition.x,
        y: e.touches[0].clientY - modalPosition.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && modalScale > 1 && e.touches.length === 1) {
      setModalPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleModalPrevious = () => {
    setModalScale(1);
    setModalPosition({ x: 0, y: 0 });
    onPrevious();
  };

  const handleModalNext = () => {
    setModalScale(1);
    setModalPosition({ x: 0, y: 0 });
    onNext();
  };

  const handleClose = () => {
    setModalScale(1);
    setModalPosition({ x: 0, y: 0 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-50 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
          disabled={modalScale <= 1}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg text-sm font-medium">
          {Math.round(modalScale * 100)}%
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          disabled={modalScale >= 4}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={modalImageRef}
        className="relative w-full h-full max-w-6xl max-h-[90vh] overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleModalMouseDown}
        onMouseMove={handleModalMouseMove}
        onMouseUp={handleModalMouseUp}
        onMouseLeave={handleModalMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: modalScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div 
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${modalPosition.x}px, ${modalPosition.y}px) scale(${modalScale})`,
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`${productTitle} - Zoomed Image ${currentIndex + 1}`}
            fill
            className="object-contain pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleModalPrevious();
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg w-12 h-12 flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleModalNext();
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg w-12 h-12 flex items-center justify-center transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 text-black px-4 py-2 rounded-full text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageModal;