// Cloudflare Worker in front of the static site: POST /api/contact emails the form to the owner through Resend; every
// other path is the built site. RESEND_API_KEY is a secret set in the Cloudflare dashboard.

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY: string;
}

// Resend's test sender delivers only to the address the Resend account was made with
const OWNER = "mohak.shah21@outlook.com";
const LIMITS = { name: 100, email: 200, message: 5000 };

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname !== "/api/contact") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return json({ success: false, error: "Use POST" }, 405);

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return json({ success: false, error: "Invalid request" }, 400);
    }
    const [name, email, message] = (["name", "email", "message"] as const).map((key) =>
      typeof body[key] === "string" ? (body[key] as string).trim() : ""
    );
    if (!name || !email || !message) return json({ success: false, error: "Name, email and message are required" }, 400);
    if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message)
      return json({ success: false, error: "Message is too long" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ success: false, error: "Invalid email address" }, 400);

    // Plain text, so nothing a visitor types is rendered as HTML in the inbox
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [OWNER],
        reply_to: email,
        subject: `Portfolio message from ${name.replace(/[\r\n]+/g, " ")}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!sent.ok) {
      console.error("Resend error", sent.status, await sent.text());
      // The status alone (401 bad key, 403 recipient not allowed) says what to fix without exposing Resend's reply
      return json({ success: false, error: `Could not send the message (mail service ${sent.status})` }, 502);
    }
    return json({ success: true });
  },
};
