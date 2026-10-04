import localFont from "next/font/local";

// Lora (variable, latin, OFL): a calm, slightly uneven book serif that suits quiet pages.
export const wabiSerif = localFont({
  src: [
    { path: "./fonts/lora-latin-wght-normal.woff2", style: "normal", weight: "400 700" },
    { path: "./fonts/lora-latin-wght-italic.woff2", style: "italic", weight: "400 700" },
  ],
  display: "swap",
  variable: "--font-wabi",
});
