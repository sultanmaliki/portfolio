import type { Metadata } from "next";
import { seo } from "@/data";
import { findDesign } from "./registry";

/**
 * Metadata for a design's route. Every design shows the same content, so each one points its
 * canonical URL at "/" and search engines index a single page.
 */
export function designMetadata(slug: string): Metadata {
  const design = findDesign(slug);
  if (!design) throw new Error(`Unknown design "${slug}". Add it to src/designs/registry.ts.`);
  return {
    title: `${design.name} design`,
    description: seo.description,
    alternates: { canonical: "/" },
  };
}
