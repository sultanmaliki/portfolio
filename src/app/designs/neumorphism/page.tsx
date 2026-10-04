import type { Metadata } from "next";
import NeumorphismDesign from "@/designs/neumorphism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("neumorphism");

export default function Page() {
  return <NeumorphismDesign />;
}
