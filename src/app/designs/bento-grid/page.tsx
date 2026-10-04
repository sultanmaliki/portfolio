import type { Metadata } from "next";
import BentoGridDesign from "@/designs/bento-grid";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("bento-grid");

export default function Page() {
  return <BentoGridDesign />;
}
