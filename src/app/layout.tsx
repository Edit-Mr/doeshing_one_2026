import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { fontVariables } from "./fonts";
import "@/styles/globals.css";

const siteName = "Doeshing — Editorial Portfolio";
const siteDescription =
  "Personal magazine-inspired portfolio for Doeshing featuring articles, projects, resume, and contact.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "Doeshing",
    "Editorial",
    "Portfolio",
    "Blog",
    "Resume",
  ],
  authors: [{ name: "Doeshing" }],
  creator: "Doeshing",
  publisher: "Doeshing",
  metadataBase:
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http") &&
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  openGraph: {
    title: siteName,
    description: siteDescription,
    locale: "zh-TW",
    type: "website",
    siteName,
    images: [{ url: "/images/og-default.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/images/og-default.svg"],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={fontVariables} suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3252699819735273"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-newspaper-paper text-newspaper-ink antialiased dark:bg-zinc-900 dark:text-zinc-100" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
