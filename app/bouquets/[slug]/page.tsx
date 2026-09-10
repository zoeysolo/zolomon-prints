import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentByType, getContentBySlug } from "@/lib/content";
import Doc from "@/app/_components/Doc";

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentByType("bouquet").map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = getContentBySlug("bouquet", params.slug);
  if (!d) return {};
  return {
    title: d.title,
    description: d.description,
    alternates: { canonical: d.route },
    robots: d.noindex ? { index: false, follow: false } : undefined
  };
}

export default function BouquetPage({ params }: { params: { slug: string } }) {
  const d = getContentBySlug("bouquet", params.slug);
  if (!d) notFound();
  return <Doc doc={d} />;
}
