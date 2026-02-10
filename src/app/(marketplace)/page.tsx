
import { Search } from "lucide-react";
import Link from "next/link";

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Find Anything in Ethiopia
          </h1>
          <p className="mt-4 text-lg text-blue-100 md:text-xl">
            The most trusted marketplace for cars, property, and electronics.
          </p>

          <div className="mt-8 flex w-full max-w-2xl items-center rounded-lg bg-white p-2 shadow-lg">
            <Search className="ml-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 border-none bg-transparent px-4 py-2 text-gray-900 focus:outline-none focus:ring-0"
            />
            <button className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
          <Link href="/categories" className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {["Motors", "Property", "Electronics", "Jobs", "Services", "Furniture"].map((cat) => (
            <div
              key={cat}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-white p-6 transition-all hover:bg-blue-50 hover:shadow-md"
            >
              <div className="mb-3 h-12 w-12 rounded-full bg-blue-100" />
              <span className="font-medium text-gray-900">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Fresh Recommendations</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">ETB 1,200,000</span>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <h3 className="mt-2 text-base font-medium text-gray-900 line-clamp-2">
                  Toyota Corolla 2022 - Excellent Condition
                </h3>
                <div className="mt-2 text-sm text-gray-500">Addis Ababa, Bole</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
