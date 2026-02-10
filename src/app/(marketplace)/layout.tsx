
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabeh Market | Professional Marketplace",
  description: "Buy and sell products with confidence.",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Marketplace Header will go here */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-blue-600">Sabeh Market</div>
          {/* Search Bar & Actions */}
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:underline">Sign In</button>
            <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Post Ad
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-white py-10">
        <div className="container text-center text-sm text-gray-500">
          © 2026 Sabeh Importers. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
