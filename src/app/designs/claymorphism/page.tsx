import type { Metadata } from "next";
import ClaymorphismDesign from "@/designs/claymorphism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("claymorphism");

export default function Page() {
  return <ClaymorphismDesign />;
}
