"use client";

import { useState, KeyboardEvent } from "react";
import { Product } from "@/types/product";

interface SearchState {
  normalResults: Product[];
  aiResults: Product[];
  aiKeywords: string[];
  loading: boolean;
  searched: boolean;
  error: string | null;
}

const INITIAL_STATE: SearchState = {
  normalResults: [],
  aiResults: [],
  aiKeywords: [],
  loading: false,
  searched: false,
  error: null,
};

const EXAMPLE_QUERIES = [
  "5 litter polypropylene bottol",
  "polipropilen container",
  "plastic jar 5 litre",
  "PP5 bottle",
];

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [state, setState] = useState<SearchState>(INITIAL_STATE);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) return;

    if (searchQuery) setQuery(searchQuery);

    setState((prev) => ({
      ...prev,
      loading: true,
      searched: true,
      error: null,
    }));

    try {
      const [normalRes, aiRes] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json()),
        fetch(`/api/ai-search?q=${encodeURIComponent(q)}`).then((r) => r.json()),
      ]);

      setState((prev) => ({
        ...prev,
        normalResults: normalRes.products ?? [],
        aiResults: aiRes.products ?? [],
        aiKeywords: aiRes.keywords ?? [],
        loading: false,
        error: aiRes.error ?? normalRes.error ?? null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Something went wrong. Please try again.",
      }));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Daraj Search Demo
        </h1>
        <p className="text-gray-400 text-sm">
          Normal Exact Search vs{" "}
          <span className="text-blue-500 font-semibold">AI Semantic Search</span>
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Try: "5 litter polypropylene bottol"'
          className="flex-1 px-4 py-3 border-2 border-red-400 rounded-xl text-sm outline-none focus:border-red-600 transition"
        />
        <button
          onClick={() => handleSearch()}
          disabled={state.loading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition disabled:opacity-50 text-sm"
        >
          {state.loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Example Queries */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs text-gray-400 mt-1">Try:</span>
        {EXAMPLE_QUERIES.map((eq) => (
          <button
            key={eq}
            onClick={() => handleSearch(eq)}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition"
          >
            {eq}
          </button>
        ))}
      </div>

      {/* AI Keywords */}
      {state.aiKeywords.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <span className="text-xs font-semibold text-blue-600 mr-2">
            AI extracted keywords:
          </span>
          {state.aiKeywords.map((kw, i) => (
            <span
              key={i}
              className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full mx-1 my-1"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs">
          ⚠️ {state.error}
        </div>
      )}

      {/* Results */}
      {state.searched && !state.loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Normal */}
          <div>
            <h2 className="text-base font-semibold text-red-500 mb-3">
              Normal Search{" "}
              <span className="text-xs font-normal text-gray-400">
                ({state.normalResults.length} results)
              </span>
            </h2>
            {state.normalResults.length === 0 ? (
              <EmptyState />
            ) : (
              state.normalResults.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>

          {/* AI */}
          <div>
            <h2 className="text-base font-semibold text-green-600 mb-3">
               AI Search{" "}
              <span className="text-xs font-normal text-gray-400">
                ({state.aiResults.length} results)
              </span>
            </h2>
            {state.aiResults.length === 0 ? (
              <EmptyState />
            ) : (
              state.aiResults.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5 mb-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50">
      
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

      <div className="space-y-3">
        <h3 className="text-[15px] font-semibold tracking-tight text-slate-800 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-orange-700">
            {product.category}
          </span>

          <span className="text-lg font-bold tracking-tight text-orange-600">
            ৳{product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
        <span className="text-2xl">🔍</span>
      </div>

      <h3 className="text-base font-semibold text-slate-800">
        No Products Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Try using different keywords or a more specific search term.
      </p>
    </div>
  );
}