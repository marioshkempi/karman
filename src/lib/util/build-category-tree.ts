

export const buildCategoryTree = (category: any): any[] => {
  const tree: any[] = []
  let current: any | null | undefined = category

  while (current) {
    tree.unshift(current)
    current = current.parent_category ?? null
  }

  return tree
}
