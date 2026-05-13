export function getImagesForVariant(product: any, selectedVariantId?: string) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v: any) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i: any) => [i.id, true]))
  return product.images!.filter((i: any) => imageIdsMap.has(i.id))
}
