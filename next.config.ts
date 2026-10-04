import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  experimental: {
    // Every portfolio design is its own route with its own CSS and fonts. With the default chunking,
    // Turbopack merges all of that CSS into one shared chunk, and next/font then preloads the fonts of
    // every design on every page (about 1.7 MB). "graph" groups CSS per route instead, so a visitor
    // downloads only the fonts and styles of the design they open. Verify with a build: a design page
    // should preload two or three font files, not fifty.
    cssChunking: "graph",
  },
};

export default nextConfig;
