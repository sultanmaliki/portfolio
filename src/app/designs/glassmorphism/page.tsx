import type { Metadata } from "next";
import GlassmorphismDesign from "@/designs/glassmorphism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("glassmorphism");

export default function Page() {
  return <GlassmorphismDesign />;
}
