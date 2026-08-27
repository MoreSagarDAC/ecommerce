export const CACHE_KEYS = {
  product: {
    byId: (id) => `v1:product:id:${id}`,

    bySlug: (slug) => `v1:product:slug:${slug}`,
  },

  productList: (params) => `v1:product:all:${params}`,
};
