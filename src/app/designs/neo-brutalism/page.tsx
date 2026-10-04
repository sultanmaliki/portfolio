import type { Metadata } from "next";
import NeoBrutalismDesign from "@/designs/neo-brutalism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("neo-brutalism");

export default function Page() {
  return <NeoBrutalismDesign />;
}
