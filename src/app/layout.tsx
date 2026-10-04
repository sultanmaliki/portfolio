import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import SiteChrome from "@/components/SiteChrome";
import { SITE_URL, portfolio, seo } from "@/data";
import { jsonLdScript, personJsonLd } from "@/lib/seo";
import "./globals.css";

// Self-hosted (Inter variable, latin, OFL) so builds never depend on fetching Google Fonts.
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const { profile } = portfolio;

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  alternates: { canonical: "/" },

  title: {
    default: seo.title,
    template: `%s | ${profile.name}`,
  },

  description: seo.description,

  keywords: seo.keywords,

  authors: [{ name: profile.name }],

  creator: profile.name,

  openGraph: {
    type: "website",
    locale: "en_US",
    title: seo.shortTitle,
    description: seo.shareDescription,
    url: SITE_URL,
    siteName: profile.name,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${profile.name} Portfolio`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: seo.shortTitle,
    description: seo.twitterDescription,
    images: ["/og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd()) }}
        />
        <noscript>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "#121212",
              color: "#F5F5F5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "24px",
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <h1 style={{ fontWeight: 300, margin: 0 }}>{profile.name}</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>
              {profile.tagline[1]} &middot; {profile.tagline[0]}
            </p>
            <p style={{ margin: 0, opacity: 0.7 }}>This portfolio is an interactive scroll experience and needs JavaScript.</p>
            <p style={{ margin: 0 }}>
              {profile.links.map((link, i) => (
                <span key={link.id}>
                  {i > 0 && <> &middot; </>}
                  <a href={link.href} style={{ color: "#6EA8FF" }}>
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </noscript>
        <Providers>
          {children}
          <SiteChrome />
        </Providers>
      </body>
    </html>
  );
}
