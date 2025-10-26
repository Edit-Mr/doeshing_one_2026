import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";
import type {
  PhotoAsset,
  PhotoCollection,
  PhotoCollectionFrontmatter,
} from "@/types/photography";
import { getReadingTime } from "./utils";
import { renderMarkdown } from "./mdx";

const PHOTOGRAPHY_DIR = path.join(process.cwd(), "content", "photography");

function normalizeImages(images: unknown): PhotoAsset[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const { src, alt, caption, width, height, orientation } = item as Record<
        string,
        unknown
      >;

      if (typeof src !== "string" || typeof alt !== "string") {
        return null;
      }

      return {
        src,
        alt,
        caption: typeof caption === "string" ? caption : undefined,
        width: typeof width === "number" ? width : undefined,
        height: typeof height === "number" ? height : undefined,
        orientation:
          orientation === "landscape" ||
          orientation === "portrait" ||
          orientation === "square"
            ? orientation
            : undefined,
      };
    })
    .filter(Boolean) as PhotoAsset[];
}

export async function getPhotoCollectionSlugs(): Promise<string[]> {
  try {
    await fs.access(PHOTOGRAPHY_DIR);
    const files = await fs.readdir(PHOTOGRAPHY_DIR);
    return files
      .filter((file) => /\.mdx?$/.test(file))
      .filter((file) => !file.startsWith("_"))
      .map((file) => file.replace(/\.mdx?$/, ""));
  } catch (error) {
    console.error(`Error reading photography directory ${PHOTOGRAPHY_DIR}:`, error);
    return [];
  }
}

export async function loadPhotoCollection(slug: string): Promise<PhotoCollection> {
  return unstable_cache(
    async () => {
      const filePath = path.join(PHOTOGRAPHY_DIR, `${slug}.md`);
      const fallback = path.join(PHOTOGRAPHY_DIR, `${slug}.mdx`);

      const fileContents = await fs
        .readFile(filePath, "utf8")
        .catch(async () => fs.readFile(fallback, "utf8"));

      const { data, content } = matter(fileContents);
      const { html } = await renderMarkdown(content);

      const record = data as Record<string, unknown>;
      const images = normalizeImages(record.images);

      if (typeof record.title !== "string") {
        throw new Error(`Photography entry "${slug}" is missing a title`);
      }
      if (typeof record.date !== "string") {
        throw new Error(`Photography entry "${slug}" is missing a date`);
      }
      if (typeof record.coverImage !== "string") {
        throw new Error(`Photography entry "${slug}" is missing a cover image`);
      }

      const frontmatter: PhotoCollectionFrontmatter = {
        ...record,
        title: record.title,
        date: record.date,
        coverImage: record.coverImage,
        description:
          typeof record.description === "string" ? record.description : undefined,
        location:
          typeof record.location === "string" ? record.location : undefined,
        camera: typeof record.camera === "string" ? record.camera : undefined,
        lens: typeof record.lens === "string" ? record.lens : undefined,
        tags: Array.isArray(record.tags)
          ? (record.tags as unknown[]).filter(
              (tag): tag is string => typeof tag === "string",
            )
          : undefined,
        featured:
          typeof record.featured === "boolean" ? record.featured : undefined,
        images,
      };

      return {
        slug,
        frontmatter,
        content,
        html,
        readingTime: getReadingTime(content),
      };
    },
    [`photo-collection-${slug}`],
    {
      revalidate: 3600,
      tags: ["photography", `photo-${slug}`],
    },
  )();
}

export async function loadAllPhotoCollections(): Promise<PhotoCollection[]> {
  try {
    const slugs = await getPhotoCollectionSlugs();
    if (!slugs.length) {
      return [];
    }

    const collections = await Promise.all(
      slugs.map((slug) => loadPhotoCollection(slug)),
    );

    return collections.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading photography collections:", error);
    return [];
  }
}
