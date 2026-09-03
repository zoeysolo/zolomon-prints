import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/content";
import Doc from "@/app/_components/Doc";

function doc() {
  return getContentBySlug("service", "scanography");
}

export function generateMetadata(): Metadata {
  const d = doc();
  if (!d) return {};
  return {
    title: d.title,
    description: d.description,
    alternates: { canonical: d.route },
    robots: d.noindex ? { index: false, follow: false } : undefined
  };
}

export default function ScanographyPage() {
  const d = doc();
  if (!d) notFound();
  return <Doc doc={d} />;
}
