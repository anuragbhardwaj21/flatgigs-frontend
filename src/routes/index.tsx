import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import RootLayout from "../layouts/root";
import Dashboard from "../pages/dashboard";
import SearchResultsSkeleton from "@/views/search-results/skeleton";
import ListingDetailSkeleton from "@/views/listing-detail/skeleton";
import ComparePageSkeleton from "@/views/compare/skeleton";
import WishlistPageSkeleton from "@/views/wishlist/skeleton";

const SearchResults = lazy(() => import("../pages/search-results"));
const ListingDetail = lazy(() => import("../pages/listing-detail"));
const ComparePage = lazy(() => import("../pages/compare"));
const WishlistPage = lazy(() => import("../pages/wishlist"));

const rootRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "results",
        element: (
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults />
          </Suspense>
        ),
      },
      {
        path: "results/:id",
        element: (
          <Suspense fallback={<ListingDetailSkeleton />}>
            <ListingDetail />
          </Suspense>
        ),
      },
      {
        path: "compare",
        element: (
          <Suspense fallback={<ComparePageSkeleton />}>
            <ComparePage />
          </Suspense>
        ),
      },
      {
        path: "wishlist",
        element: (
          <Suspense fallback={<WishlistPageSkeleton />}>
            <WishlistPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

const router = createBrowserRouter(rootRoutes);

export default router;
