import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PhotoCollection } from "@/types/photography";

interface PhotoCardProps {
  collection: PhotoCollection;
}

export function PhotoCard({ collection }: PhotoCardProps) {
  const { frontmatter } = collection;
  const orientation =
    frontmatter.coverOrientation ??
    frontmatter.images?.[0]?.orientation ??
    "landscape";

  const aspectClass =
    orientation === "portrait"
      ? "aspect-[4/5]"
      : orientation === "square"
        ? "aspect-square"
        : "aspect-[3/2]";

  return (
    <article className="group relative mb-6 overflow-hidden rounded-sm border border-black/10 bg-black/5 transition-transform duration-500 ease-out hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
      <Link
        href={`/gallery/${collection.slug}`}
        className="relative block overflow-hidden"
      >
        <div className={`relative ${aspectClass}`}>
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 30vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={frontmatter.featured}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 px-4 pb-4 pt-16 text-newspaper-paper">
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-newspaper-paper/80">
            {frontmatter.location ? <span>{frontmatter.location}</span> : null}
            <span>{formatDate(frontmatter.date, "MMM yyyy").toUpperCase()}</span>
          </div>
          <h3 className="font-serif text-xl tracking-tight text-newspaper-paper transition-colors duration-300 group-hover:text-white">
            {frontmatter.title}
          </h3>
          {frontmatter.tags?.length ? (
            <p className="text-[10px] uppercase tracking-[0.32em] text-newspaper-paper/70">
              {frontmatter.tags.slice(0, 4).join(" · ")}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
