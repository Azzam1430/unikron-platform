"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import inventory from "@/data/inventory.json";

interface StylePickerProps {
    onStyleSelect: (styleId: string, customPrompt?: string) => void;
}

export function StylePicker({ onStyleSelect }: StylePickerProps) {
    const [selectedStyle, setSelectedStyle] = useState<string>("signature");
    const [customPrompt, setCustomPrompt] = useState("");

    const handleStyleClick = (styleId: string) => {
        setSelectedStyle(styleId);
        if (styleId !== "custom") {
            onStyleSelect(styleId);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                {inventory.styles.map((style) => (
                    <Button
                        key={style.id}
                        variant={selectedStyle === style.id ? "primary" : "glass"}
                        onClick={() => handleStyleClick(style.id)}
                        className="capitalize"
                    >
                        {style.name}
                    </Button>
                ))}
            </div>

            {selectedStyle === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe your vision (e.g., 'Modern Nordic with industrial lighting')..."
                        className="w-full h-32 p-4 rounded-2xl glass-dark text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => onStyleSelect("custom", customPrompt)}
                    >
                        Apply Prompt
                    </Button>
                </div>
            )}
        </div>
    );
}
