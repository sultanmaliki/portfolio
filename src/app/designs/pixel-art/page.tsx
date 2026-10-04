import type { Metadata } from "next";
import PixelArtDesign from "@/designs/pixel-art";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("pixel-art");

export default function Page() {
  return <PixelArtDesign />;
}
