import crypto from "crypto";

export async function sendMetaCAPI(event: {
    eventName: "Purchase" | "InitiateCheckout" | "AddToCart";
    email?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    value?: number;
    orderId?: string;
    clientIp?: string;
    userAgent?: string;
}) {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
        console.warn("Meta CAPI Warning: META_PIXEL_ID or META_ACCESS_TOKEN env vars are missing.");
        return;
    }

    // Helper to SHA-256 hash personal data (Meta requirement)
    const hash = (val?: string | null) => {
        if (!val) return undefined;
        const cleaned = val.trim().toLowerCase();
        return crypto.createHash("sha256").update(cleaned).digest("hex");
    };

    // Prepare hashed customer fields
    const userData: any = {};
    if (event.email) userData.em = [hash(event.email)];
    if (event.phone) userData.ph = [hash(event.phone)];
    if (event.firstName) userData.fn = [hash(event.firstName)];
    if (event.lastName) userData.ln = [hash(event.lastName)];
    
    if (event.clientIp) userData.client_ip_address = event.clientIp;
    if (event.userAgent) userData.client_user_agent = event.userAgent;

    const payload = {
        data: [
            {
                event_name: event.eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: event.orderId || `evt_${Math.random().toString(36).slice(2, 11)}`,
                user_data: userData,
                custom_data: {
                    currency: "TRY",
                    value: event.value || 0
                },
                action_source: "website"
            }
        ]
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const resData = await response.json();
        if (resData.error) {
            console.error("Meta CAPI Error:", resData.error);
        } else {
            console.log(`Meta CAPI Success: Fired ${event.eventName} for order ${event.orderId}`);
        }
    } catch (error) {
        console.error("Meta CAPI Fetch Exception:", error);
    }
}
