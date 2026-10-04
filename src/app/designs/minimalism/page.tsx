import type { Metadata } from "next";
import MinimalismDesign from "@/designs/minimalism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("minimalism");

export default function Page() {
  return <MinimalismDesign />;
}
