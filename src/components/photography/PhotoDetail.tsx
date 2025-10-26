import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { RenderedMarkdown } from "@/components/mdx/RenderedMarkdown";
import { cn, formatDate } from "@/lib/utils";
import type { PhotoCollection } from "@/types/photography";

interface PhotoDetailProps {
  collection: PhotoCollection;
}

export function PhotoDetail({ collection }: PhotoDetailProps) {
  const { frontmatter, html } = collection;
  const images = frontmatter.images ?? [];

  const aspectClass = (orientation?: string) => {
    switch (orientation) {
      case "portrait":
        return "aspect-[3/4]";
      case "square":
        return "aspect-square";
      default:
        return "aspect-[3/2]";
    }
  };

  return (
    <article className="space-y-12">
      <header className="space-y-6 border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
          <span>{formatDate(frontmatter.date, "EEEE, MMMM d, yyyy")}</span>
          {frontmatter.location ? (
            <>
              <span>&middot;</span>
              <span>{frontmatter.location}</span>
            </>
          ) : null}
          <span>&middot;</span>
          <span>{images.length} frames</span>
        </div>

        <h1 className="font-serif text-4xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-5xl">
          {frontmatter.title}
        </h1>

        {frontmatter.description ? (
          <p className="max-w-2xl text-base text-newspaper-gray dark:text-zinc-400">
            {frontmatter.description}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {frontmatter.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <dl className="grid gap-4 text-xs uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400 sm:grid-cols-3">
          {frontmatter.camera ? (
            <div className="flex flex-col gap-1">
              <dt>Camera</dt>
              <dd className="font-semibold text-newspaper-ink dark:text-zinc-100 tracking-[0.2em]">
                {frontmatter.camera}
              </dd>
            </div>
          ) : null}
          {frontmatter.lens ? (
            <div className="flex flex-col gap-1">
              <dt>Lens</dt>
              <dd className="font-semibold text-newspaper-ink dark:text-zinc-100 tracking-[0.2em]">
                {frontmatter.lens}
              </dd>
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <dt>Series</dt>
            <dd className="font-semibold text-newspaper-ink dark:text-zinc-100 tracking-[0.2em]">
              {formatDate(frontmatter.date, "MMM yyyy")}
            </dd>
          </div>
        </dl>
      </header>

      <div className="relative aspect-[21/9] w-full overflow-hidden border border-black/10 bg-white shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <Image
          src={frontmatter.coverImage}
          alt={frontmatter.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {html ? (
        <RenderedMarkdown
          html={html}
          className="prose prose-lg max-w-none border border-black/10 bg-white px-6 py-10 text-newspaper-gray shadow-editorial prose-headings:font-serif prose-headings:tracking-tight dark:prose-invert dark:border-white/10 dark:bg-zinc-900"
        />
      ) : null}

      {images.length ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border border-black/10 bg-white px-6 py-4 text-xs uppercase tracking-[0.32em] text-newspaper-gray dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400">
            <span>Contact sheet</span>
            <span>{images.length} frames</span>
          </div>
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {images.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                className="mb-6 break-inside-avoid"
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900",
                    aspectClass(image.orientation),
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                    loading={index > 2 ? "lazy" : "eager"}
                  />
                </div>
                {image.caption ? (
                  <figcaption className="mt-3 text-xs uppercase tracking-[0.28em] text-newspaper-gray dark:text-zinc-400">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
