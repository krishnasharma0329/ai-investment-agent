"use client";

import { useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed. Please try again.");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen p-4 md:p-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eef2f7" />
            </linearGradient>
            <linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill="url(#bg)" />
          <g stroke="#cbd5e1" strokeWidth="1" opacity="0.22">
            <path d="M0 120h1200" />
            <path d="M0 240h1200" />
            <path d="M0 360h1200" />
            <path d="M0 480h1200" />
            <path d="M0 600h1200" />
            <path d="M0 720h1200" />
            <path d="M150 0v800" />
            <path d="M300 0v800" />
            <path d="M450 0v800" />
            <path d="M600 0v800" />
            <path d="M750 0v800" />
            <path d="M900 0v800" />
            <path d="M1050 0v800" />
          </g>
          <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
            <path d="M130 580v120" />
            <path d="M250 460v170" />
            <path d="M370 420v180" />
            <path d="M490 500v110" />
            <path d="M610 430v175" />
            <path d="M730 380v135" />
            <path d="M850 500v95" />
            <path d="M970 540v90" />
            <path d="M1090 460v125" />
          </g>
          <g fill="#22c55e" opacity="0.75">
            <rect x="120" y="610" width="40" height="45" rx="4" />
            <rect x="360" y="470" width="40" height="75" rx="4" />
            <rect x="610" y="490" width="40" height="60" rx="4" />
            <rect x="850" y="520" width="40" height="55" rx="4" />
          </g>
          <g fill="#ef4444" opacity="0.75">
            <rect x="240" y="520" width="40" height="120" rx="4" />
            <rect x="490" y="520" width="40" height="70" rx="4" />
            <rect x="730" y="430" width="40" height="102" rx="4" />
            <rect x="970" y="560" width="40" height="70" rx="4" />
            <rect x="1090" y="510" width="40" height="75" rx="4" />
          </g>
          <rect x="0" y="0" width="1200" height="800" fill="url(#shadow)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/70 shadow-xl p-4 md:p-8">
        
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Investment Analyzer</h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base">
            AI-powered equity analysis for informed investment decisions
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleAnalyze} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company ticker (e.g., AAPL)"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-transparent transition"
              autoFocus
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-red-800 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Verdict Card */}
            <div className={`rounded-lg p-6 border-2 transition-all
              ${result.verdict === 'Invest' ? 'bg-green-50 border-green-300' : 
                result.verdict === 'Hold' ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg
                  ${result.verdict === 'Invest' ? 'bg-green-100' : 
                    result.verdict === 'Hold' ? 'bg-amber-100' : 'bg-red-100'}`}>
                  {result.verdict === 'Invest' ? (
                    <CheckCircle className={`w-6 h-6 ${result.verdict === 'Invest' ? 'text-green-700' : result.verdict === 'Hold' ? 'text-amber-700' : 'text-red-700'}`} />
                  ) : result.verdict === 'Hold' ? (
                    <HelpCircle className="w-6 h-6 text-amber-700" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-700" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-1
                    ${result.verdict === 'Invest' ? 'text-green-700' : 
                      result.verdict === 'Hold' ? 'text-amber-700' : 'text-red-700'}`}>
                    RECOMMENDATION
                  </p>
                  <h2 className={`text-3xl md:text-4xl font-bold
                    ${result.verdict === 'Invest' ? 'text-green-900' : 
                      result.verdict === 'Hold' ? 'text-amber-900' : 'text-red-900'}`}>
                    {result.verdict}
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pros */}
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" /> Strengths
                </h3>
                <ul className="space-y-3">
                  {result.pros?.map((pro: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" /> Risk Factors
                </h3>
                <ul className="space-y-3">
                  {result.cons?.map((con: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="text-red-600 font-bold flex-shrink-0">!</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Data Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Financials */}
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide mb-4">Financial Data</h3>
                <div className="space-y-3">
                  {result.financials?.map((item: string, i: number) => (
                    <div key={i} className="text-sm text-slate-700 border-l-2 border-slate-300 pl-3">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Research/News */}
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide mb-4">Market Intelligence</h3>
                <div className="space-y-3">
                  {result.research?.map((item: string, i: number) => (
                    <div key={i} className="text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}