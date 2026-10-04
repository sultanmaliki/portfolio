import type { Metadata } from "next";
import LuxuryTypographyDesign from "@/designs/luxury-typography";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("luxury-typography");

export default function Page() {
  return <LuxuryTypographyDesign />;
}
