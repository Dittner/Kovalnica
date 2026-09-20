import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Change 'dist' to your custom folder name
    outDir: 'public_html', 
  },
  plugins: [viteStaticCopy({
    targets: [
      {
        src: 'public/resources', 
        dest: 'resources'
      }
    ]
  })],
  server: {
    allowedHosts: true,
    hmr: {
      port: 3300
    }
  },

})