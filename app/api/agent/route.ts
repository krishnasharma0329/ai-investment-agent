import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// 1. Gemini Model Initialize karna
const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  temperature: 0.2,
  apiKey: process.env.GEMINI_API_KEY,
});

// 2. State (Shared Memory) Define karna
export const AgentState = Annotation.Root({
  companyName: Annotation<string>(),      
  marketResearch: Annotation<string>(),   
  financialMetrics: Annotation<string>(), 
  finalVerdict: Annotation<string>(),     
});

// 3. NODE 1: Market Researcher
async function researcherNode(state: typeof AgentState.State) {
  console.log(`🔍 [Researcher Node] Market analysis starting for: ${state.companyName}`);
  
  const prompt = `You are a top-tier financial researcher. Provide a bulleted summary of recent major business updates, product launches, or market controversies for ${state.companyName}. Be brief and quantitative.`;
  const response = await llm.invoke(prompt);
  
  return { marketResearch: response.content as string };
}

// 4. NODE 2: Financial Analyst
async function financialsNode(state: typeof AgentState.State) {
  console.log(`📊 [Financials Node] Checking balance sheet and stock stats for: ${state.companyName}`);
  
  const prompt = `You are a financial analyst. Provide a brief analysis of the estimated financial health, typical profit margins, and revenue drivers for ${state.companyName}. Mention key risks.`;
  const response = await llm.invoke(prompt);
  
  return { financialMetrics: response.content as string };
}

// 5. NODE 3: Supervisor / Final Verdict
async function supervisorNode(state: typeof AgentState.State) {
  console.log(`🧠 [Supervisor Node] Generating final investment verdict...`);
  
  const prompt = `You are a senior fund manager. Review the following research and financials for ${state.companyName}:
  
  MARKET RESEARCH:
  ${state.marketResearch}
  
  FINANCIAL METRICS:
  ${state.financialMetrics}
  
  Based on this, provide a final investment recommendation (Invest, Hold, or Avoid). List 2 major Pros and 2 major Cons. Format your output clearly.`;
  
  const response = await llm.invoke(prompt);
  
  return { finalVerdict: response.content as string };
}

// 6. LangGraph ke saare Nodes ko aapas mein connect karna
const workflow = new StateGraph(AgentState)
  .addNode("researcher", researcherNode)
  .addNode("financials", financialsNode)
  .addNode("supervisor", supervisorNode)
  // Flow setup: START -> Researcher -> Financials -> Supervisor -> END
  .addEdge(START, "researcher")
  .addEdge("researcher", "financials")
  .addEdge("financials", "supervisor")
  .addEdge("supervisor", END);

// Graph ko compile karna
const appGraph = workflow.compile();

// 7. API Handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName } = body;

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // Graph ko execute karna initial state ke sath
    const finalState = await appGraph.invoke({
      companyName: companyName,
      marketResearch: "",
      financialMetrics: "",
      finalVerdict: "",
    });

    // Final compiled response bhejna
    return NextResponse.json({ 
      status: "success",
      company: finalState.companyName,
      research: finalState.marketResearch,
      financials: finalState.financialMetrics,
      verdict: finalState.finalVerdict
    });

  } catch (error) {
    console.error("Agent Workflow Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}