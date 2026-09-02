/** @type {import('next').NextConfig} */

// ────────────────────────────────────────────────────────────────
//  ตั้งค่า BASE PATH สำหรับ GitHub Pages
//  - ถ้า deploy ที่ https://<user>.github.io/<repo>  ให้ตั้ง NEXT_PUBLIC_BASE_PATH = "/<repo>"
//  - ถ้า deploy บน Vercel หรือ custom domain ให้ปล่อยว่าง ""
//  GitHub Actions ใน .github/workflows/deploy.yml จะ inject ค่านี้ให้อัตโนมัติ
// ────────────────────────────────────────────────────────────────
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Static Site Generation → ได้โฟลเดอร์ out/ ที่โยนขึ้น GitHub Pages ได้ทันที
  output: 'export',

  // GitHub Pages ต้องการ trailing slash เพื่อให้ route /admin/ ทำงานถูกต้อง
  trailingSlash: true,

  basePath: basePath,
  assetPrefix: basePath || undefined,

  // next/image ไม่รองรับ optimization บน static export
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: false,
  },

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
