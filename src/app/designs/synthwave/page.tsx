import type { Metadata } from "next";
import SynthwaveDesign from "@/designs/synthwave";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("synthwave");

export default function Page() {
  return <SynthwaveDesign />;
}
