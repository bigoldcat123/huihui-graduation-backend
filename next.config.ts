import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains:["10.12.18.88"],
    remotePatterns:[
      new URL('http://10.12.18.88:8000/**'),
      {
        protocol:'http',
        hostname:'10.12.18.88',
        port:'8000',
        pathname:'/**'
      }
    ]
  }
};

export default nextConfig;
