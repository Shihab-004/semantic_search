import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import { SearchResponse } from "@/types/product";

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );

  return NextResponse.json({ products: results });
}