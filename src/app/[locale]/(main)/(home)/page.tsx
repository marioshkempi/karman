import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import NewsletterSignup from "@modules/home/components/newsletter"
import IntroSection from "@modules/home/components/intro"
import BlogBanner from "@modules/home/components/blog-banner"
import SocialFollowSection from "@modules/home/components/socials"
import BannerSection from "@modules/common/components/banner-section"
import { getBannersByHook } from "@lib/data/banner"
import { getSlider } from "@lib/data/slider"
import SliderCarousel from "@modules/common/components/slider-carousel"
import { listSocials } from "@lib/data/socials"
import { getTopBestSellers } from "@lib/data/analytics"
import {
  getAllFeaturedProducts,
  getFeaturedProducts,
} from "@lib/data/featured-products"
import Reassurances from "@modules/common/components/reassurances"
import PopularCategories from "@modules/home/components/popular-category"
import ProductShowCase from "@modules/home/components/new-product"
import MomoPromo from "@modules/home/components/momo-promo"
import MichelinPromo from "@modules/home/components/michelin-promo"
import SparcoPromo from "@modules/home/components/sparco-promo"
import { newProductsGetProducts } from "@services/typesense/typesenseService"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"

type Params = {
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
  params: Promise<{}>
}

type NewProductsParams = {
  limit: number
  id?: string[]
  order?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home")

  return toNextMetadata(seo, {
    title: "",
    description: "Φρέσκα Προϊόντα Βιολογικής Γεωργίας",
  })
}

export default async function Home(props: Params) {
  const [region, seo] = await Promise.all([getRegion(), getPageSeo("home")])

  const { banners } = await getBannersByHook("homepage_secondary")

  const shouldShowBanners = banners.length > 0

  const { slider } = await getSlider("home")

  const hasSlider = slider && slider.slides.length > 0

  const { socials } = await listSocials()

  if (!region) {
    return null
  }

  const queryParams: NewProductsParams = {
    limit: 8,
  }
  queryParams["order"] = "-created_at"

  const products = await newProductsGetProducts()

  const bestSellingProducts = await getTopBestSellers({
    count: 5,
  })

  const FeaturedProducts = await getAllFeaturedProducts({})

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}

      {hasSlider ? <SliderCarousel slides={slider.slides} /> : <Hero />}

      <MomoPromo />

      <MichelinPromo />

      <SparcoPromo />

      {/* Hidden old sections - kept for safety, not displayed */}
      <div className="hidden">
        <Reassurances page_type="home" />
      </div>
      <div className="hidden">
        <PopularCategories />
      </div>

      <ProductShowCase
        products={bestSellingProducts}
        region={region}
        title="Best Selling"
      />
      <ProductShowCase
        products={FeaturedProducts}
        region={region}
        title="Featured"
      />
      {banners.length > 0 && <BlogBanner banner={banners[0]} />}

      <NewsletterSignup />
      {/*{shouldShowBanners ? (*/}
      {/*  <BannerSection banners={banners} />*/}
      {/*) : (*/}
      {/* Hidden old IntroSection - replaced by SparcoPromo */}
      <div className="hidden">
        <IntroSection />
      </div>
      {/*)}*/}
      <SocialFollowSection socials={socials} />
    </>
  )
}
