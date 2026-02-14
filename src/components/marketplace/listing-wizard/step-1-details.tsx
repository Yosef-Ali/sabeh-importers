"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { ListingFormData } from "./listing-wizard";

interface Step1DetailsProps {
  formData: Partial<ListingFormData>;
  updateFormData: (data: Partial<ListingFormData>) => void;
  language?: "en" | "am";
  categories?: Array<{
    id: string;
    name: string;
    nameAmharic?: string | null;
  }>;
}

const CONDITIONS = [
  { value: "NEW", label: "Brand New", labelAm: "አዲስ" },
  { value: "LIKE_NEW", label: "Like New", labelAm: "እንደ አዲስ" },
  { value: "USED_GOOD", label: "Used - Good", labelAm: "ያገለገለ - ጥሩ" },
  { value: "USED_FAIR", label: "Used - Fair", labelAm: "ያገለገለ - መካከለኛ" },
  { value: "FOR_PARTS", label: "For Parts", labelAm: "ለክፍሎች" },
];

const CURRENCIES = [
  { value: "ETB", label: "Ethiopian Birr (ETB)", labelAm: "የኢትዮጵያ ብር (ETB)" },
  { value: "USD", label: "US Dollar (USD)", labelAm: "የአሜሪካ ዶላር (USD)" },
  { value: "EUR", label: "Euro (EUR)", labelAm: "ዩሮ (EUR)" },
];

const ETHIOPIAN_CITIES = [
  { value: "addis-ababa", label: "Addis Ababa", labelAm: "አዲስ አበባ" },
  { value: "dire-dawa", label: "Dire Dawa", labelAm: "ድሬዳዋ" },
  { value: "mekele", label: "Mekele", labelAm: "መቀሌ" },
  { value: "gondar", label: "Gondar", labelAm: "ጎንደር" },
  { value: "bahir-dar", label: "Bahir Dar", labelAm: "ባህር ዳር" },
  { value: "hawassa", label: "Hawassa", labelAm: "ሀዋሳ" },
  { value: "jimma", label: "Jimma", labelAm: "ጅማ" },
  { value: "adama", label: "Adama", labelAm: "አዳማ" },
  { value: "dessie", label: "Dessie", labelAm: "ደሴ" },
  { value: "jijiga", label: "Jijiga", labelAm: "ጅጅጋ" },
];

