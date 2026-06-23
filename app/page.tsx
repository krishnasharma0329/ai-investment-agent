"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, ShieldAlert, Activity, Database, Target } from "lucide-react";

// Mock Data for Graph
const mockChartData = [
  { name: "Jan", price: 150 }, { name: "Feb", price: 165 },
  { name: "Mar", price: 140 }, { name: "Apr", price: 180 },
  { name: "May", price: 175 }, { name: "Jun", price: 210 },
];

export default function Home() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Helper function to clean Markdown symbols just in case AI still sends them
  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*/g, '') // Remove all bold markers
      .replace(/\*/g, '•'); // Replace single asterisk with clean bullet
  };

  const runPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    
    setLoading(true);
    setResult(null); // Clear previous results
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: company }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Pipeline failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-indigo-400">
          AI Investment Agent
        </h1>
        <p className="text-slate-400 text-lg">
          Autonomous private-equity analysis powered by LangGraph & Groq AI.
        </p>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={runPipeline} className="relative flex items-center">
          <Search className="absolute left-4 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Enter Company Name (e.g., Apple, Tesla)..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl py-4 pl-12 pr-32 text-lg outline-none transition-all"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Analyze"}
          </button>
        </form>
      </div>

      {/* VIEW 1: EMPTY STATE */}
      {!result && !loading && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-center text-xl text-slate-500 mb-8 font-semibold uppercase tracking-wider">
            System Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <Database className="mx-auto text-cyan-400 mb-4" size={40} />
              <h3 className="text-lg font-bold text-white mb-2">1. Researcher Agent</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Gathers recent news, market controversies, and product updates from the web.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <Activity className="mx-auto text-emerald-400 mb-4" size={40} />
              <h3 className="text-lg font-bold text-white mb-2">2. Financial Analyst</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Evaluates financial health, typical profit margins, and revenue drivers.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-lg">
              <Target className="mx-auto text-indigo-400 mb-4" size={40} />
              <h3 className="text-lg font-bold text-white mb-2">3. Chief Supervisor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Synthesizes data to provide a final Invest/Hold/Avoid verdict with pros & cons.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LOADING STATE */}
      {loading && (
        <div className="text-center py-20 mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-indigo-400 font-medium animate-pulse">Running LangGraph Multi-Agent Pipeline...</p>
        </div>
      )}

      {/* VIEW 3: RESULTS STATE */}
      {result && !loading && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Card */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Activity className="text-indigo-400" /> Stock Performance (Simulated)
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" />
                    <YAxis stroke="#475569" tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Area type="monotone" dataKey="price" stroke="#818cf8" fill="#4f46e5" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verdict Card */}
            <div className="bg-slate-800 border border-indigo-500/30 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-300">
                <ShieldAlert size={20} /> Final Verdict
              </h2>
              {/* Notice the leading-loose class for spacing and cleanText function */}
              <div className="text-slate-200 text-sm leading-loose whitespace-pre-wrap overflow-y-auto h-64 pr-2 custom-scrollbar">
                {cleanText(result.verdict)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Research Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Market Research</h2>
              <div className="text-slate-300 text-sm leading-loose whitespace-pre-wrap">
                {cleanText(result.research)}
              </div>
            </div>

            {/* Financials Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-emerald-400">Financial Analysis</h2>
              <div className="text-slate-300 text-sm leading-loose whitespace-pre-wrap">
                {cleanText(result.financials)}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}