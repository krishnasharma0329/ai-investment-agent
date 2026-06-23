# AI Investment Research Agent

**Deployment Link:** https://ai-investment-agent-git-main-krishnasharma0329s-projects.vercel.app/

## Overview

Nexus AI Investment Agent is a full-stack Next.js application that researches a corporate entity and returns an institutional-grade investment recommendation: Invest, Hold, or Avoid. 

Unlike standard single-prompt applications, this system utilizes a strict Multi-Agent pipeline via LangGraph.js. It leverages the high-speed Groq API (LLaMA 3.3) to sequentially synthesize market news, evaluate financial health, and generate a final structured verdict containing:
* Final Decision (Invest / Hold / Avoid)
* Market Research Summary
* Financial Metrics & Risks
* Core Pros & Cons

## How to Run

### Prerequisites
* Node.js 18+
* Groq API Key

### Installation

```bash
git clone <repository-url>
cd <repository-directory>
npm install

```

### Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here

```

### Start Development Server

```bash
npm run dev

```

Open: `http://localhost:3000`

## How It Works

### Architecture

```text
User Input (Target Company)
  ↓
Next.js Frontend (React)
  ↓
/api/agent (Next.js API Route)
  ↓
LangGraph Multi-Agent Pipeline
  ├── Node 1: Researcher Agent (Gathers news & product updates)
  ├── Node 2: Financial Analyst (Evaluates margins & health)
  └── Node 3: Chief Supervisor (Synthesizes data for final decision)
  ↓
Groq LLM (llama-3.3-70b-versatile)
  ↓
Structured JSON Report
  ↓
Frontend Dashboard (with Recharts Visualization)

```

### Workflow

1. User enters a company name in the Next.js frontend.
2. The UI triggers a POST request to `/api/agent`.
3. The LangGraph state object is initialized with the target company name.
4. **Researcher Node:** The LLM acts as a market researcher, extracting 3 core business updates without conversational filler.
5. **Financial Node:** The LLM shifts persona to a financial analyst, extracting estimated margins, revenue drivers, and key risks.
6. **Supervisor Node:** The LLM evaluates the outputs from Node 1 and Node 2 to generate a final, deterministic investment verdict.
7. The structured JSON response is sent back to the client and rendered dynamically on the dashboard.

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Recharts, Lucide Icons
* **Backend:** Next.js API Routes
* **AI & Orchestration:** LangGraph.js (`@langchain/langgraph`), Groq SDK (`@langchain/groq`)

## Key Decisions & Trade-offs

### Next.js Full-Stack Architecture

* **Benefit:** Frontend and backend (API routes) are kept in a single repository, making state management and deployment seamless.
* **Trade-off:** Serverless functions have execution time limits, requiring an extremely fast LLM (Groq) to prevent timeouts.

### LangGraph vs. Standard LangChain

* **Benefit:** LangGraph provides a cyclical, state-driven workflow. Separating prompts into three distinct nodes (Research -> Financials -> Supervisor) drastically reduced hallucination and improved the reasoning quality compared to a single massive LLM prompt.
* **Trade-off:** Slightly higher latency as the graph requires three sequential LLM invocations.

### LLM Internal Knowledge vs. Live Financial APIs

* **Benefit:** For this MVP, the agent relies on the LLM's robust internal training data rather than fetching live external API data. This bypasses severe free-tier API rate limits and keeps the total pipeline execution under 5 seconds.
* **Trade-off:** The data reflects the model's knowledge cutoff date rather than real-time, down-to-the-minute stock prices. (Visual charts on the frontend currently use simulated placeholder structures to demonstrate UI capability).

### Structured Markdown Output

* **Benefit:** Strict system prompting ensures the LLM returns easily parseable bullet points without conversational text.
* **Trade-off:** Less flexibility in the generated response format, but highly reliable for React rendering.

## Example Runs

### Apple

**VERDICT:** Invest

**PROS:** - Strong brand loyalty and ecosystem retention across devices and services.

* Consistent and massive free cash flow generation.

**CONS:** - Heavy reliance on iPhone sales for total revenue.

* Increasing regulatory scrutiny regarding App Store policies.

**Market Research:**
• Q1 2024 services revenue reached an all-time high.
• Expanding deeply into the spatial computing market with Vision Pro.
• Continued supply chain diversification moving away from single-region dependency.

### Tesla

**VERDICT:** Hold

**PROS:** - Market leader in EV technology, software, and charging infrastructure.

* Expanding energy storage and solar business divisions.

**CONS:** - Highly volatile valuation metrics compared to traditional automakers.

* Increasing global competition, particularly from aggressive pricing in the Asian market.

## What I Would Improve With More Time

### Live Financial API Integration

Integrate APIs like Finnhub or Alpha Vantage into the "Researcher Node" to fetch real-time P/E ratios, SEC filings, and live stock quotes before sending context to the LLM.

### Retrieval-Augmented Generation (RAG)

Store 10-K and 10-Q financial reports in a vector database (like Pinecone) and allow the agent to query exact historical documentation to back up its verdicts.

### Dynamic UI Graphs

Connect the Recharts frontend component directly to a live stock-market WebSocket to display actual 6-month historical trends corresponding to the user's search query.
