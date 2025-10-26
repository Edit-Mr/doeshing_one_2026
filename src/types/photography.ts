export type PhotoOrientation = "landscape" | "portrait" | "square";

export interface PhotoAsset {
  /**
   * Absolute or relative URL for the image asset.
   * Remote assets are supported via next/image remotePatterns.
   */
  src: string;
  /** Accessible alt text describing the image content. */
  alt: string;
  /** Optional caption rendered beneath the image. */
  caption?: string;
  /**
   * Optional intrinsic dimensions. When omitted we fall back to
   * next/image automatic sizing or CSS aspect ratios.
   */
  width?: number;
  height?: number;
  /** Visual orientation hint to control gallery layout balancing. */
  orientation?: PhotoOrientation;
}

export interface PhotoCollectionFrontmatter {
  title: string;
  description?: string;
  date: string;
  location?: string;
  camera?: string;
  lens?: string;
  tags?: string[];
  coverImage: string;
  coverOrientation?: PhotoOrientation;
  featured?: boolean;
  images: PhotoAsset[];
}

export interface PhotoCollection {
  slug: string;
  frontmatter: PhotoCollectionFrontmatter;
  content: string;
  html?: string;
  readingTime?: string;
}
