"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createListingSchema } from "@/lib/validations/listing";
import { createListing, updateListing } from "@/lib/actions/marketplace";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Extend schema for client-side form specific needs if any
const formSchema = createListingSchema.extend({
  // Override or add fields if necessary for the form specifically
});

export type ListingFormValues = z.infer<typeof formSchema>;

interface ListingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: any; // Partial listing for edit mode
  categories: { id: string; name: string }[];
  language?: "en" | "am";
}

export function ListingSheet({
  open,
  onOpenChange,
  listing,
  categories,
  language = "en",
}: ListingSheetProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<ListingFormValues> = {
    title: "",
    description: "",
    price: 0,
    currency: "ETB",
    negotiable: true,
    condition: "USED_GOOD",
    categoryId: "",
    city: "Addis Ababa",
    showPhone: true,
    ...listing, // Override with listing data if editing
  };

  // Convert price to number if it comes as string from DB
  if (defaultValues.price && typeof defaultValues.price === 'string') {
    defaultValues.price = parseFloat(defaultValues.price);
  }

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when listing changes (e.g., opening edit for different item)
  useEffect(() => {
    if (listing) {
      const resetValues = { ...listing };
       if (resetValues.price && typeof resetValues.price === 'string') {
        resetValues.price = parseFloat(resetValues.price);
      }
      form.reset(resetValues);
    } else {
       form.reset({
        title: "",
        description: "",
        price: 0,
        currency: "ETB",
        negotiable: true,
        condition: "USED_GOOD",
        categoryId: "",
        city: "Addis Ababa",
        showPhone: true,
      });
    }
  }, [listing, form]);

  async function onSubmit(data: ListingFormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'images' && Array.isArray(value)) {
             formData.append(key, JSON.stringify(value));
          } else {
             formData.append(key, String(value));
          }
        }
      });

      let result;
      if (listing?.id) {
        result = await updateListing(listing.id, formData);
      } else {
        result = await createListing(formData);
      }

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Success",
          description: listing?.id
            ? "Listing updated successfully"
            : "Listing created successfully",
        });
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEdit = !!listing?.id;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Listing" : "Create New Listing"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update your listing details below."
              : "Fill in the details to create a new listing."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Toyota Corolla 2022" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         <SelectItem value="NEW">New</SelectItem>
                         <SelectItem value="LIKE_NEW">Like New</SelectItem>
                         <SelectItem value="USED_GOOD">Used (Good)</SelectItem>
                         <SelectItem value="USED_FAIR">Used (Fair)</SelectItem>
                         <SelectItem value="FOR_PARTS">For Parts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         <SelectItem value="ETB">ETB</SelectItem>
                         <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             
             <FormField
              control={form.control}
              name="negotiable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Negotiable</FormLabel>
                    <FormDescription>
                      Is the price open to negotiation?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Addis Ababa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add more location fields if needed */}
             </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Listing" : "Create Listing"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
