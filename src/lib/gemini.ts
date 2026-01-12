import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function summarizeTrends(logs: string[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" });

    const prompt = `
    As a market analyst for Unikron (a luxury construction and design firm), analyze the following user activity logs and summarize the current design trends. 
    Also, suggest new inventory additions based on high-frequency keywords in custom prompts.

    Logs:
    ${logs.join("\n")}

    Provide a concise technical summary and 3 bulleted recommendations for the inventory.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini trend analysis failed:", error);
        return "Trend analysis unavailable at this time.";
    }
}
