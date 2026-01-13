import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeKey ? new Stripe(stripeKey, {
    apiVersion: "2025-01-27-acacia" as any,
}) : null;

export async function createCheckoutSession(amount: number, styleName: string) {
    try {
        if (!stripe) {
            throw new Error("Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local");
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Unikron Project Finalization - ${styleName} Design`,
                            description: "Full architectural report and high-resolution 3D renders.",
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        });

        return session.url;
    } catch (error) {
        console.error("Stripe session creation failed:", error);
        throw error;
    }
}
