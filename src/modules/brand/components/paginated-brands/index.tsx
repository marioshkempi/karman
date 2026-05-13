import { Pagination } from "@modules/store/components/pagination"
import BrandPreview from "@modules/brand/components/brand-preview"

type BrandsData = {
  brands: any[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export default function PaginatedBrands({
  page = 1,
  brandsData,
}: {
  page?: number
  brandsData: BrandsData
}) {
  const { brands, pagination } = brandsData

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full lg:grid-cols-6 gap-x-3 gap-y-8"
        data-testid="brands-list"
      >
        {brands.map((brand, index) => (
          <li key={brand.id || index}>
            <BrandPreview brand={brand} />
          </li>
        ))}
      </ul>

      {pagination.totalPages > 1 && (
        <Pagination
          data-testid="brand-pagination"
          page={page}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  )
}
