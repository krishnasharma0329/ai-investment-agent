import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq"; 

export const AgentState = Annotation.Root({
  companyName: Annotation<string>(),      
  marketResearch: Annotation<string>(),   
  financialMetrics: Annotation<string>(), 
  finalVerdict: Annotation<string>(),     
});

const getModel = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("🚨 Groq API Key is missing in .env file!");
  }

  return new ChatGroq({
    apiKey: apiKey,
    model: "llama-3.3-70b-versatile", 
    temperature: 0.1, 
  });
};

async function researcherNode(state: typeof AgentState.State) {
  console.log(`[Node 1] Researching: ${state.companyName}`);
  const prompt = `You are a financial researcher. For ${state.companyName}, provide exactly 3 concise bullet points covering recent major business updates or product launches. 
  STRICT RULES: Do NOT use markdown formatting like asterisks (**). Do NOT write any introductory or conversational text (like "Here is the summary"). Just give the bullet points.`;
  
  const response = await getModel().invoke(prompt);
  return { marketResearch: response.content as string };
}

async function financialsNode(state: typeof AgentState.State) {
  console.log(`[Node 2] Financials for: ${state.companyName}`);
  const prompt = `You are a financial analyst. For ${state.companyName}, provide exactly 3 concise bullet points on estimated financial health, profit margins, and 1 key risk. 
  STRICT RULES: Do NOT use markdown formatting like asterisks (**). Do NOT write any introductory text. Just give the exact data.`;
  
  const response = await getModel().invoke(prompt);
  return { financialMetrics: response.content as string };
}

async function supervisorNode(state: typeof AgentState.State) {
  console.log(`[Node 3] Final Verdict for: ${state.companyName}`);
  const prompt = `Based on the research and financials, provide a final verdict for ${state.companyName}.
  Format exactly like this, line by line, with NO extra conversational text and NO markdown asterisks:

  VERDICT: [Invest, Hold, or Avoid]
  
  PROS: 
  - [Pro 1]
  - [Pro 2]
  
  CONS: 
  - [Con 1]
  - [Con 2]`;
  
  const response = await getModel().invoke(prompt);
  return { finalVerdict: response.content as string };
}

const workflow = new StateGraph(AgentState)
  .addNode("researcher", researcherNode)
  .addNode("financials", financialsNode)
  .addNode("supervisor", supervisorNode)
  .addEdge(START, "researcher")
  .addEdge("researcher", "financials")
  .addEdge("financials", "supervisor")
  .addEdge("supervisor", END);

const appGraph = workflow.compile();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName } = body;

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }
    
    console.log(`🚀 Starting pipeline for: ${companyName}`);

    const finalState = await appGraph.invoke({
      companyName: companyName,
      marketResearch: "",
      financialMetrics: "",
      finalVerdict: "",
    });
    
    console.log(`✅ Pipeline completed successfully!`);

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