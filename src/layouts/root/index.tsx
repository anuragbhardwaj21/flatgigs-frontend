import { Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/atoms/spinner";
import ChatDrawer from "@/components/organisms/chat-drawer";
import Header from "@/components/organisms/header";
import { ChatProvider } from "@/context/chat";
import { SearchProvider } from "@/context/search";

const RootLayout = () => {
  const mainRef = useRef<HTMLElement | null>(null);
  return (
    <SearchProvider>
      <ChatProvider>
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
          <ChatDrawer dragConstraintsRef={mainRef} />
        </main>
      </ChatProvider>
    </SearchProvider>
  );
};

export default RootLayout;
