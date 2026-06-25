# 🔍 Daraz Search Demo — AI vs Normal Search

A mini project that exposes a **real flaw in Daraj's search engine** and demonstrates how AI can fix it.

Built with **Next.js + TypeScript + Gemini API** — no database required.

---

## 🧩 The Problem

Daraj uses **exact keyword matching** for search.

| Query | Normal Search | AI Search |
|---|---|---|
| `PP5 bottle` | ✅ Works | ✅ Works |
| `5 litter polypropylene bottol` | ❌ No results | ✅ Found |
| `polipropilen container` | ❌ No results | ✅ Found |
| `plastic jar 5 litre` | ❌ No results | ✅ Found |

If a user misspells a word, uses a synonym, or writes the product name differently — Daraj shows nothing. This directly causes **lost sales**.

---

## 💡 The Solution

Instead of matching raw text, we use **Gemini AI** to understand what the user actually means — then search against that.

```
User types: "5 litter polypropylene bottol"
                      ↓
             Gemini AI processes it
                      ↓
   Extracted: ["PP5", "polypropylene", "bottle", "5L", "5 liter"]
                      ↓
          Search runs on clean keywords
                      ↓
              ✅ Correct results shown
```

---

## 🛠️ Tech Stack

- **Next.js 14** — App Router + API Routes
- **TypeScript** — fully typed
- **Tailwind CSS** — styling
- **Gemini 1.5 Flash** — AI keyword extraction
- **Local JSON** — dummy product dataset (no database needed)

---

## 📁 Project Structure

```
daraj-search-demo/
├── app/
│   ├── page.tsx                  # Main UI — side by side comparison
│   ├── layout.tsx
│   └── api/
│       ├── search/
│       │   └── route.ts          # Normal exact search
│       └── ai-search/
│           └── route.ts          # Gemini AI semantic search
├── data/
│   └── products.ts               # Dummy product dataset
├── types/
│   └── product.ts                # TypeScript interfaces
└── .env.local                    # API keys
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/daraj-search-demo.git
cd daraj-search-demo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 How to Test

Once running, try these search queries and compare the two results side by side:

| Try This Query | What It Tests |
|---|---|
| `5 litter polypropylene bottol` | Typo + synonym |
| `polipropilen container` | Misspelling |
| `plastic jar 5 litre` | Different wording |
| `PP5 bottle` | Exact match (both work) |

---

## 🔄 How Each Search Works

### Normal Search (`/api/search`)
Runs a simple `String.includes()` match against product name and description.
If the exact word isn't there — nothing is returned.

### AI Search (`/api/ai-search`)
1. Sends the user query to **Gemini API**
2. Gemini fixes typos, expands abbreviations, and extracts keywords
3. Those keywords are matched against name, description, and tags
4. Returns relevant products even with imperfect input

---

## 📌 Why This Matters

Search is the **most critical feature** of any e-commerce platform.

When a user searches and finds nothing — they don't try again. They leave.

This demo shows that with a single AI layer, Daraj could:
- Recover lost searches
- Improve conversion rate
- Handle Bangla-English mixed queries
- Work with abbreviations common in B2B product searches

---

##  About

Built as a proof-of-concept to highlight a real UX problem in [Daraz](https://daraz.com.bd) — Bangladesh's leading e-commerce platform.

This is not an official Daraz project.
