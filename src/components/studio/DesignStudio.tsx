"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DesignStudioProps {
    onImageUploaded: (file: File) => void;
    isProcessing?: boolean;
    resultImage?: string | null;
    onReset?: () => void;
}

export function DesignStudio({ onImageUploaded, isProcessing, resultImage, onReset }: DesignStudioProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clear local preview when we have a real result from the server
    useEffect(() => {
        if (resultImage) {
            console.log("DesignStudio: Result received, clearing local preview.");
            setPreview(null);
        }
    }, [resultImage]);

    const handleFile = useCallback((file: File) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageUploaded(file);
        }
    }, [onImageUploaded]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    return (
        <div className="w-full">
            {!preview && !resultImage ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={cn(
                        "relative group cursor-pointer border-2 border-dashed border-white/10 rounded-3xl p-12 transition-all duration-300",
                        "hover:border-white/20 hover:bg-white/5",
                        isDragging && "border-white/40 bg-white/10"
                    )}
                >
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="p-4 rounded-full glass">
                            <Upload className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-xl font-medium text-white mb-1">
                                Upload Floor Plan
                            </p>
                            <p className="text-sm text-zinc-500">
                                Drag and drop your 2D sketch or floor plan
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-3xl overflow-hidden glass aspect-video">
                    <img
                        key={resultImage || preview || 'empty'}
                        src={(resultImage || preview) ?? undefined}
                        alt="Design View"
                        className={cn(
                            "w-full h-full object-cover transition-opacity duration-700",
                            isProcessing ? "opacity-40 grayscale" : "opacity-100"
                        )}
                    />
                    {resultImage && (
                        <div className="absolute top-4 left-4 px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                            Generated Design
                        </div>
                    )}
                    {!isProcessing && !resultImage && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => { setPreview(null); onReset?.(); }}
                                className="gap-2"
                            >
                                <X className="w-4 h-4" /> Replace
                            </Button>
                        </div>
                    )}
                    {resultImage && (
                        <div className="absolute top-4 right-4 z-20">
                            <Button
                                variant="glass"
                                size="sm"
                                className="bg-white/10"
                                onClick={() => { setPreview(null); onReset?.(); }}
                            >
                                <X className="w-4 h-4 mr-2" /> New Design
                            </Button>
                        </div>
                    )}
                    {isProcessing && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                            <p className="text-white font-medium">Architectural Engine Processing...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
