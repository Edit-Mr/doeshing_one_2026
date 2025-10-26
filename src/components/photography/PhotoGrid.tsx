import type { PhotoCollection } from "@/types/photography";
import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  collections: PhotoCollection[];
  featuredCount?: number;
}

export function PhotoGrid({
  collections,
  featuredCount,
}: PhotoGridProps) {
  if (!collections.length) {
    return (
      <div className="border border-dashed border-black/20 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-400">
        Photographs are loading soon.
      </div>
    );
  }

  const featured = collections
    .filter((item) => item.frontmatter.featured)
    .slice(0, featuredCount ?? collections.length);

  const remainder = collections.filter((item) => {
    if (item.frontmatter.featured) {
      return !featured.includes(item);
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-12">
      {featured.length ? (
        <section className="grid gap-6 md:grid-cols-2">
          {featured.map((collection) => (
            <PhotoCard
              key={collection.slug}
              collection={collection}
              highlight
            />
          ))}
        </section>
      ) : null}
      {remainder.length ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {remainder.map((collection) => (
            <PhotoCard
              key={collection.slug}
              collection={collection}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
