
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      // Modified CSP to allow fonts from rsms.me and relaxed other restrictions
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline' https://rsms.me; font-src 'self' https://rsms.me; img-src 'self' data: blob:; connect-src 'self' https://bxojxrcerefklsrqkmrs.supabase.co wss://bxojxrcerefklsrqkmrs.supabase.co; frame-src 'self'; media-src 'self';",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'max-age=31536000, immutable',
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
    // Temporarily disable minification for debugging
    minify: mode === 'production' ? false : false,
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
    // Disable Terser for now
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
    },
  },
}));
