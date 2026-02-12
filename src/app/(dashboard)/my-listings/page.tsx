import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getUserListings } from "@/lib/actions/marketplace";
import { DeleteListingButton } from "@/components/marketplace/delete-listing-button";
import { PlaceholderImage } from "@/components/marketplace/placeholder-image";

export default async function MyListingsPage() {
  // In a real app, get userId from session
  const userId = "1";
  const { data: listings } = await getUserListings(userId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2d4a]">
            My Listings
          </h1>
          <p className="text-muted-foreground">
            Manage your marketplace advertisements
          </p>
        </div>
        <Link href="/marketplace/create">
          <Button className="bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total Listings
          </div>
          <div className="mt-2 text-3xl font-bold">
            {listings?.length || 0}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Active
          </div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {listings?.filter((l) => l.status === "ACTIVE").length || 0}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Pending
          </div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {listings?.filter((l) => l.status === "PENDING_REVIEW").length || 0}
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!listings || listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    <p>No listings yet</p>
                    <Link href="/marketplace/create">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#FCDD09] text-[#1a2d4a] hover:bg-[#FCDD09]/10"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create your first listing
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      {listing.images && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <PlaceholderImage category={listing.category.name} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell className="capitalize">
                    {listing.category.name}
                  </TableCell>
                  <TableCell className="font-bold text-[#1a2d4a]">
                    {Number(listing.price).toLocaleString()} ETB
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === "ACTIVE"
                          ? "success"
                          : listing.status === "PENDING_REVIEW"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {listing.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/marketplace/create?edit=${listing.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-[#1a2d4a]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteListingButton listingId={listing.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
