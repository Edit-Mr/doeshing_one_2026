import type { PhotoCollection } from "@/types/photography";
import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  collections: PhotoCollection[];
}

export function PhotoGrid({ collections }: PhotoGridProps) {
  if (!collections.length) {
    return (
      <div className="border border-dashed border-black/20 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-400">
        Photographs are loading soon.
      </div>
    );
  }

  return (
    <section className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
      {collections.map((collection) => (
        <div key={collection.slug} className="break-inside-avoid">
          <PhotoCard collection={collection} />
        </div>
      ))}
    </section>
  );
}
