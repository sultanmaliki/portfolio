import type { Metadata } from "next";
import ConceptualSketchDesign from "@/designs/conceptual-sketch";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("conceptual-sketch");

export default function Page() {
  return <ConceptualSketchDesign />;
}
