import { ListingFeed } from '@/components/marketplace/listing-feed';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2d4a]">Sabeh Market</h1>
          <p className="text-muted-foreground">Buy and sell items within the community.</p>
        </div>
        <Link href="/marketplace/create">
          <Button className="bg-[#1a2d4a] hover:bg-[#2d4a6f] text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post Ad
          </Button>
        </Link>
      </div>

      <ListingFeed />
    </div>
  );
}
