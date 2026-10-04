import localFont from "next/font/local";

// IM Fell English (a period display face, used for headings only) and EB Garamond (a readable book serif for text). Both OFL, latin.
export const fell = localFont({
  src: [
    { path: "./fonts/im-fell-english-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/im-fell-english-latin-400-italic.woff2", style: "italic", weight: "400" },
  ],
  display: "swap",
  variable: "--font-vic-fell",
});

export const garamond = localFont({
  src: [
    { path: "./fonts/eb-garamond-latin-wght-normal.woff2", style: "normal", weight: "400 800" },
    { path: "./fonts/eb-garamond-latin-wght-italic.woff2", style: "italic", weight: "400 800" },
  ],
  display: "swap",
  variable: "--font-vic-text",
});
