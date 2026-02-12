import { notFound } from "next/navigation";
import { getUserProfile, getUserListings, getUserReviews } from "@/lib/actions/users";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  Package,
  MessageCircle,
  Shield,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: UserProfilePageProps) {
  const profile = await getUserProfile(params.id);
  if (!profile) return { title: "User Not Found" };

  return {
    title: `${profile.name} | Sabeh Market`,
    description: `View ${profile.name}'s profile, listings, and reviews on Sabeh Market.`,
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const profile = await getUserProfile(params.id);

  if (!profile) {
    notFound();
  }

  const userListings = await getUserListings(params.id, 8);
  const userReviews = await getUserReviews(params.id);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="container py-8 md:py-12">
        {/* Profile Header */}
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f] flex items-center justify-center text-5xl font-bold text-white shadow-lg ring-4 ring-[#FCDD09]/20">
                {profile.name[0]}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[#1a2d4a]">{profile.name}</h1>
                  {profile.verificationStatus === "VERIFIED" && (
                    <Badge className="bg-[#FCDD09]/20 text-[#FCDD09] border-[#FCDD09]/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#FCDD09]" />
                    Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#faf8f5]">
                    <Package className="h-6 w-6 text-[#1a2d4a]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1a2d4a] tabular-nums">
                      {profile.stats.totalListings}
                    </p>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Listings</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#faf8f5]">
                    <Star className="h-6 w-6 text-[#FCDD09]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1a2d4a] tabular-nums">
                      {profile.stats.avgRating.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                      {profile.stats.totalReviews} Reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button className="bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a] font-bold">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button variant="outline" className="border-gray-300">
                  <Shield className="h-4 w-4 mr-2" />
                  Report User
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a2d4a]">Active Listings</h2>
            {profile.stats.totalListings > 8 && (
              <Link href={`/search?seller=${params.id}`}>
                <Button variant="outline" className="border-[#FCDD09] text-[#1a2d4a] hover:bg-[#FCDD09]/10">
                  View All ({profile.stats.totalListings})
                </Button>
              </Link>
            )}
          </div>

          {userListings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600">This user has no active listings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={Number(listing.price)}
                  currency={listing.currency}
                  image={listing.images && listing.images.length > 0 ? listing.images[0] : null}
                  location={listing.city}
                  condition={listing.condition || "USED_GOOD"}
                  category={listing.category?.name || "Category"}
                />
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1a2d4a] mb-6">Reviews</h2>

          {userReviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => (
                <div key={review.id}>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1a2d4a] to-[#2d4a6f] flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                      {review.reviewer.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-[#1a2d4a]">{review.reviewer.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-[#FCDD09] text-[#FCDD09]"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.title && (
                        <p className="font-semibold text-sm text-[#1a2d4a] mb-1">{review.title}</p>
                      )}
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      {review.listing && (
                        <Link
                          href={`/listings/${review.listing.id}`}
                          className="text-xs text-[#FCDD09] hover:underline mt-2 inline-block"
                        >
                          Review for: {review.listing.title}
                        </Link>
                      )}
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
