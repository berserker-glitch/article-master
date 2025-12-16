import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Next uses THIS repo as root (avoids picking up C:\Users\Mypc\package-lock.json)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
