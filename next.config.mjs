// next.config.mjs
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['http2.mlstatic.com'],
  },
  pageExtensions: ['js', 'jsx'], // Asegura que Next.js reconozca archivos .js y .jsx como páginas
};

export default nextConfig;
