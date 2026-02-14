import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Rajdhani, Bebas_Neue, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: ["400"],
});
const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-ethiopic",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Sabeh Authority | Global Maritime Standards",
  description:
    "Authoritative commerce for the modern seafarer. High-trust trading platform for verified industrial and maritime assets.",
  keywords: [
    "marketplace",
    "ethiopia",
    "luxury",
    "cars",
    "property",
    "addis ababa",
    "import",
  ],
  authors: [{ name: "Sabeh Importers" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${rajdhani.variable} ${bebasNeue.variable} ${notoSansEthiopic.variable}`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
