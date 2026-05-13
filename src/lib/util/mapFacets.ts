export const mapFacets = (facetsFromAPI: any[]) => {
  return facetsFromAPI.map((facet) => ({
    title: facet.name,
    options: facet.counts.map((c: any) => ({
      value: String(c.value),
      count: c.count || 0,

    })),
    stats: facet.stats || {}
  }))
}