export function Step1Details({
  formData,
  updateFormData,
  language = "en",
  categories = [],
}: Step1DetailsProps) {
  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category" className="font-display font-semibold">
          {language === "am" ? "ምድብ" : "Category"} *
        </Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => updateFormData({ categoryId: value })}
        >
          <SelectTrigger id="category">
            <SelectValue
              placeholder={
                language === "am" ? "ምድብ ይምረጡ" : "Select a category"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {language === "am" && cat.nameAmharic
                  ? cat.nameAmharic
                  : cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="font-display font-semibold">
          {language === "am" ? "ርዕስ" : "Title"} *
        </Label>
        <Input
          id="title"
          type="text"
          placeholder={
            language === "am"
              ? "ለምሳሌ: 2015 Toyota Corolla"
              : "e.g., 2015 Toyota Corolla"
          }
          value={formData.title || ""}
          onChange={(e) => updateFormData({ title: e.target.value })}
          className="font-display"
        />
        {language === "am" && (
          <p className="text-xs text-muted-foreground font-mono">
            በአማርኛ እና በእንግሊዘኛ ማስታወቂያዎችን ለማሳየት ይህን በእንግሊዘኛ ይሙሉ
          </p>
        )}
      </div>

      {/* Amharic Title (Optional) */}
      {language === "am" && (
        <div className="space-y-2">
          <Label htmlFor="titleAmharic" className="font-display font-semibold">
            ርዕስ በአማርኛ (አማራጭ)
          </Label>
          <Input
            id="titleAmharic"
            type="text"
            placeholder="ለምሳሌ: 2015 ቶዮታ ኮሮላ"
            value={formData.titleAmharic || ""}
            onChange={(e) => updateFormData({ titleAmharic: e.target.value })}
            className="font-amharic"
          />
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="font-display font-semibold">
          {language === "am" ? "መግለጫ" : "Description"} *
        </Label>
        <Textarea
          id="description"
          placeholder={
            language === "am"
              ? "የእቃዎን ሁኔታ፣ ባህሪያት እና ማንኛውንም አስፈላጊ ዝርዝሮች ይግለጹ..."
              : "Describe the condition, features, and any important details..."
          }
          value={formData.description || ""}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={5}
          className="font-display resize-none"
        />
        <p className="text-xs text-muted-foreground font-mono">
          {language === "am"
            ? "ዝርዝር መግለጫ የበለጠ ፍላጎት ይፈጥራል"
            : "Detailed descriptions attract more interest"}
        </p>
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="price" className="font-display font-semibold">
            {language === "am" ? "ዋጋ" : "Price"} *
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder={language === "am" ? "0.00" : "0.00"}
            value={formData.price || ""}
            onChange={(e) =>
              updateFormData({ price: parseFloat(e.target.value) || 0 })
            }
            className="font-display text-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="font-display font-semibold">
            {language === "am" ? "ምንዛሪ" : "Currency"}
          </Label>
          <Select
            value={formData.currency || "ETB"}
            onValueChange={(value) => updateFormData({ currency: value })}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  {language === "am" ? curr.labelAm : curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Negotiable Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-card border border-border">
        <div>
          <Label htmlFor="negotiable" className="font-display font-semibold">
            {language === "am" ? "ዋጋው ተደራሽ ነው?" : "Price Negotiable?"}
          </Label>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {language === "am"
              ? "ገዢዎች ዋጋ መደራደር ይችላሉ"
              : "Buyers can negotiate the price"}
          </p>
        </div>
        <Switch
          id="negotiable"
          checked={formData.negotiable || false}
          onCheckedChange={(checked) => updateFormData({ negotiable: checked })}
        />
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label htmlFor="condition" className="font-display font-semibold">
          {language === "am" ? "ሁኔታ" : "Condition"} *
        </Label>
        <Select
          value={formData.condition || "USED_GOOD"}
          onValueChange={(value) => updateFormData({ condition: value })}
        >
          <SelectTrigger id="condition">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((cond) => (
              <SelectItem key={cond.value} value={cond.value}>
                {language === "am" ? cond.labelAm : cond.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <Label className="font-display font-semibold">
          {language === "am" ? "ምስሎች" : "Photos"}
        </Label>
        <p className="text-sm text-muted-foreground font-mono">
          {language === "am"
            ? "እስከ 10 ምስሎች ይስቀሉ። የመጀመሪያው ምስል እንደ ዋና ምስል ያገለግላል።"
            : "Upload up to 10 photos. The first photo will be the main image."}
        </p>

        <ImageUpload
          value={formData.images || []}
          onChange={(images) => updateFormData({ images })}
          endpoint="listingImage"
          maxFiles={10}
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="font-display font-semibold">
            {language === "am" ? "ከተማ" : "City"} *
          </Label>
          <Select
            value={formData.city}
            onValueChange={(value) => updateFormData({ city: value })}
          >
            <SelectTrigger id="city">
              <SelectValue
                placeholder={
                  language === "am" ? "ከተማ ይምረጡ" : "Select city"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {ETHIOPIAN_CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {language === "am" ? city.labelAm : city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="font-display font-semibold">
            {language === "am" ? "አካባቢ / ሰፈር" : "Area / Neighborhood"}
          </Label>
          <Input
            id="region"
            type="text"
            placeholder={
              language === "am" ? "ለምሳሌ: ቦሌ" : "e.g., Bole"
            }
            value={formData.region || ""}
            onChange={(e) => updateFormData({ region: e.target.value })}
            className="font-display"
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-button">
        <p className="text-sm font-mono text-foreground">
          <strong>
            {language === "am" ? "ጠቃሚ ምክር:" : "Pro Tip:"}
          </strong>{" "}
          {language === "am"
            ? "ጥራት ያላቸው ፎቶዎች እና ዝርዝር መግለጫዎች የእርስዎን ዕቃ በፍጥነት ለመሸጥ ያግዛሉ!"
            : "Quality photos and detailed descriptions help sell your item faster!"}
        </p>
      </div>
    </div>
  );
}
