'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

// Define the type here or import from a shared types file
// Using any for now to speed up, but should be typed properly
interface ListingCardProps {
  listing: any;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/marketplace/listing/${listing.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full bg-gray-100">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
          {listing.isPromoted && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
              <p className="text-sm text-muted-foreground">{listing.category?.name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-xl font-bold text-primary">
            {formatCurrency(Number(listing.price))}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{listing.location || 'Location not specified'}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
            {listing.seller?.name && (
                <span>by {listing.seller.name}</span>
            )}
        </CardFooter>
      </Card>
    </Link>
  );
}
