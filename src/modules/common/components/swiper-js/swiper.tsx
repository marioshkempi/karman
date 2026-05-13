"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

/**
 * Reusable Swiper component
 *
 * @param {Array<React.ReactNode>} slides - Array of React elements for each slide
 * @param {Object} options - Swiper options (spaceBetween, slidesPerView, etc.)
 */
const SwiperSlider = ({ slides = [], options = {} }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      {...options}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  )
}

export default SwiperSlider
