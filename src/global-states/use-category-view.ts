import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CategoryViewStore {
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 1024

export const useCategoryViewStore = create<CategoryViewStore>()(
  persist(
    (set) => ({
      viewMode: isMobile() ? "grid" : "list",
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "category-view-storage",
    }
  )
)
