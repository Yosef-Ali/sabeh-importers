'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createListing } from '@/actions/marketplace';

const initialState: { error?: string; success?: boolean; listingId?: string } = {};

export default function CreateListingPage() {
  const [state, formAction] = useFormState(createListing, initialState);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-[#1a2d4a]">Create New Listing</h1>
      
      <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <Input id="title" name="title" placeholder="What are you selling?" required />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (ETB)</label>
          <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" required />
        </div>

        <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
            <select 
                id="categoryId" 
                name="categoryId" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
            >
                <option value="">Select a category</option>
                <option value="motors">Motors</option>
                <option value="property">Property</option>
                <option value="jobs">Jobs</option>
                <option value="classifieds">Classifieds</option>
            </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea id="description" name="description" placeholder="Describe your item..." rows={5} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">Location</label>
          <Input id="location" name="location" placeholder="e.g. Bole, Addis Ababa" />
        </div>

        {state?.error && (
            <div className="text-red-500 text-sm">{state.error}</div>
        )}

        <Button type="submit" className="w-full bg-[#FCDD09] hover:bg-[#C4AB00] text-[#1a2d4a] font-bold">
          Publish Listing
        </Button>
      </form>
    </div>
  );
}
