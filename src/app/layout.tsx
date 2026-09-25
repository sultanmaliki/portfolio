import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import "./globals.css";

// Self-hosted (Inter variable, latin, OFL) so builds never depend on fetching Google Fonts.
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://portfolio.syedmohammedsultan.online/";

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

// Structured data so search engines can connect the site to the person.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Syed Mohammed Sultan",
  url: SITE_URL,
  image: `${SITE_URL}og.jpg`,
  jobTitle: "Full Stack Developer",
  email: "mailto:ssultanmaliki47@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Bhatkal", addressRegion: "Karnataka", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Anjuman Institute of Technology and Management (VTU)" },
  knowsAbout: ["Java", "Next.js", "React", "TypeScript", "Node.js", "Kotlin", "LLM integration"],
  sameAs: ["https://github.com/sultanmaliki", "https://www.linkedin.com/in/syedmohammedsultan"],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  alternates: { canonical: "/" },

  title: {
    default: "Syed Mohammed Sultan | Full Stack Developer (Java, Next.js, AI)",
    template: "%s | Syed Mohammed Sultan",
  },

  description:
    "Computer Science graduate and full stack developer (Java, Next.js, NestJS, AI/LLM integration, Android). Open to entry-level software engineering roles, relocating to Bangalore.",

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
    "Bhatkal",
    "Karnataka",
    "Bangalore",
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
    title: "Syed Mohammed Sultan | Full Stack Developer",
    description:
      "Computer Science graduate and full stack developer. Java, Next.js, NestJS, AI/LLM integration and Android. Open to entry-level roles.",
    url: "https://portfolio.syedmohammedsultan.online/",
    siteName: "Syed Mohammed Sultan",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Syed Mohammed Sultan Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Syed Mohammed Sultan | Full Stack Developer",
    description:
      "Computer Science graduate and full stack developer. Open to entry-level roles.",
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
          // "<" is escaped so the JSON can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\u003c") }}
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
            <h1 style={{ fontWeight: 300, margin: 0 }}>Syed Mohammed Sultan</h1>
            <p style={{ margin: 0, opacity: 0.7 }}>Full Stack Java Developer &middot; Computer Science graduate</p>
            <p style={{ margin: 0, opacity: 0.7 }}>This portfolio is an interactive scroll experience and needs JavaScript.</p>
            <p style={{ margin: 0 }}>
              <a href="/resume.pdf" style={{ color: "#6EA8FF" }}>Resume</a> &middot;{" "}
              <a href="https://github.com/sultanmaliki" style={{ color: "#6EA8FF" }}>GitHub</a> &middot;{" "}
              <a href="https://www.linkedin.com/in/syedmohammedsultan" style={{ color: "#6EA8FF" }}>LinkedIn</a> &middot;{" "}
              <a href="mailto:ssultanmaliki47@gmail.com" style={{ color: "#6EA8FF" }}>Email</a>
            </p>
          </div>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}