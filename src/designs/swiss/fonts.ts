import localFont from "next/font/local";

// Inter Tight (variable, latin, OFL): the closest open relative of the Helvetica-style grotesques the movement used.
export const grotesk = localFont({
  src: "./fonts/inter-tight-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-swiss",
});
