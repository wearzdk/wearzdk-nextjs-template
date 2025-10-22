// @ts-check
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isExport = process.env.EXPORT === 'true';

// 定义你的基础文件后缀
const basePageExtensions = ['ts', 'tsx'];

// 定义包含 API 路由的文件后缀
const apiPageExtensions = ['api.ts', 'api.tsx', ...basePageExtensions];

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/model', '@repo/backend'],
  reactStrictMode: true,
  // 根据 isExport 动态设置 pageExtensions
  pageExtensions: isExport ? basePageExtensions : apiPageExtensions,

  output: isExport ? 'export' : undefined,
  images: isExport ? { unoptimized: true } : undefined,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default withBundleAnalyzer(nextConfig);
