import type { Metadata } from "next";
import SurrealismDesign from "@/designs/surrealism";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("surrealism");

export default function Page() {
  return <SurrealismDesign />;
}
