import type { Metadata } from "next";
import EtherealDesign from "@/designs/ethereal";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("ethereal");

export default function Page() {
  return <EtherealDesign />;
}
