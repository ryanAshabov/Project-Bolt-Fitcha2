// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [react()],
  // Server configuration
  server: {
    host: "localhost",
    port: 5173,
    open: true,
    strictPort: false,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  // Build optimization
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2020",
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage", "firebase/functions"],
          "vendor-ui": ["framer-motion", "lucide-react"],
          "vendor-utils": ["date-fns"]
        },
        // Optimize chunk size
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    },
    // Reduce bundle size by removing console.log in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@services": path.resolve(__vite_injected_original_dirname, "./src/services"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils")
    }
  },
  // Dependency optimization
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "react-router-dom",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore"
    ]
  },
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  // Performance optimizations
  esbuild: {
    legalComments: "none",
    treeShaking: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgXG4gIC8vIFNlcnZlciBjb25maWd1cmF0aW9uXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDUxNzMsXG4gICAgb3BlbjogdHJ1ZSxcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSxcbiAgICBjb3JzOiB0cnVlLFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gQnVpbGQgb3B0aW1pemF0aW9uXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gU3BsaXQgdmVuZG9yIGNodW5rcyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd2ZW5kb3ItZmlyZWJhc2UnOiBbJ2ZpcmViYXNlL2FwcCcsICdmaXJlYmFzZS9hdXRoJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZScsICdmaXJlYmFzZS9zdG9yYWdlJywgJ2ZpcmViYXNlL2Z1bmN0aW9ucyddLFxuICAgICAgICAgICd2ZW5kb3ItdWknOiBbJ2ZyYW1lci1tb3Rpb24nLCAnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgICAgJ3ZlbmRvci11dGlscyc6IFsnZGF0ZS1mbnMnXSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gT3B0aW1pemUgY2h1bmsgc2l6ZVxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFJlZHVjZSBidW5kbGUgc2l6ZSBieSByZW1vdmluZyBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gUGF0aCBhbGlhc2VzIGZvciBjbGVhbmVyIGltcG9ydHNcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAcGFnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcbiAgICAgICdAc2VydmljZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc2VydmljZXMnKSxcbiAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaG9va3MnKSxcbiAgICAgICdAdHlwZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcbiAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gRGVwZW5kZW5jeSBvcHRpbWl6YXRpb25cbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLCBcbiAgICAgICdyZWFjdC1kb20nLCBcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdmaXJlYmFzZS9hcHAnLFxuICAgICAgJ2ZpcmViYXNlL2F1dGgnLFxuICAgICAgJ2ZpcmViYXNlL2ZpcmVzdG9yZScsXG4gICAgXSxcbiAgfSxcbiAgXG4gIC8vIEVudmlyb25tZW50IHZhcmlhYmxlc1xuICBkZWZpbmU6IHtcbiAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxuICB9LFxuICBcbiAgLy8gUGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uc1xuICBlc2J1aWxkOiB7XG4gICAgbGVnYWxDb21tZW50czogJ25vbmUnLFxuICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBO0FBQUEsRUFHakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQTtBQUFBLFVBRVosZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELG1CQUFtQixDQUFDLGdCQUFnQixpQkFBaUIsc0JBQXNCLG9CQUFvQixvQkFBb0I7QUFBQSxVQUNuSCxhQUFhLENBQUMsaUJBQWlCLGNBQWM7QUFBQSxVQUM3QyxnQkFBZ0IsQ0FBQyxVQUFVO0FBQUEsUUFDN0I7QUFBQTtBQUFBLFFBRUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxlQUFlLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDckQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQy9DLFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsSUFDeEIsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixpQkFBaUIsS0FBSyxVQUFVLFFBQVEsSUFBSSxtQkFBbUI7QUFBQSxFQUNqRTtBQUFBO0FBQUEsRUFHQSxTQUFTO0FBQUEsSUFDUCxlQUFlO0FBQUEsSUFDZixhQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
