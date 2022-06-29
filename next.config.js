/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ru', 'uk'],
    defaultLocale: 'ru',
  },
  images: {
    domains: ['a-k.name'],
  },
};

module.exports = nextConfig;
