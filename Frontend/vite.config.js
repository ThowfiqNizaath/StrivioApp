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
      manifest: {
        name: "Strivio",
        short_name: "Strivio",
        description: "Track your daily routines",
        theme_color: "#14B8A6",
        background_color: "#14B8A6",
        display: "standalone",
        start_url: "/",
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
        icons: [
          {
            src: "/loginRightImg.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/loginRightImg.jpg",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
