// vite.config.js
import autoprefixer from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/autoprefixer/lib/autoprefixer.js";
import { defineConfig } from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "url";
import { liveReload } from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/vite-plugin-live-reload/dist/index.js";
import postcssPresetEnv from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/postcss-preset-env/dist/index.mjs";
import ReactivityTransform from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/@vue-macros/reactivity-transform/dist/vite.mjs";
import { VitePWA } from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/vite-plugin-pwa/dist/index.js";
import vue from "file:///C:/Users/becke/Desktop/Scouting-App/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/becke/Desktop/Scouting-App/vite.config.js";
var vite_config_default = defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer, postcssPresetEnv({ stage: 1 })]
    }
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  plugins: [
    ReactivityTransform(),
    vue(),
    VitePWA({
      includeAssets: ["assets/*", "icons/*"],
      manifest: {
        name: "CIS Scouting",
        short_name: "Scouting",
        description: "A scouting app based off Black Hawks Scouting made by FRC Team 2834",
        theme_color: "#292929",
        background_color: "#292929",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    liveReload([
      "public/"
    ])
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxiZWNrZVxcXFxEZXNrdG9wXFxcXFNjb3V0aW5nLUFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYmVja2VcXFxcRGVza3RvcFxcXFxTY291dGluZy1BcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2JlY2tlL0Rlc2t0b3AvU2NvdXRpbmctQXBwL3ZpdGUuY29uZmlnLmpzXCI7LyogZXNsaW50LWVudiBub2RlICovXHJcblxyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcInVybFwiO1xyXG5pbXBvcnQgeyBsaXZlUmVsb2FkIH0gZnJvbSBcInZpdGUtcGx1Z2luLWxpdmUtcmVsb2FkXCI7XHJcbmltcG9ydCBwb3N0Y3NzUHJlc2V0RW52IGZyb20gXCJwb3N0Y3NzLXByZXNldC1lbnZcIjtcclxuaW1wb3J0IFJlYWN0aXZpdHlUcmFuc2Zvcm0gZnJvbSBcIkB2dWUtbWFjcm9zL3JlYWN0aXZpdHktdHJhbnNmb3JtL3ZpdGVcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGNzczoge1xyXG4gICAgcG9zdGNzczoge1xyXG4gICAgICBwbHVnaW5zOiBbYXV0b3ByZWZpeGVyLCBwb3N0Y3NzUHJlc2V0RW52KHsgc3RhZ2U6IDEgfSldXHJcbiAgICB9XHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIEFQUF9WRVJTSU9OOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgUmVhY3Rpdml0eVRyYW5zZm9ybSgpLFxyXG4gICAgdnVlKCksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgaW5jbHVkZUFzc2V0czogW1wiYXNzZXRzLypcIiwgXCJpY29ucy8qXCJdLFxyXG4gICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgIG5hbWU6IFwiQ0lTIFNjb3V0aW5nXCIsXHJcbiAgICAgICAgc2hvcnRfbmFtZTogXCJTY291dGluZ1wiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkEgc2NvdXRpbmcgYXBwIGJhc2VkIG9mZiBCbGFjayBIYXdrcyBTY291dGluZyBtYWRlIGJ5IEZSQyBUZWFtIDI4MzRcIixcclxuICAgICAgICB0aGVtZV9jb2xvcjogXCIjMjkyOTI5XCIsXHJcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjMjkyOTI5XCIsXHJcbiAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcImljb25zL3B3YS0xOTJ4MTkyLnBuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogXCJpY29ucy9wd2EtNTEyeDUxMi5wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIGxpdmVSZWxvYWQoW1xyXG4gICAgICBcInB1YmxpYy9cIlxyXG4gICAgXSlcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgIH0sXHJcbiAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sc0JBQXNCO0FBQzdCLE9BQU8seUJBQXlCO0FBQ2hDLFNBQVMsZUFBZTtBQUN4QixPQUFPLFNBQVM7QUFUdUssSUFBTSwyQ0FBMkM7QUFZeE8sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUyxDQUFDLGNBQWMsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUFBLElBQ3hEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sYUFBYSxLQUFLLFVBQVUsUUFBUSxJQUFJLG1CQUFtQjtBQUFBLEVBQzdEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxvQkFBb0I7QUFBQSxJQUNwQixJQUFJO0FBQUEsSUFDSixRQUFRO0FBQUEsTUFDTixlQUFlLENBQUMsWUFBWSxTQUFTO0FBQUEsTUFDckMsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1Q7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
