import { NextRequest, NextResponse } from "next/server"
import { searchProduct } from "@services/typesense/typesenseService"
import { getProductDiscountsBatch } from "@lib/data/products"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""

  if (!q.trim()) return NextResponse.json([])

  try {
    const data = await searchProduct(q)
    const results = data?.results ?? []

    // Extract products
    const productCollection: any = results.find((r: any) =>
      r?.request_params?.collection_name?.toLowerCase().includes("products")
    )
    const products = (productCollection?.hits ?? []).map((h: any) => h.document)

    // Batch ERP pricing
    const batchProducts = products
      .filter((p: any) => p?.external_id)
      .map((p: any) => ({
        id_product: p.metadata?.id_product, //external_id,
        product_key: p.external_id,
      }))
    console.log("batchProducts", batchProducts)
    const pricingData: any =
      batchProducts.length > 0
        ? await getProductDiscountsBatch(batchProducts, 1)
        : null

    const erpPrices: Record<string, any> = {}
    if (pricingData?.rules?.length > 0) {
      for (const rule of pricingData.rules) {
        const product = products.find(
          (p: any) => p.external_id === rule.product_key
        )
        if (product?.id) {
          erpPrices[product.id] = {
            productId: product.id,
            price: {
              status: "success",
              type: rule.type,
              value: String(rule.value),
            },
          }
        }
      }
    }

    return NextResponse.json({ results, erpPrices })
  } catch (err) {
    console.error("Search error:", err)
    return NextResponse.json([])
  }
}
