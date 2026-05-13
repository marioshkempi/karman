import { notFound } from "next/navigation"
import { Metadata } from "next"
import { cache } from "react"
import { getRegion } from "@lib/data/regions"
import { getProductByHandleCached } from "@lib/data/products"
import { getCategoryByHandle } from "@lib/data/categories"
import CategoryView from "@modules/categories/CategoryView"
import ProductView from "@modules/products/ProductView"
import { getPageByHandle } from "@lib/data/page"
import PageView from "@modules/cms/CmsPagesView"
import {
  getCategoryMetadata,
  getProductMetadata,
} from "@lib/util/generate-metadata"
import { isNewProduct } from "@lib/util/is-new-product"
import { getSiteSetting, getProductsPerPage } from "@lib/data/site-settings"
import { redirect } from "@i18n/routing"
import BodyClassManager from "@modules/layout/bodyClassManager"
import { toNextMetadata } from "@lib/data/seo"
import {
  buildCategorySchema,
  buildProductSchema,
  JsonLd,
} from "@lib/util/structured-data"
import { DEFAULT_LOCALE, NEXT_LOCALE_COOKIE } from "@constants/global"
import { cookies } from "next/headers"

export const revalidate = 3600

const getCategoryByHandleCached = cache(getCategoryByHandle)
const getPageByHandleCached = cache(getPageByHandle)
const getRegionCached = cache(getRegion)
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

type Props = {
  params: Promise<{ handle: string[] }>
  searchParams: any
}

const RESERVED_ACCOUNT_ROUTES = new Set(["account"])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string[] }>
}): Promise<Metadata> {
  const { handle: path } = await params
  if (!path?.length || RESERVED_ACCOUNT_ROUTES.has(path[0])) return {}

  const fullHandle = path.join("/")

  const category: any = await getCategoryByHandleCached(path)
  if (category) {
    return toNextMetadata(category.seo, {
      title: category.name,
      description: category.description ?? `${category.name} category.`,
      image: category.metadata?.image || category.thumbnail,
      canonical: `/${fullHandle}`,
    })
  }

  const product: any = await getProductByHandleCached(fullHandle)
  if (product) {
    const cookieStore = await cookies()
    const locale = cookieStore.get(NEXT_LOCALE_COOKIE)?.value || DEFAULT_LOCALE

    const md = product.metadata || {}
    const metaTitle =
      md[`meta_title_${locale}`] ||
      md[`meta_title_${DEFAULT_LOCALE}`] ||
      product.title

    const metaDescription =
      md[`meta_description_${locale}`] ||
      md[`meta_description_${DEFAULT_LOCALE}`] ||
      product.subtitle ||
      product.title

    return toNextMetadata(product.seo, {
      title: metaTitle,
      description: metaDescription,
      image: product.thumbnail,
      canonical: `/${path[0]}`,
    })
  }

  const page: any = await getPageByHandleCached(fullHandle)

  if (page) {
    return toNextMetadata(page.seo, {
      title: page.title || page.name,
      description: page.content?.slice(0, 160),
    })
  }

  return {}
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const { handle: path } = await params
  const fullHandle = path.join("/")
  const isSingleSegment = path.length === 1

  if (!path?.length || RESERVED_ACCOUNT_ROUTES.has(path[0])) {
    notFound()
  }

  const [region, category, newProductThreshold, productsPerPage] =
    await Promise.all([
      getRegionCached(),
      getCategoryByHandleCached(path),
      getSiteSetting("new_product_threshold"),
      getProductsPerPage(),
    ])

  if (!region) notFound()

  if (category) {
    const redirectTo = (category as any).metadata?.redirect_to
    if (redirectTo && typeof redirectTo === "string") {
      redirect({ href: redirectTo, locale: "el" })
    }
    const resolvedSearchParams = await searchParams

    return (
      <>
        <JsonLd data={buildCategorySchema(category, fullHandle, SITE_URL)} />
        <CategoryView
          productCategory={category}
          resolvedSearchParams={resolvedSearchParams}
          productsPerPage={productsPerPage}
        />
      </>
    )
  }

  const product: any = await getProductByHandleCached(path.join("/"))

  if (product) {
    const thresholdDays = Number(newProductThreshold || 0)
    const isNew = isNewProduct(product.created_at, thresholdDays)

    return (
      <>
        <JsonLd data={buildProductSchema(product, SITE_URL)} />

        <BodyClassManager productId={product.id} pageType="product" />
        <ProductView
          product={product}
          region={region}
          searchParams={searchParams}
          isNew={isNew}
        />
      </>
    )
  }

  const page: any = await getPageByHandleCached(fullHandle)

  if (page) {
    return (
      <>
        {page.seo?.structured_data && (
          <JsonLd data={page.seo.structured_data} />
        )}
        <PageView page={page as any} />
      </>
    )
  }

  notFound()
}
