import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_PROXY_TARGET || 'https://sanad-ebon.vercel.app';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: false,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: true,
          // Let the browser keep session cookies on localhost
          cookieDomainRewrite: '',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('origin', target);
              proxyReq.setHeader('referer', `${target}/`);
            });
            // Strip Secure so cookies work over http://localhost
            proxy.on('proxyRes', (proxyRes) => {
              const raw = proxyRes.headers['set-cookie'];
              if (!raw) return;
              const list = Array.isArray(raw) ? raw : [raw];
              proxyRes.headers['set-cookie'] = list.map((c) =>
                c
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*Domain=[^;]*/gi, '')
                  .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
              );
            });
          },
        },
      },
    },
  };
});
