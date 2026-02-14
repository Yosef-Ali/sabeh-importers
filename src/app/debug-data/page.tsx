
import { getListings } from "@/lib/actions/marketplace";

export const dynamic = 'force-dynamic';

export default async function DebugDataPage() {
  const result = await getListings({ limit: 100 });
  
  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Debug Listings ({result.data.length})</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(result.data.map(l => ({ 
          id: l.id, 
          title: l.title, 
          status: l.status,
          featured: l.isFeatured,
          createdAt: l.createdAt
        })), null, 2)}
      </pre>
    </div>
  );
}
