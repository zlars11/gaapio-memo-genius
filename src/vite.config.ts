
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      // More permissive CSP for all environments to ensure site loads properly
      'Content-Security-Policy': mode === 'development' 
        ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https://* wss://*; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;"
        : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://*.lovable.app; style-src 'self' 'unsafe-inline' https://rsms.me; font-src 'self' https://rsms.me; img-src 'self' data: blob:; connect-src 'self' https://bxojxrcerefklsrqkmrs.supabase.co wss://bxojxrcerefklsrqkmrs.supabase.co https://*.lovable.app; frame-src 'self'; media-src 'self'; worker-src 'self' blob:;",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': mode === 'development' 
        ? 'no-cache, no-store, must-revalidate'
        : 'max-age=31536000, immutable',
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification only in production mode
    minify: mode === 'production' ? 'terser' : false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Use content hash for better caching
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        // Split vendor chunks for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            } else if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            } else if (id.includes('lucide')) {
              return 'vendor-lucide';
            } else {
              return 'vendor';
            }
          }
        },
      },
    },
    // Configure Terser for production only
    terserOptions: {
      compress: {
        drop_console: mode === 'production' ? false : false, // Keep console logs for now for debugging
        drop_debugger: mode === 'production',
      },
    },
  },
}));
