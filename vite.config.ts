import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { readFileSync } from 'fs';

// Plugin to suppress FluentUI sourcemap 404 errors
const suppressFluentUISourcemaps = (): Plugin => ({
  name: 'suppress-fluentui-sourcemaps',
  configureServer(server) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const url = req.url || '';
      if (url.includes('/@fluentui+web-components') && url.includes('/src/') && url.endsWith('.ts')) {
        res.statusCode = 204;
        res.end();
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [
    sveltekit(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ["localStorage", "preferredLanguage", "url"]
    }),
    suppressFluentUISourcemaps()
  ],
  optimizeDeps: {
    include: ['@fluentui/web-components']
  },
  ssr: {
    noExternal: ['@fluentui/web-components']
  },
  build: {
    sourcemap: false
  },
  server: {
    https: {
      key: readFileSync('key.pem'),
      cert: readFileSync('cert.pem')
    },
    host: true
  }
});
