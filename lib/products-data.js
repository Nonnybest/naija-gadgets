// Intentionally empty: the shop reads products from the database only.
export const INITIAL_PRODUCTS = [];
export const productImages = (p) => (p?.images?.length ? p.images : p?.image_url ? [p.image_url] : []);
