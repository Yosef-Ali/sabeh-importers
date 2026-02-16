"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPlan, updatePlan } from "@/lib/actions/plans";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Schema matching your Drizzle model
const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameAmharic: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  price: z.coerce.number().min(0),
  currency: z.enum(["ETB", "USD"]),
  durationDays: z.coerce.number().min(1),
  maxActiveListings: z.coerce.number().min(1),
  canPromote: z.boolean().default(false),
  canFeature: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: any; // ToDo: strict type
  onSuccess: () => void;
}

export function PlanSheet({ open, onOpenChange, plan, onSuccess }: PlanSheetProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name || "",
      nameAmharic: plan?.nameAmharic || "",
      slug: plan?.slug || "",
      price: plan?.price ? Number(plan.price) : 0,
      currency: plan?.currency || "ETB",
      durationDays: plan?.durationDays || 30,
      maxActiveListings: plan?.maxActiveListings || 5,
      canPromote: plan?.canPromote || false,
      canFeature: plan?.canFeature || false,
      isActive: plan?.isActive ?? true,
      sortOrder: plan?.sortOrder || 0,
      description: plan?.description || "",
      features: plan?.features || [],
    },
  });

  // Reset form when plan prop changes
  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        nameAmharic: plan.nameAmharic || "",
        slug: plan.slug,
        price: Number(plan.price),
        currency: plan.currency as "ETB" | "USD",
        durationDays: plan.durationDays,
        maxActiveListings: plan.maxActiveListings,
        canPromote: plan.canPromote,
        canFeature: plan.canFeature,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
        description: plan.description || "",
        features: plan.features || [],
      });
    } else {
      form.reset({
        name: "",
        nameAmharic: "",
        slug: "",
        price: 0,
        currency: "ETB",
        durationDays: 30,
        maxActiveListings: 5,
        canPromote: false,
        canFeature: false,
        isActive: true,
        sortOrder: 0,
        description: "",
        features: [],
      });
    }
  }, [plan, form]);

  async function onSubmit(data: PlanFormValues) {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        nameAmharic: data.nameAmharic || null,
        slug: data.slug,
        price: data.price.toString(),
        currency: data.currency,
        durationDays: data.durationDays,
        maxActiveListings: data.maxActiveListings,
        canPromote: data.canPromote,
        canFeature: data.canFeature,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        description: data.description,
        features: data.features,
      };

      if (plan) {
         // Update
         await updatePlan(plan.id, payload);
         toast({ title: "Plan updated", description: `${data.name} has been updated.` });
      } else {
         // Create
         await createPlan(payload);
         toast({ title: "Plan created", description: `${data.name} has been created.` });
      }
      onOpenChange(false);
      router.refresh();
      onSuccess();
    } catch (error) {
       console.error(error);
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{plan ? "Edit Plan" : "Create Plan"}</SheetTitle>
          <SheetDescription>
            {plan ? "Update details for this subscription plan." : "Add a new subscription tier."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Starter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameAmharic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Amharic)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. መደበኛ" {...field} />
                  </FormControl>
                  <FormDescription>Shown on the pricing page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (Unique ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. starter-monthly" {...field} />
                  </FormControl>
                  <FormDescription>Used in URLs and code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
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

            <div className="grid grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="durationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="maxActiveListings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Listings</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Lower numbers appear first.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Features Editor */}
            <div>
               <FormLabel>Features (Bullet Points)</FormLabel>
               <div className="space-y-2 mt-2">
                   {form.watch("features")?.map((feat, index) => (
                       <div key={index} className="flex gap-2">
                           <Input 
                               value={feat} 
                               onChange={(e) => {
                                   const newFeatures = [...(form.getValues("features") || [])];
                                   newFeatures[index] = e.target.value;
                                   form.setValue("features", newFeatures);
                               }} 
                           />
                           <Button 
                               type="button" 
                               variant="ghost" 
                               size="icon"
                               onClick={() => {
                                   const newFeatures = [...(form.getValues("features") || [])];
                                   newFeatures.splice(index, 1);
                                   form.setValue("features", newFeatures);
                               }}
                           >
                               <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                       </div>
                   ))}
                   <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={() => {
                           const current = form.getValues("features") || [];
                           form.setValue("features", [...current, ""]);
                       }}
                       className="mt-2"
                   >
                       <Plus className="h-3 w-3 mr-2" /> Add Feature
                   </Button>
               </div>
            </div>

            <div className="space-y-3 pt-2">
                <FormField
                  control={form.control}
                  name="canPromote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Promote Listings</FormLabel>
                        <FormDescription>Allows users to boost their listings.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canFeature"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Can Feature Listings</FormLabel>
                        <FormDescription>Allows users to feature their listings.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>Visible to users.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full font-bold">
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {plan ? "Update Plan" : "Create Plan"}
            </Button>

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
