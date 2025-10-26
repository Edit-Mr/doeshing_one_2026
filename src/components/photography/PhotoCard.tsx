import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import type { PhotoCollection } from "@/types/photography";

interface PhotoCardProps {
  collection: PhotoCollection;
  highlight?: boolean;
}

export function PhotoCard({ collection, highlight = false }: PhotoCardProps) {
  const { frontmatter } = collection;

  return (
    <article
      className={cn(
        "group flex flex-col border border-black/10 bg-white shadow-sm shadow-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-editorial dark:border-white/10 dark:bg-zinc-900",
        highlight && "md:col-span-2",
      )}
    >
      <Link
        href={`/gallery/${collection.slug}`}
        className="relative aspect-[3/2] overflow-hidden border-b border-black/10 dark:border-white/10"
      >
        <Image
          src={frontmatter.coverImage}
          alt={frontmatter.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {frontmatter.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {frontmatter.location ? (
            <Badge variant="accent">{frontmatter.location}</Badge>
          ) : null}
        </div>

        <h3 className="mt-5 font-serif text-2xl tracking-tight text-newspaper-ink transition-colors duration-200 group-hover:text-newspaper-accent dark:text-zinc-50 dark:group-hover:text-red-400">
          <Link href={`/gallery/${collection.slug}`}>{frontmatter.title}</Link>
        </h3>

        {frontmatter.description ? (
          <p className="mt-3 text-sm text-newspaper-gray dark:text-zinc-400">
            {frontmatter.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
          <span>{formatDate(frontmatter.date, "MMM yyyy")}</span>
          <span className="flex gap-3">
            {frontmatter.camera ? <span>{frontmatter.camera}</span> : null}
            {frontmatter.lens ? <span>{frontmatter.lens}</span> : null}
          </span>
        </div>
      </div>
    </article>
  );
}
