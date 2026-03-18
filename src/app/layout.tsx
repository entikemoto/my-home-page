import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Takeshi Ikemoto — 医療×経営×テクノロジー",
    template: "%s | Takeshi Ikemoto",
  },
  description:
    "Takeshi Ikemoto の公式サイト。医療×経営×テクノロジーの視点から、AIと次の医療を考える。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSerifJP.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
