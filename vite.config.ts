import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = (env.VITE_API_PROXY_TARGET ?? "http://localhost:4000").replace(
    /\/$/,
    "",
  );

  return {
    plugins: [react(), svgr(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes, req) => {
              if (req.method?.toUpperCase() !== "GET") return;
              const cacheFlag = req.headers["x-http-cache"];
              const wantsCache =
                cacheFlag === "1" ||
                (Array.isArray(cacheFlag) && cacheFlag.includes("1"));
              if (!wantsCache) return;

              delete proxyRes.headers["pragma"];
              delete proxyRes.headers["expires"];
              proxyRes.headers["cache-control"] =
                "public, max-age=300, stale-while-revalidate=60";
            });
          },
        },
      },
    },
  };
});
