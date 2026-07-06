import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      /*
        Supabase Storage — covers, chapter images, poem images.
        Replace YOUR_PROJECT_REF with your actual Supabase project reference
        (found in Settings → API → Project URL).
        e.g. "abcdefghijklmnop.supabase.co"
      */
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
