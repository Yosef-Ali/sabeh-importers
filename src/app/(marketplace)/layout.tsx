
import { Navbar } from "@/components/marketplace/navbar";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-ui antialiased">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
    </div>
  );
}
