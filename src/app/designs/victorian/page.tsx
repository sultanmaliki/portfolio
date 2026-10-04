import type { Metadata } from "next";
import VictorianDesign from "@/designs/victorian";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("victorian");

export default function Page() {
  return <VictorianDesign />;
}
