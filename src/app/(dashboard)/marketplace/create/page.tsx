import { getCategories } from "@/lib/actions/marketplace";
import { ListingWizardContainer } from "@/components/marketplace/listing-wizard/listing-wizard-container";

export const metadata = {
  title: "Create Listing | Sabeh Importers",
  description: "List your item for sale on Sabeh Importers marketplace",
};

export default async function CreateListingPage() {
  // Fetch categories server-side
  const categories = await getCategories();

  return <ListingWizardContainer categories={categories} language="en" />;
}
