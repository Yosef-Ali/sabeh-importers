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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { createListingSchema } from "@/lib/validations/listing";
import { createListing, updateListing } from "@/lib/actions/marketplace";
import { useAiStore } from "@/lib/store/ai-store";
import { useCompletion } from "@ai-sdk/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Info } from "lucide-react";

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

  const emptyDefaults: Partial<ListingFormValues> = {
    title: "",
    description: "",
    price: 0,
    currency: "ETB",
    negotiable: true,
    condition: "USED_GOOD",
    categoryId: "",
    city: "Addis Ababa",
    showPhone: true,
    images: [],
  };

  function normalizeListingValues(data: any): Partial<ListingFormValues> {
    return {
      ...emptyDefaults,
      ...data,
      price: data?.price ? parseFloat(String(data.price)) : 0,
      images: Array.isArray(data?.images) ? data.images : [],
      negotiable: data?.negotiable ?? true,
      showPhone: data?.showPhone ?? true,
    };
  }

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: listing ? normalizeListingValues(listing) : emptyDefaults,
  });

  // Reset form when listing changes (e.g., opening edit for different item)
  useEffect(() => {
    form.reset(listing ? normalizeListingValues(listing) : emptyDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing]);

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

  // useCompletion for AI description streaming
  const { 
    complete: streamDescription, 
    completion: streamingDescription, 
    isLoading: isAiGenerating,
    error: genError
  } = useCompletion({
    api: "/api/ai/description",
    onFinish: (_prompt: string, completion: string) => {
      form.setValue("description", completion, { shouldValidate: true });
    }
  });

  // useAiStore sync — use individual selectors to avoid new-object-every-render
  const extractedText = useAiStore((s) => s.extractedText);
  const analysisResult = useAiStore((s) => s.analysisResult);
  const clearAiStore = useAiStore((s) => s.clear);

  useEffect(() => {
    if (extractedText) {
      const current = form.getValues("description") || "";
      form.setValue("description", current ? `${current}\n\n${extractedText}` : extractedText, { shouldValidate: true });
      clearAiStore(); // Consume result
      toast({ title: "AI Intelligence Applied", description: "Text extracted from image has been added to description." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedText]);

  useEffect(() => {
    if (analysisResult) {
      if (analysisResult.suggestedTitle) {
        form.setValue("title", analysisResult.suggestedTitle, { shouldValidate: true });
      }
      if (analysisResult.description) {
        const current = form.getValues("description") || "";
        form.setValue("description", current ? `${current}\n\n${analysisResult.description}` : analysisResult.description, { shouldValidate: true });
      }
      clearAiStore(); // Consume result
      toast({ title: "AI Listing Enhanced", description: "Visual analysis data has been applied to your listing." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisResult]);

  // Effect to update form as description streams
  useEffect(() => {
    if (streamingDescription) {
      form.setValue("description", streamingDescription, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamingDescription]);

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    if (!title || title.length < 3) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please enter a title first to generate a description.",
      });
      return;
    }

    const categoryName = categories.find(c => c.id === form.getValues("categoryId"))?.name;
    await streamDescription("", {
      body: {
        title,
        category: categoryName,
        condition: form.getValues("condition"),
        price: form.getValues("price"),
        currency: form.getValues("currency"),
      }
    });

    if (genError) {
      toast({ variant: "destructive", title: "Error", description: genError.message });
    }
  };

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
                  <div className="flex items-center justify-between">
                    <FormLabel>Description</FormLabel>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateDescription}
                        disabled={isAiGenerating}
                      >
                        {isAiGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate with AI
                      </Button>
                    </div>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item..."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Images</FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Info className="mr-1 h-3 w-3" />
                          Photo Tips
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Tips for Better Listing Photos</DialogTitle>
                          <DialogDescription>Follow these tips to make your listing stand out</DialogDescription>
                        </DialogHeader>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>- Use natural lighting or well-lit environments</li>
                          <li>- Show the item from multiple angles</li>
                          <li>- Include close-ups of any defects or special features</li>
                          <li>- Use a clean, uncluttered background</li>
                          <li>- Avoid filters - show the true colors</li>
                          <li>- Include size reference when relevant</li>
                        </ul>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <FormControl>
                    <ImageUpload
                      value={field.value || []}
                      onChange={field.onChange}
                      endpoint="listingImage"
                      maxFiles={10}
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
