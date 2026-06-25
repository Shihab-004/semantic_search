export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  brand: string;
  description: string;
  tags: string[];
}

export interface SearchResponse {
  products: Product[];
  keywords?: string[];
  error?: string;
}