import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import {
  getBundleProduct,
  getProductById,
  getResolvedAttachments,
  listProducts,
} from "@lib/data/products"
import ProductDetailView from "@modules/products/templates/product-new"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { getBannersByHook } from "@lib/data/banner"
import BannerSection from "@modules/common/components/banner-section"
import { getTrackingSettings } from "@lib/data/tracking-scripts"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  searchParams: { v_id?: string }
  isNew: boolean
}

export default async function ProductView({ product, region, searchParams, isNew }: Props) {
  console.log(product)
  if (!product || !region) notFound()

  const fullProduct: any = await getProductById({ id: product.id as string })

  if (!fullProduct) notFound()
  // @ts-ignore
  const bundleProduct = product.bundle
    ? // @ts-ignore
      await getBundleProduct(product.bundle.id, {
        currency_code: region.currency_code,
        region_id: region.id,
      })
    : null

  const { banners: relatedBanners } = await getBannersByHook("product-related")
  const { banners: sidebarBanners } = await getBannersByHook("product-sidebar")
  const tracking = await getTrackingSettings()
  const erpAttachments = await getResolvedAttachments(
    fullProduct.external_id as any
  ).catch(() => [])

  return (
    <>
      <ProductDetailView
        product={fullProduct}
        region={region}
        bundle={bundleProduct?.bundle_product}
        isNew={isNew}
        sidebarBanners={sidebarBanners}
        tracking={tracking}
        erpAttachments={erpAttachments}
      />

      {relatedBanners && relatedBanners.length > 0 && (
        <div className="content-container my-8">
          <BannerSection banners={relatedBanners} />
        </div>
      )}

      <Suspense fallback={<SkeletonRelatedProducts />}>
        {/*<RelatedProducts product={fullProduct} />*/}
      </Suspense>
    </>
  )
}
