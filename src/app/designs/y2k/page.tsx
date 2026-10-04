import type { Metadata } from "next";
import Y2kDesign from "@/designs/y2k";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("y2k");

export default function Page() {
  return <Y2kDesign />;
}
