import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
        ],
      },
      manifest: {
        name: "Strivio",
        short_name: "Strivio",
        description: "Track your daily routines",
        theme_color: "#14B8A6",
        background_color: "#14B8A6",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/loginRightImg-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/loginRightImg-512.png",
            sizes: "512x512",
            etype: "image/png",
          },
        ],
      },
    }),
  ],
});
