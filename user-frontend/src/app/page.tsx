"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setStatusText("Initiating Eternal Architect...");

    try {
      // Step 1: The backend orchestrator is called
      const response = await fetch("http://localhost:8000/orchestrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "default_mcp_user",
          prompt: prompt,
        }),
      });

      setStatusText("Waiting for deployment (this takes 1-2 mins)...");
      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setStatusText("Deployment Complete!");
      } else {
        setStatusText("Error during deployment.");
        console.error(data);
      }
    } catch (err) {
      setStatusText("Network error.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-8 font-sans">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Enter Web <span className="text-sm font-normal text-gray-500">(Sentient Mode)</span></h1>
        <div className="text-sm text-gray-400">Powered by Parcle & Eternal Architect</div>
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col gap-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl">
          <h2 className="text-lg font-semibold mb-4">Prompt the Architect</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
              rows={4}
              placeholder="e.g., Build a login page. Make it look like https://stripe.com and use a Postgres database."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt}
              className="self-end bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? "Architecting..." : "Generate App"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="bg-blue-900/20 border border-blue-800/50 p-6 rounded-xl text-center animate-pulse">
            <p className="text-blue-400 font-medium">{statusText}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-900/20 border border-green-800/50 p-6 rounded-xl flex flex-col gap-4">
            <h3 className="text-xl font-bold text-green-400">✅ {result.message}</h3>
            
            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Live Preview URL</h4>
              <a href={result.preview_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline break-all">
                {result.preview_url}
              </a>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Eternal Architect Memory Context Used</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {result.architect_context_used}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
