import type { Metadata } from "next";
import SwissDesign from "@/designs/swiss";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("swiss");

export default function Page() {
  return <SwissDesign />;
}
