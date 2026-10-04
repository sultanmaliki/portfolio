import type { Metadata } from "next";
import BohemianDesign from "@/designs/bohemian";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("bohemian");

export default function Page() {
  return <BohemianDesign />;
}
