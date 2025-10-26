import type { Metadata } from "next";
import { PhotoGrid } from "@/components/photography/PhotoGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loadAllPhotoCollections } from "@/lib/photography";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Editorial contact sheets and visual dispatches documenting cities, light, and the texture of everyday systems.",
};

export const revalidate = 60;

export default async function PhotographyGalleryPage() {
  const collections = await loadAllPhotoCollections();

  return (
    <div className="space-y-12">
      <SectionHeading
        kicker="Photography"
        title="Contact sheets from the road and the studio"
        description="Series-based storytelling that follows the same editorial craft: considered typography, narrative captions, and cinematic pacing."
      />

      <div className="border border-black/10 bg-white px-6 py-6 text-sm text-newspaper-gray shadow-editorial dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 sm:px-10 sm:py-8">
        <p>
          Every series is sequenced like a magazine spread—anchored by a hero frame,
          supported by contextual notes, and paced with captions that read more like
          field annotations than social posts. Gear details sit alongside location
          stamps so the narrative and the technical decisions stay in dialogue.
        </p>
      </div>

      <PhotoGrid collections={collections} featuredCount={2} />
    </div>
  );
}
