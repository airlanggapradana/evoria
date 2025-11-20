/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
    ],
  },
  async rewrites() {
    // Validasi skeptis: Pastikan variabel ada
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.warn(
        "PERINGATAN: BACKEND_URL belum diset di environment variables!",
      );
    }

    return [
      {
        // Frontend akan menembak ke sini: /api/proxy/login
        source: "/api/proxy/:path*",
        // Next.js akan meneruskan ke: http://localhost:5000/login (Dev)
        // atau https://api-locketix.vercel.app/login (Prod)
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default config;
