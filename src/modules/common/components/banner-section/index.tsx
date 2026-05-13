import Image from "next/image"
import BannerCarousel from "../banner-carousel"
export interface StoreBanner {
  id: string
  title: string
  description: string | null
  image_url: string
  mobile_image_url: string | null
  cta_text: string | null
  cta_url: string | null
  hook: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  query_parameters?: Array<{
    id: string
    param_key: string
    param_value: string
  }>
}
interface BannerSectionProps {
  banners: StoreBanner[] 
}

const BannerSection = ({ banners }: BannerSectionProps) => {
  return (
    <div className="w-full mb-8">
      <BannerCarousel banners={banners} />
    </div>
  )
}

export default BannerSection