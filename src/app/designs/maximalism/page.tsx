import type { Metadata } from "next";
import MaximalismDesign from "@/designs/maximalism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("maximalism");

export default function Page() {
  return <MaximalismDesign />;
}
