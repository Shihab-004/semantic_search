import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/data/products";
import { SearchResponse } from "@/types/product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

async function extractKeywords(userQuery: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a product search assistant for a Bangladeshi e-commerce site selling plastic and packaging products.

User searched for: "${userQuery}"

Your tasks:
1. Fix any typos (bottol → bottle, litter → liter, polipropilen → polypropylene)
2. Expand abbreviations (PP5 → polypropylene, HDPE → high density polyethylene, PET → polyethylene terephthalate, LDPE → low density polyethylene)
3. Extract all relevant search keywords

Return ONLY a valid JSON array of strings. No explanation. No markdown. No backticks.
Example: ["PP5", "polypropylene", "bottle", "5L", "5 liter"]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as string[];
}

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ products: [], keywords: [] });
  }

  try {
    const keywords = await extractKeywords(query);

    const results = products.filter((p) =>
      keywords.some(
        (kw) =>
          p.name.toLowerCase().includes(kw.toLowerCase()) ||
          p.description.toLowerCase().includes(kw.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(kw.toLowerCase()))
      )
    );

    // Remove duplicates by id
    const unique = Array.from(new Map(results.map((p) => [p.id, p])).values());

    return NextResponse.json({ products: unique, keywords });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ products: [], error: message }, { status: 500 });
  }
}