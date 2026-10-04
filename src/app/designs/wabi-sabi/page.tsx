import type { Metadata } from "next";
import WabiSabiDesign from "@/designs/wabi-sabi";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("wabi-sabi");

export default function Page() {
  return <WabiSabiDesign />;
}
