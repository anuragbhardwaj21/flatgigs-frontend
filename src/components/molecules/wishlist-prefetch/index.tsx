import { useGetWishlistQuery } from "@/store/services/wishlist-api";

const WishlistPrefetch = () => {
  useGetWishlistQuery();
  return null;
};

export default WishlistPrefetch;
