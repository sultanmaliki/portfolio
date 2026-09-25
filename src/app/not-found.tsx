import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#121212] px-6 text-center text-[#F5F5F5]">
      <p className="text-sm font-light uppercase tracking-[0.3em] text-[#F5F5F5]/60">404</p>
      <h1 className="text-4xl font-light tracking-tight text-white md:text-6xl">This page doesn&apos;t exist.</h1>
      <Link
        href="/"
        className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
