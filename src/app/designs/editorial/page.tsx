import type { Metadata } from "next";
import EditorialDesign from "@/designs/editorial";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("editorial");

export default function Page() {
  return <EditorialDesign />;
}
