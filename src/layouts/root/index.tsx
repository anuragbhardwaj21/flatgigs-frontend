import { Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/atoms/spinner";
import UiConfigDrawer from "@/components/organisms/ui-config-drawer";
import Header from "@/components/organisms/header";
import { SearchProvider } from "@/context/search";

const RootLayout = () => {
  const mainRef = useRef<HTMLElement | null>(null);
  return (
    <SearchProvider>
      <main
        className="font-sans graph-bg-light fixed inset-0 overflow-auto h-dvh"
        ref={mainRef}
      >
        <Header />
        <Suspense
          fallback={
            <div className="main-container flex flex-1 items-center justify-center py-20">
              <Spinner />
            </div>
          }
        >
          <Outlet />
        </Suspense>
        <UiConfigDrawer dragConstraintsRef={mainRef} />
      </main>
    </SearchProvider>
  );
};

export default RootLayout;
