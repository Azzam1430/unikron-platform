"use client";

import { useState } from "react";
import { DesignStudio } from "@/components/studio/DesignStudio";
import { StylePicker } from "@/components/studio/StylePicker";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Sparkles, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import inventory from "@/data/inventory.json";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<string>("signature");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<string>("standard");
  const [renderId, setRenderId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleImageUploaded = (file: File) => {
    setUploadedFile(file);
    console.log("Image uploaded:", file.name);
  };

  const calculateTotal = (styleId: string, addons: string[], complex: string) => {
    const style = inventory.styles.find(s => s.id === styleId);
    if (style) {
      let base = style.pricePerSquareMeter * 100; // 100m2 base

      const multiplier = (inventory as any).complexityMultipliers[complex] || 1.0;
      base *= multiplier;

      const addonsTotal = addons.reduce((acc, id) => {
        const addon = inventory.addons.find(a => a.id === id);
        return acc + (addon?.price || 0);
      }, 0);

      setTotalPrice(base + addonsTotal);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    calculateTotal(styleId, selectedAddons, complexity);
  };

  const toggleAddon = (addonId: string) => {
    const newAddons = selectedAddons.includes(addonId)
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId];
    setSelectedAddons(newAddons);
    calculateTotal(selectedStyle, newAddons, complexity);
  };

  const handleComplexityChange = (value: string) => {
    setComplexity(value);
    calculateTotal(selectedStyle, selectedAddons, value);
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsProcessing(false);
      const newId = Math.random().toString(36).substr(2, 6).toUpperCase();
      setRenderId(newId);
      // Set a result image based on style for the demo
      const sampleResult = selectedStyle === "minimal"
        ? "/result_minimal.png"
        : "/result_luxe.png";
      setResultImage(sampleResult);
      setStep(2);
    }, 3000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050505] text-white">
      {/* Dark background without orbs */}


      {/* Nav */}
      <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src="/logo.png" alt="Unikron Logo" className="w-16 h-16 object-contain hover:scale-105 transition-transform" />
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin'}>
            <LayoutDashboard className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="sm" className="gap-2">
            <ShoppingCart className="w-4 h-4" /> Cart
          </Button>
        </div>
      </nav>

      {/* Hero / Studio Workspace */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8 sticky top-24">
          <div>
            <span className="text-zinc-500 font-medium tracking-widest uppercase text-sm">
              Future of Living
            </span>
            <p className="mt-2 text-xl text-zinc-400 max-w-md leading-relaxed">
              Transform your 2D concepts into cinematic 3D interior experiences with the Unikron architectural engine.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
              1. Choose your Aesthetic
            </h3>
            <StylePicker onStyleSelect={handleStyleSelect} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
              2. Project Customization
            </h3>
            <div className="flex flex-wrap gap-3">
              {inventory.addons.map(addon => (
                <Button
                  key={addon.id}
                  variant={selectedAddons.includes(addon.id) ? "primary" : "glass"}
                  size="sm"
                  onClick={() => toggleAddon(addon.id)}
                >
                  {addon.name} (+${addon.price})
                </Button>
              ))}
            </div>
            <div className="flex gap-2 p-1 glass rounded-full w-fit">
              {Object.keys(inventory.complexityMultipliers).map(key => (
                <button
                  key={key}
                  onClick={() => handleComplexityChange(key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all",
                    complexity === key ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {key.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {totalPrice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-3xl glass inline-block"
              >
                <p className="text-zinc-500 text-sm">Estimated Project Total (100m²)</p>
                <p className="text-4xl font-bold mt-1 text-gradient">
                  ${totalPrice.toLocaleString()}.00
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">
              3. Upload Floor Plan
            </h3>
            <DesignStudio onImageUploaded={handleImageUploaded} isProcessing={isProcessing} />
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              size="lg"
              className="gap-3 group"
              onClick={handleGenerate}
              disabled={isProcessing}
            >
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              Generate Design
            </Button>
          </div>

          {step === 2 && !isCheckoutSuccess && (
            <div className="p-8 rounded-3xl glass-dark space-y-6 border border-white/10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold italic tracking-tighter">PROJECT_BILL // #UK-2026</h4>
                <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Awaiting Payment</div>
              </div>

              <div className="space-y-3 py-4 border-y border-white/5 font-mono text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Base Style ({selectedStyle.toUpperCase()})</span>
                  <span className="text-white">${(inventory.styles.find(s => s.id === selectedStyle)?.pricePerSquareMeter || 0) * 100}.00</span>
                </div>
                {selectedAddons.length > 0 && selectedAddons.map(id => (
                  <div key={id} className="flex justify-between">
                    <span>Add-on: {inventory.addons.find(a => a.id === id)?.name}</span>
                    <span className="text-white">+${inventory.addons.find(a => a.id === id)?.price}.00</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Complexity Multiplier ({complexity.replace('_', ' ').toUpperCase()})</span>
                  <span className="text-white">x{(inventory as any).complexityMultipliers[complexity]}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 text-sm font-bold">
                  <span className="text-zinc-500">Total Estimate</span>
                  <span className="text-gradient">${totalPrice?.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-mono">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-zinc-500">ATTACHED_PLAN:</span>
                <span className="text-white truncate">{uploadedFile?.name || "unnamed_plan.pdf"}</span>
              </div>

              <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative group border border-white/5">
                {resultImage && (
                  <img src={resultImage} alt="Generated 3D Design" className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 font-mono text-[10px] opacity-40 tracking-widest text-white">
                  VERIFIED_ARCHITECTURAL_RENDER_4.2 // {renderId}
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full group overflow-hidden relative"
                size="lg"
                onClick={() => setIsCheckoutSuccess(true)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Finalize & Checkout <Sparkles className="w-4 h-4" />
                </span>
              </Button>
            </div>
          )}

          {isCheckoutSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-[3rem] glass flex flex-col items-center text-center space-y-6 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center animate-bounce">
                <Sparkles className="w-10 h-10 text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gradient">Payment Successful</h2>
                <p className="text-zinc-500 mt-2">Project #UK-2026 has been finalized.<br />Check your email for the high-res renders.</p>
              </div>
              <Button variant="glass" onClick={() => { setStep(1); setIsCheckoutSuccess(false); setResultImage(null); setUploadedFile(null); setSelectedAddons([]); }}>
                Start New Project
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-12 px-8 max-w-7xl mx-auto text-zinc-600 text-sm flex justify-between">
        <div>© 2026 UNIKRON ARCHITECTS.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Behance</a>
          <a href="#" className="hover:text-white transition-colors">Journal</a>
        </div>
      </footer>
    </main>
  );
}
