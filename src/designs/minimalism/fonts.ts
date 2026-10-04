import localFont from "next/font/local";

// Hanken Grotesk (variable, latin, OFL). One family at a few weights is the whole type system.
export const sans = localFont({
  src: "./fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-minimal",
});
