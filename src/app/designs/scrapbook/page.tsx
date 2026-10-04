import type { Metadata } from "next";
import ScrapbookDesign from "@/designs/scrapbook";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("scrapbook");

export default function Page() {
  return <ScrapbookDesign />;
}
