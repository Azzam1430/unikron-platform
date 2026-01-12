"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Zap, TrendingUp, PackagePlus } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
    const [summary, setSummary] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Mock logs
    const mockLogs = [
        "User searched for 'Bio-organic architecture'",
        "Custom prompt: 'Hyper-minimalist kitchen with raw concrete features'",
        "Selection: Luxe style for 150m2 project",
        "User searched for 'Solar integrated glass'",
        "Selection: Minimal style with custom prompt 'Hidden lighting'",
    ];

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        // In a real app, this would be an API call to our Gemini helper
        setTimeout(() => {
            setSummary(`
        ### Design Trend Summary
        The Unikron user base is currently pivoting towards **Industrial Minimalism** and **Bio-centric designs**. 
        Raw textures like concrete and raw wood are seeing a 45% increase in custom prompt frequency.

        ### Inventory Recommendations
        1. **Industrial Raw**: Add a style featuring exposed ducts and concrete finishes.
        2. **Biophilic Flora**: Integrate more plant-based and living wall options.
        3. **Smart Glass**: Launch a premium add-on for dynamic transparency controls.
      `);
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio
                        </Button>
                        <img src="/logo.png" alt="Unikron Logo" className="w-8 h-8 object-contain opacity-50" />
                    </div>
                    <div className="font-bold tracking-tighter text-xl text-zinc-600 italic">ADMIN_INTEL // V1.0</div>
                </header>

                <section className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Agentic Monitoring</h1>
                        <p className="text-zinc-500 mt-2">Gemini is currently monitoring 1,204 active design sessions.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-3xl space-y-2">
                            <TrendingUp className="w-6 h-6 text-zinc-400" />
                            <div className="text-sm text-zinc-500">Peak Trend</div>
                            <div className="text-xl font-bold">Industrial Raw</div>
                        </div>
                        <div className="glass p-6 rounded-3xl space-y-2">
                            <Zap className="w-6 h-6 text-zinc-400" />
                            <div className="text-sm text-zinc-500">Active Prompts</div>
                            <div className="text-xl font-bold">428 Custom</div>
                        </div>
                        <div className="glass p-6 rounded-3xl space-y-2">
                            <PackagePlus className="w-6 h-6 text-zinc-400" />
                            <div className="text-sm text-zinc-500">Conversion</div>
                            <div className="text-xl font-bold">12.4%</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">AI Trend Summary</h2>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? "Analyzing..." : "Refresh Intelligence"}
                            </Button>
                        </div>

                        <div className="glass-dark rounded-[2.5rem] p-8 min-h-[300px] border-white/5 relative overflow-hidden">
                            {!summary && !isAnalyzing && (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                    Select 'Refresh Intelligence' to run Gemini Deep Think analysis
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-white/5 rounded w-3/4" />
                                    <div className="h-4 bg-white/5 rounded w-1/2" />
                                    <div className="h-4 bg-white/5 rounded w-5/6" />
                                </div>
                            )}

                            {summary && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-invert max-w-none text-zinc-300 leading-relaxed"
                                >
                                    <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
