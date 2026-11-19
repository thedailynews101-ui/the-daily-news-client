import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Auth cookies must be first-party: browsers that block third-party cookies
  // (incognito, many default profiles) drop cookies set by a different site.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      // ImgBB: apex + any CDN subdomain (i.ibb.co, i.ibb.co.com, etc.)
      {
        protocol: "https",
        hostname: "ibb.co",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.ibb.co",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "ibb.co.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.ibb.co.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
