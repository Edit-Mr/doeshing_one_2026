import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoDetail } from "@/components/photography/PhotoDetail";
import {
  getPhotoCollectionSlugs,
  loadPhotoCollection,
} from "@/lib/photography";

interface PhotoCollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPhotoCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PhotoCollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await loadPhotoCollection(slug).catch(() => null);
  if (!collection) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : undefined;

  const url = baseUrl ? `${baseUrl}/gallery/${collection.slug}` : undefined;

  return {
    title: `${collection.frontmatter.title} — Photography`,
    description:
      collection.frontmatter.description ??
      `Photography series from ${collection.frontmatter.location ?? "the field"}.`,
    openGraph: {
      title: collection.frontmatter.title,
      description:
        collection.frontmatter.description ??
        `Photography series from ${collection.frontmatter.location ?? "the field"}.`,
      type: "article",
      url,
      images: collection.frontmatter.coverImage
        ? [{ url: collection.frontmatter.coverImage }]
        : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PhotoCollectionPage({
  params,
}: PhotoCollectionPageProps) {
  const { slug } = await params;
  const collection = await loadPhotoCollection(slug).catch(() => null);

  if (!collection) {
    notFound();
  }

  return <PhotoDetail collection={collection} />;
}
