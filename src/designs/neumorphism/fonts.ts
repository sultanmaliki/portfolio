import localFont from "next/font/local";

// Quicksand (variable, latin, OFL): rounded and soft, which is what an extruded surface wants.
export const rounded = localFont({
  src: "./fonts/quicksand-latin-wght-normal.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-neu",
});
