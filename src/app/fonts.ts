import {
  Inter,
  Merriweather,
  Playfair_Display,
  Roboto,
} from "next/font/google";
import localFont from "next/font/local";

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

// Fira Code - 使用本地 Variable Font (支援 ligatures)
export const firaCode = localFont({
  src: "../../public/fonts/Fira_Code_v6.2/woff2/FiraCode-VF.woff2",
  variable: "--font-fira-code",
  display: "swap",
  weight: "300 700", // Variable font 支援 300-700 字重範圍
});

// DM Serif Display - 用於 Header masthead - WOFF2 compressed
export const dmSerifDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/DM_Serif_Display/DMSerifDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/DM_Serif_Display/DMSerifDisplay-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-dm-serif-display",
  display: "swap",
});

// Traditional Chinese version (主要使用) - WOFF2 compressed
export const genRyuMin = localFont({
  src: [
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-EL.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-L.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-R.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-M.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-SB.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-B.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-woff2/GenRyuMin2TW-H.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-genryumin",
  display: "swap",
});

// Japanese version (for Japanese content) - WOFF2 compressed
export const genRyuMinJP = localFont({
  src: [
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-EL.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-L.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-R.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-M.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-SB.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-B.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-woff2/GenRyuMin2JP-H.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-genryumin-jp",
  display: "swap",
});

export const fontVariables = [
  playfair.variable,
  merriweather.variable,
  inter.variable,
  roboto.variable,
  firaCode.variable,
  dmSerifDisplay.variable,
  genRyuMin.variable,
  genRyuMinJP.variable,
].join(" ");
