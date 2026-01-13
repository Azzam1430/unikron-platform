import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Stripe from "stripe";

export async function GET() {
    const diagnostics = {
        gemini: { status: "pending", message: "" },
        stripe: { status: "pending", message: "" },
        nano_banana: { status: "pending", message: "" },
    };

    // Test Gemini
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("Key missing");

        // Try to list models to see what's available
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
        if (!resp.ok) throw new Error(`ListModels failed: ${resp.statusText}`);
        const data = await resp.json();
        const hasFlash = data.models?.some((m: any) => m.name.includes("gemini-1.5-flash"));

        if (hasFlash) {
            diagnostics.gemini = { status: "ok", message: "Key valid & models found" };
        } else {
            diagnostics.gemini = { status: "ok", message: "Key valid but models limited" };
        }
    } catch (e: any) {
        diagnostics.gemini = { status: "error", message: e.message };
    }

    // Test Stripe
    try {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) throw new Error("Key missing");
        const stripe = new Stripe(key, { apiVersion: "2025-01-27-acacia" as any });
        await stripe.paymentIntents.list({ limit: 1 });
        diagnostics.stripe = { status: "ok", message: "API connection successful" };
    } catch (e: any) {
        diagnostics.stripe = { status: "error", message: e.message };
    }

    // Test Nano Banana (Simple Header Check)
    try {
        const key = process.env.NANO_BANANA_API_KEY;
        if (!key) throw new Error("Key missing");
        diagnostics.nano_banana = { status: "ok", message: "Key present (deployment check required for full validation)" };
    } catch (e: any) {
        diagnostics.nano_banana = { status: "error", message: e.message };
    }

    return NextResponse.json(diagnostics);
}
