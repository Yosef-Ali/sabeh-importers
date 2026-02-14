import { cn } from "@/lib/utils";

interface Attribute {
  key: string;
  value: string | number | boolean;
  label?: string;
  labelAm?: string;
}

interface SpecificationsTableProps {
  attributes: Record<string, any> | null;
  language?: "en" | "am";
  className?: string;
}

// Common attribute labels with Amharic translations
const ATTRIBUTE_LABELS: Record<
  string,
  { label: string; labelAm: string }
> = {
  // Motors
  year: { label: "Year", labelAm: "ዓመት" },
  make: { label: "Make", labelAm: "አምራች" },
  model: { label: "Model", labelAm: "ሞዴል" },
  mileage: { label: "Mileage", labelAm: "የተጓዘበት ርቀት" },
  transmission: { label: "Transmission", labelAm: "ማስተላለፊያ" },
  fuelType: { label: "Fuel Type", labelAm: "የነዳጅ አይነት" },
  color: { label: "Color", labelAm: "ቀለም" },
  bodyType: { label: "Body Type", labelAm: "የአካል አይነት" },
  engineSize: { label: "Engine Size", labelAm: "የሞተር መጠን" },
  doors: { label: "Doors", labelAm: "በሮች" },
  seats: { label: "Seats", labelAm: "ወንበሮች" },

  // Property
  bedrooms: { label: "Bedrooms", labelAm: "የመኝታ ክፍሎች" },
  bathrooms: { label: "Bathrooms", labelAm: "መታጠቢያ ቤቶች" },
  area: { label: "Area", labelAm: "ስፋት" },
  propertyType: { label: "Property Type", labelAm: "የንብረት አይነት" },
  furnished: { label: "Furnished", labelAm: "የተመቸ" },
  parking: { label: "Parking", labelAm: "የመኪና ማቆሚያ" },
  floor: { label: "Floor", labelAm: "ፎቅ" },

  // Electronics
  brand: { label: "Brand", labelAm: "ብራንድ" },
  warranty: { label: "Warranty", labelAm: "ዋስትና" },
  storage: { label: "Storage", labelAm: "ማከማቻ" },
  ram: { label: "RAM", labelAm: "ራም" },
  processor: { label: "Processor", labelAm: "ፕሮሰሰር" },
  screenSize: { label: "Screen Size", labelAm: "የስክሪን መጠን" },

  // General
  condition: { label: "Condition", labelAm: "ሁኔታ" },
  usage: { label: "Usage", labelAm: "አጠቃቀም" },
  material: { label: "Material", labelAm: "ቁሳቁስ" },
  dimensions: { label: "Dimensions", labelAm: "ልኬቶች" },
  weight: { label: "Weight", labelAm: "ክብደት" },
};

export function SpecificationsTable({
  attributes,
  language = "en",
  className,
}: SpecificationsTableProps) {
  if (!attributes || Object.keys(attributes).length === 0) {
    return null;
  }

  // Convert attributes object to array
  const attributeList: Attribute[] = Object.entries(attributes)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => ({
      key,
      value,
      label: ATTRIBUTE_LABELS[key]?.label || formatKey(key),
      labelAm: ATTRIBUTE_LABELS[key]?.labelAm || formatKey(key),
    }));

  if (attributeList.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-display font-bold text-foreground border-l-4 border-gold pl-4">
        {language === "am" ? "ዝርዝር መግለጫዎች" : "Specifications"}
      </h2>

      <div className="bg-card rounded-card border border-border shadow-card overflow-hidden">
        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 divide-x divide-border">
          {attributeList.map((attr, index) => (
            <div
              key={attr.key}
              className={cn(
                "p-4 space-y-1",
                index % 2 === 0 ? "bg-muted/30" : "bg-card"
              )}
            >
              <dt className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                {language === "am" ? attr.labelAm : attr.label}
              </dt>
              <dd className="text-base font-display font-semibold text-foreground">
                {formatValue(attr.value, language)}
              </dd>
            </div>
          ))}
        </div>

        {/* Mobile: 1-column list */}
        <dl className="md:hidden divide-y divide-border">
          {attributeList.map((attr, index) => (
            <div
              key={attr.key}
              className={cn(
                "px-4 py-3 flex items-center justify-between gap-4",
                index % 2 === 0 ? "bg-muted/30" : "bg-card"
              )}
            >
              <dt className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-wide">
                {language === "am" ? attr.labelAm : attr.label}
              </dt>
              <dd className="text-sm font-display font-semibold text-foreground text-right">
                {formatValue(attr.value, language)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

// Helper function to format camelCase keys to readable labels
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Helper function to format values
function formatValue(
  value: string | number | boolean,
  language: "en" | "am"
): string {
  if (typeof value === "boolean") {
    return language === "am" ? (value ? "አዎ" : "አይደለም") : value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  // Convert common enum values
  const formattedValue = String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return formattedValue;
}
