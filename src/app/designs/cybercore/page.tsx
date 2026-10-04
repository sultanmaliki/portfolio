import type { Metadata } from "next";
import CybercoreDesign from "@/designs/cybercore";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("cybercore");

export default function Page() {
  return <CybercoreDesign />;
}
