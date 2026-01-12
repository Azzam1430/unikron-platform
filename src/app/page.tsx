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
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const handleImageUploaded = (file: File) => {
    // In a real app, we'd upload this to a server
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
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 3000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050505] text-white">
      {/* Dark background without orbs */}


      {/* Nav */}
      <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Unikron Logo" className="w-10 h-10 object-contain" />
          <div className="text-2xl font-bold tracking-tighter">UNIKRON</div>
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

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl glass-dark space-y-6"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold italic">PROPOSAL #UK-2026</h4>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs">Ready for Checkout</div>
              </div>
              <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 font-mono text-xs opacity-50">RENDER_VERSION_4.2 // LUXE_ESTATE</div>
              </div>
              <Button variant="primary" className="w-full" size="lg">
                Finalize & Checkout
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
