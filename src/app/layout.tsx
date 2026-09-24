import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.syedmohammedsultan.online/"), // Replace with your actual domain

  title: {
    default: "Syed Mohammed Sultan",
    template: "%s | Syed Mohammed Sultan",
  },

  description:
    "Computer Science graduate and Full Stack Java Developer building immersive web experiences with Next.js, Java, AI, and modern frontend technologies.",

  keywords: [
    "Syed Mohammed Sultan",
    "Sultan",
    "Portfolio",
    "Full Stack Java Developer",
    "Java",
    "Next.js",
    "React",
    "TypeScript",
    "AI",
    "Framer Motion",
    "Software Engineer",
  ],

  authors: [
    {
      name: "Syed Mohammed Sultan",
    },
  ],

  creator: "Syed Mohammed Sultan",

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Syed Mohammed Sultan",
    description:
      "Computer Science graduate building immersive digital experiences with Java, AI, and modern web technologies.",
    url: "https://portfolio.syedmohammedsultan.online/",
    siteName: "Syed Mohammed Sultan",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Syed Mohammed Sultan Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Syed Mohammed Sultan",
    description:
      "Computer Science graduate building immersive digital experiences.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}