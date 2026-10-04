import type { Metadata } from "next";
import CyberpunkDesign from "@/designs/cyberpunk";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("cyberpunk");

export default function Page() {
  return <CyberpunkDesign />;
}
