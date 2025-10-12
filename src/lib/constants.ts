export const SITE_NAME = "Doeshing — Editorial Portfolio";
export const SITE_DESCRIPTION =
  "A magazine-inspired personal site featuring blog posts, projects, and credentials.";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = [
  {
    platform: "GitHub",
    href: "https://github.com/doeshing",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    href: "https://www.linkedin.com/in/doeshing",
    icon: "linkedin",
  },
  {
    platform: "Twitter",
    href: "https://twitter.com/doeshing",
    icon: "twitter",
  },
  {
    platform: "Medium",
    href: "https://medium.com/@doeshing",
    icon: "pen",
  },
] as const;

export const FEATURED_POST_LIMIT = 3;
export const FEATURED_PROJECT_LIMIT = 3;
export const POSTS_PER_PAGE = 9;
