const StylelintPlugin = require('stylelint-webpack-plugin');

// Content-Security-Policy
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src 'none';
  img-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
`;

const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // FIXME: On release change to /masca
  basePath: '/ssi-snap',
  reactStrictMode: true,
  swcMinify: true,
  // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files
  output: 'standalone',
  // https://nextjs.org/docs/messages/next-image-unconfigured-host
  images: {
    // Disable image optimization
    unoptimized: true,
    domains: [],
  },
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  i18n: {
    locales: ['en', 'si'],
    defaultLocale: 'en',
  },

  // Security headers and CSP
  // https://nextjs.org/docs/advanced-features/security-headers
  // Not supported with `next export`
  headers: async () => {
    return isProd
      ? [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains; preload',
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
              },
              {
                key: 'X-Frame-Options',
                value: 'DENY',
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-DNS-Prefetch-Control',
                value: 'on',
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin',
              },
              {
                key: 'Content-Security-Policy',
                value: contentSecurityPolicy.replace(/\n/g, ''),
              },
            ],
          },
        ]
      : [];
  },

  webpack: (config) => {
    config.plugins.push(new StylelintPlugin());
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
