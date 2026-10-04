import type { Metadata } from "next";
import __COMPONENT__ from "@/designs/__SLUG__";
import { designMetadata } from "@/designs/metadata";

export const metadata: Metadata = designMetadata("__SLUG__");

export default function Page() {
  return <__COMPONENT__ />;
}
