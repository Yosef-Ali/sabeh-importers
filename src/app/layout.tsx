import type { Metadata } from "next";
import { Inter, Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sabeh Importers | ሳቤህ ኢምፖርተርስ",
  description:
    "Import & Distribution Management System for Sabeh Importers Ethiopia",
  keywords: [
    "import",
    "distribution",
    "ethiopia",
    "inventory",
    "management",
    "wholesale",
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} ${inter.variable} ${montserrat.variable} ${cormorantGaramond.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
