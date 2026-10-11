import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.mepengineers.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  image: { responsiveStyles: true },
  server: { host: '127.0.0.1', port: 4321 },
});
