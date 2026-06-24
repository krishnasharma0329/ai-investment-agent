# AI Investment Research Agent

**Deployment Link:** https://ai-investment-agent-git-main-krishnasharma0329s-projects.vercel.app/
## Overview

AI Investment Research Agent is a full-stack Next.js application designed with an Institutional Quant Terminal aesthetic. It researches a company and returns an actionable investment recommendation.

The agent bypasses traditional buggy SDKs by using Native Fetch to gather real-time company information and recent news from external financial data sources. It then uses a Groq-hosted LLM through LangChain to generate a strict, structured investment report containing:
* Final Verdict (Invest / Hold / Avoid)
* Positive Factors (Pros)
* Risk Factors (Cons)
* Live Market Intel (News & Research)
* Financial Data Stream

## How to Run

### Prerequisites
* Node.js 18+
* Groq API Key
* Finnhub API Key

### Installation

```bash
git clone <repository-url>
cd ai-investment-agent

npm install --legacy-peer-deps

```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
FINNHUB_API_KEY=your_finnhub_api_key

```

### Start Development Server

```bash
npm run dev

```

Open: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

## How It Works

### Architecture

```text
User
  ↓
Next.js Frontend (Quant Terminal UI)
  ↓
/api/agent (POST Route)
  ↓
Native Data Fetcher (Parallel Promises)
  ├── Company Snapshot (Finnhub)
  └── Recent News (Finnhub)
  ↓
LangChain Agent (Zod Schema)
  ↓
Groq LLM (llama-3.3-70b-versatile)
  ↓
Structured Investment Report (JSON)

```

### Workflow

1. User enters a company ticker or name in the Terminal UI.
2. The frontend sends a request to `/api/agent`.
3. The backend resolves the ticker and fetches live financial metrics and 30-day news simultaneously to prevent timeouts.
4. The collected context is injected into a LangChain agent powered by Groq.
5. The LLM analyzes the data strictly against a Zod schema.
6. The response is returned as validated JSON.
7. The frontend displays the final report in a high-contrast, brutalist interface.

## Tech Stack

* Next.js (App Router)
* React
* LangChain.js
* Groq
* Finnhub (via Native Fetch API)
* Tailwind CSS & Lucide React
* Zod

## Key Decisions & Trade-offs

* **Next.js Full-Stack Architecture:**
Frontend and backend are kept in a single project.
*Benefit:* Faster development and deployment.
*Trade-off:* API routes share resources with frontend hosting.
* **Native Fetch vs. Finnhub SDK:**
Replaced the official Finnhub npm package with native `fetch()`.
*Benefit:* Eliminated `bind` errors and Next.js App Router compatibility issues, ensuring 100% uptime.
*Trade-off:* Requires manual URL string formatting for API calls.
* **Structured Output via Zod:**
The agent returns validated JSON rather than parsing free-form text.
*Benefit:* Reliable frontend integration without app crashes.
*Trade-off:* Slightly restricts the LLM from generating flexible, conversational responses.
* **Terminal UI Aesthetic:**
Moved away from standard SaaS templates to a brutalist, monospace interface.
*Benefit:* Stands out visually and mimics professional Wall Street institutional tools.
*Trade-off:* Less traditional "consumer-friendly" look.

## Example Runs

### Apple Inc.

* **Verdict:** Invest
* **Pros:** Strong brand ecosystem, massive cash reserves, positive recent news sentiment around AI integration.
* **Cons/Risks:** Regulatory pressure in the EU, dependence on iPhone upgrade cycles.
* **Market News:** Apple continues to expand its supply chain outside of China, mitigating geopolitical risks.
* **Financials:** Industry-leading market capitalization with consistent high-margin service revenue growth.

### AMC Entertainment

* **Verdict:** Avoid
* **Pros:** Strong retail investor backing, high brand visibility.
* **Cons/Risks:** Severe debt load, declining theater attendance post-pandemic, persistent negative cash flow.
* **Market News:** Management continues stock dilution to raise capital.
* **Financials:** Debt-to-equity ratio remains dangerously high, making long-term sustainability questionable.

## What I Would Improve With More Time

* **Better Data Sources:** Add SEC filings, earnings call transcripts, and analyst ratings to provide deeper research than just company news.
* **Retrieval-Augmented Generation (RAG):** Store complex financial documents in a vector database (like Pinecone or Supabase) and allow the agent to retrieve relevant evidence before generating recommendations.
* **Multi-Agent Orchestration:** Implement a LangGraph system to split responsibilities across specialized agents (News Analyst, Financial Analyst, Chief Supervisor) to improve reasoning quality.
* **Caching & Rate-Limit Handling:** Implement Redis caching for Finnhub responses to improve reliability and reduce API costs.
