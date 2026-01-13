import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;
        const style = formData.get("style") as string;
        const prompt = formData.get("prompt") as string;

        if (!file) {
            return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
        }

        const API_KEY = process.env.NANO_BANANA_API_KEY;
        if (!API_KEY) {
            // Demo fallback if no key
            return NextResponse.json({
                imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000",
                id: "demo-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
            });
        }

        const nanoFormData = new FormData();
        nanoFormData.append("image", file);
        nanoFormData.append("style", style);
        if (prompt) nanoFormData.append("prompt", prompt);

        const response = await fetch("https://api.nanobanana.ai/v1/image-to-image", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: nanoFormData,
        });

        if (!response.ok) {
            throw new Error(`Nano Banana API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
