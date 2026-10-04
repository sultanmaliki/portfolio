import { SITE_URL, portfolio, seo } from "@/data";

/** schema.org Person for the page's JSON-LD, built from the content store. */
export function personJsonLd() {
  const { profile, education } = portfolio;
  const sameAs = profile.links.filter((l) => l.id === "github" || l.id === "linkedin").map((l) => l.href);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    image: `${SITE_URL}og.jpg`,
    jobTitle: profile.jobTitle,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: profile.location.country,
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: education[0].institution },
    knowsAbout: seo.knowsAbout,
    sameAs,
  };
}

/** Serialises JSON-LD for a <script> tag. "<" is escaped so the JSON can never close the tag. */
export const jsonLdScript = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
