import { AIGeneratorClient } from "@/components/admin/ai-generator-client";

export const metadata = {
  title: "AI Generator | Admin",
  description: "Generate ad text and images using AI",
};

export default function AIGeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Generator</h1>
        <p className="text-muted-foreground">
          Generate compelling ad descriptions and product images using AI.
        </p>
      </div>
      <AIGeneratorClient />
    </div>
  );
}
