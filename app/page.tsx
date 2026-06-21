'use client'; // Next.js App Router mein interactivity ke liye client component banana zaroori hai

import { useState } from 'react';

// TypeScript interfaces jo humare component ko type-safe banati hain
interface AnalysisResult {
  company: string;
  research: string;
  financials: string;
  verdict: string;
}

type StepStatus = 'idle' | 'running' | 'completed' | 'error';

export default function Home() {
  // State Management
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Real-time step tracking status
  const [researchStatus, setResearchStatus] = useState<StepStatus>('idle');
  const [financialsStatus, setFinancialsStatus] = useState<StepStatus>('idle');
  const [supervisorStatus, setSupervisorStatus] = useState<StepStatus>('idle');

  // Backend API call karne ka function
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    // UI State ko reset aur initialize karna
    setLoading(true);
    setError('');
    setResult(null);
    
    // Step 1 active karna
    setResearchStatus('running');
    setFinancialsStatus('idle');
    setSupervisorStatus('idle');

    try {
      // Humne backend par simulated delay ya sequential processing rakhi hai
      // UI pipeline ko smooth dikhane ke liye hum steps ko track karenge
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) throw new Error('Failed to analyze company data');

      const data = await response.json();

      // Jaise hi data aata hai, saare steps sequential order mein complete dikhayenge
      setResearchStatus('completed');
      setFinancialsStatus('running');
      
      // Chote se break ke baad agla status update (Professional UI UX optimization)
      setTimeout(() => {
        setFinancialsStatus('completed');
        setSupervisorStatus('running');
        
        setTimeout(() => {
          setSupervisorStatus('completed');
          setResult(data);
          setLoading(false);
        }, 800);
      }, 800);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setResearchStatus('error');
      setFinancialsStatus('error');
      setSupervisorStatus('error');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 font-sans selection:bg-teal-500 selection:text-zinc-950">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="border-b border-zinc-800 pb-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs text-teal-400 rounded-full font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Multi-Agent System Active
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            AI Investment Research Agent
          </h1>
          <p className="text-zinc-400 mt-2 text-sm md:text-base max-w-2xl">
            Autonomous private-equity analysis pipeline powered by LangGraph.js and Gemini Pro.
          </p>
        </header>

        {/* Input Form Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl max-w-xl mx-auto md:mx-0">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Target Corporation Name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Apple, Tesla, Tata Motors..."
                disabled={loading}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-zinc-50 text-zinc-950 font-medium px-6 py-3 rounded-lg text-sm hover:bg-zinc-200 disabled:opacity-50 transition shadow-md active:scale-95 whitespace-nowrap"
              >
                {loading ? 'Analyzing...' : 'Run Pipeline'}
              </button>
            </div>
          </form>

          {/* Real-time Step/Node Tracker Component */}
          {loading && (
            <div className="mt-6 border-t border-zinc-800/60 pt-4 space-y-3 font-mono text-xs">
              <div className="text-zinc-500 uppercase tracking-widest mb-1">Graph Execution State:</div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">1. Node_Researcher (Market Data)</span>
                <span className={researchStatus === 'running' ? 'text-teal-400 animate-pulse' : researchStatus === 'completed' ? 'text-zinc-500' : 'text-zinc-600'}>
                  {researchStatus === 'running' ? '[PROCESSING]' : researchStatus === 'completed' ? '[DONE]' : '[IDLE]'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">2. Node_Financial_Analyst (Margins)</span>
                <span className={financialsStatus === 'running' ? 'text-teal-400 animate-pulse' : financialsStatus === 'completed' ? 'text-zinc-500' : 'text-zinc-600'}>
                  {financialsStatus === 'running' ? '[PROCESSING]' : financialsStatus === 'completed' ? '[DONE]' : '[IDLE]'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">3. Node_Investment_Committee (Verdict)</span>
                <span className={supervisorStatus === 'running' ? 'text-teal-400 animate-pulse' : supervisorStatus === 'completed' ? 'text-zinc-500' : 'text-zinc-600'}>
                  {supervisorStatus === 'running' ? '[COMPILING]' : supervisorStatus === 'completed' ? '[DONE]' : '[IDLE]'}
                </span>
              </div>
            </div>
          )}

          {error && <div className="mt-4 text-red-400 text-xs font-mono">⚠️ Error: {error}</div>}
        </section>

        {/* Results Workspace Grid */}
        {result && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Column 1: Market Research Output */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-2">Agent_Output_01 // Research</div>
                <h3 className="text-lg font-bold mb-3 border-b border-zinc-800 pb-2">Market & News Summary</h3>
                <div className="text-sm text-zinc-300 space-y-2 whitespace-pre-line leading-relaxed">
                  {result.research}
                </div>
              </div>
            </div>

            {/* Column 2: Financial Metrics Output */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-2">Agent_Output_02 // Financials</div>
                <h3 className="text-lg font-bold mb-3 border-b border-zinc-800 pb-2">Financial Analysis & Risks</h3>
                <div className="text-sm text-zinc-300 space-y-2 whitespace-pre-line leading-relaxed">
                  {result.financials}
                </div>
              </div>
            </div>

            {/* Column 3: The Supervisor's Executive Verdict */}
            <div className="bg-zinc-900 border border-teal-900/60 rounded-xl p-6 bg-gradient-to-b from-zinc-900 via-zinc-900 to-teal-950/20 ring-1 ring-teal-500/10">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-2">Agent_Supervisor // Core_Decision</div>
              <h3 className="text-lg font-bold mb-3 border-b border-zinc-800 pb-2 text-zinc-100">Executive Committee Review</h3>
              <div className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed bg-zinc-950/60 p-4 border border-zinc-800/80 rounded-lg">
                {result.verdict}
              </div>
            </div>

          </section>
        )}
        
      </div>
    </main>
  );
}