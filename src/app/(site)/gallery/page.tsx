import type { Metadata } from "next";
import { PhotoGrid } from "@/components/photography/PhotoGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loadAllPhotoCollections } from "@/lib/photography";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "A rolling stream of contact sheets—cities, light, and quiet details captured on the move.",
};

export const revalidate = 60;

export default async function PhotographyGalleryPage() {
  const collections = await loadAllPhotoCollections();

  if (!collections.length) {
    return (
      <div className="space-y-12">
        <SectionHeading
          kicker="Photography"
          title="Contact sheets in progress"
          description="The feed is still developing. Check back soon for new frames."
          align="center"
        />
      </div>
    );
  }

  const tags = Array.from(
    new Set(collections.flatMap((item) => item.frontmatter.tags ?? [])),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-10">
      <header className="space-y-6 text-center">
        <SectionHeading
          kicker="Photography Journal"
          title="A waterfall of field notes and light studies"
          description="Scroll through the latest frames sequenced like an Instagram roll—hover for captions, tap through for full contact sheets."
          align="center"
        />
        {tags.length ? (
          <div className="flex flex-wrap justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-black/10 px-3 py-1 transition hover:border-newspaper-ink hover:text-newspaper-ink dark:border-white/10 dark:hover:border-zinc-200 dark:hover:text-zinc-100"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <PhotoGrid collections={collections} />
    </div>
  );
}
