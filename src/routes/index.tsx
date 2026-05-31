import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import RootLayout from "../layouts/root";
import Dashboard from "../pages/dashboard";
import SearchResultsSkeleton from "@/views/search-results/skeleton";

const SearchResults = lazy(() => import("../pages/search-results"));
const ListingDetail = lazy(() => import("../pages/listing-detail"));

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
          <Suspense fallback={null}>
            <ListingDetail />
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
