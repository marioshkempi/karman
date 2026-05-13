import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HttpTypes } from '@medusajs/types'

interface CompareProduct extends HttpTypes.StoreProduct {
  brand?: {
    id: string
    name: string
    image_url?: string
  }
}

interface CompareStore {
  products: CompareProduct[]
  maxCompare: number
  
  addProduct: (product: CompareProduct) => boolean
  removeProduct: (productId: string) => void
  clearAll: () => void
  isProductInCompare: (productId: string) => boolean
  canAddMore: () => boolean
  getCompareCount: () => number
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      products: [],
      maxCompare: 5,

      addProduct: (product) => {
        const state = get()
        
        if (state.isProductInCompare(product.id)) {
          return false
        }
        
        if (state.products.length >= state.maxCompare) {
          return false
        }
        
        set({ products: [...state.products, product] })
        return true
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId)
        }))
      },

      clearAll: () => {
        set({ products: [] })
      },

      isProductInCompare: (productId) => {
        return get().products.some((p) => p.id === productId)
      },

      canAddMore: () => {
        return get().products.length < get().maxCompare
      },

      getCompareCount: () => {
        return get().products.length
      }
    }),
    {
      name: 'product-compare-storage',
      partialize: (state) => ({ products: state.products })
    }
  )
)