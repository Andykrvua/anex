/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  i18n: {
    locales: ['ru', 'uk'],
    defaultLocale: 'ru',
  },
  images: {
    domains: ['a-k.name', 'newimg.otpusk.com'],
  },
};

module.exports = nextConfig;
