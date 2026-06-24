import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

// 1. Load API Keys
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// 2. Native Fetch Helper
async function fetchFinnhub(endpoint: string) {
  const response = await fetch(`https://finnhub.io/api/v1${endpoint}&token=${FINNHUB_API_KEY}`);
  if (!response.ok) throw new Error("Finnhub API request failed");
  return response.json();
}

// 3. Define the exact Schema our Frontend expects
const FrontendSchema = z.object({
  verdict: z.enum(["Invest", "Hold", "Avoid"]).describe("Final investment decision."),
  pros: z.array(z.string()).describe("2-3 positive points about the company."),
  cons: z.array(z.string()).describe("2-3 risk factors or negative points."),
  research: z.array(z.string()).describe("3 bullet points regarding recent news or market updates."),
  financials: z.array(z.string()).describe("2 bullet points summarizing financial health."),
});

// 4. Next.js App Router POST Handler
export async function POST(req: Request) {
  try {
    if (!FINNHUB_API_KEY || !GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API keys are missing. Please add them to .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const companyName = body.company?.trim();

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }

    // STEP 1: Resolve Ticker Symbol via Native Fetch
    const searchData = await fetchFinnhub(`/search?q=${encodeURIComponent(companyName)}`);
    const bestMatch = searchData.result?.[0]?.symbol || null;

    if (!bestMatch) {
      return NextResponse.json({ error: `Could not find stock ticker for ${companyName}.` }, { status: 404 });
    }

    // STEP 2: Fetch Financials and News in Parallel
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
    
    const fromStr = fromDate.toISOString().slice(0, 10);
    const toStr = toDate.toISOString().slice(0, 10);

    const [profile, news] = await Promise.all([
      fetchFinnhub(`/stock/profile2?symbol=${bestMatch}`),
      fetchFinnhub(`/company-news?symbol=${bestMatch}&from=${fromStr}&to=${toStr}`).catch(() => []), 
    ]);

    const formattedNews = (news || []).slice(0, 5).map((n: any) => n.headline).join(" | ");
    const financialContext = `
      Company: ${profile?.name || companyName} (${bestMatch})
      Industry: ${profile?.finnhubIndustry || "N/A"}
      Market Cap: ${profile?.marketCapitalization || "N/A"}
      Recent News: ${formattedNews || "No major recent news."}
    `;

    // STEP 3: Initialize Groq LLM (FIXED: Changed 'modelName' to 'model')
    const llm = new ChatGroq({
      apiKey: GROQ_API_KEY,
      model: "llama-3.3-70b-versatile", 
      temperature: 0.1, 
    });

    const structuredLlm = llm.withStructuredOutput(FrontendSchema);

    // STEP 4: Generate Verdict
    const result = await structuredLlm.invoke(`
      You are an elite Private Equity Financial Analyst.
      Analyze the following live market data and news for ${companyName}.
      
      DATA:
      ${financialContext}
      
      Provide a highly professional, objective investment verdict based ONLY on the data provided. 
      If data is scarce, lean towards 'Hold' or 'Avoid'.
    `);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Agent Pipeline Error:", error);
    return NextResponse.json(
      { error: error.message || "AI Pipeline failed to generate an analysis." },
      { status: 500 }
    );
  }
}