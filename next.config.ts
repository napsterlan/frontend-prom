import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.31.40',
        port: '9015', // Укажите порт, если он используется
        pathname: '/**', // Указывает, что разрешены все пути
      },
    ],
  }
};

export default nextConfig;
