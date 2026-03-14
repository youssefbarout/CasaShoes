import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const {
  PORT = 3001,
  WA_VERIFY_TOKEN,
  WA_ACCESS_TOKEN,
  WA_PHONE_NUMBER_ID,
} = process.env;

const requiredEnv = ["WA_VERIFY_TOKEN", "WA_ACCESS_TOKEN", "WA_PHONE_NUMBER_ID"];

function isConfigured() {
  return requiredEnv.every((key) => Boolean(process.env[key]));
}

function buildReply(text) {
  const clean = (text || "").toLowerCase().trim();

  if (!clean) {
    return "Bonjour 👋 Bienvenue chez CasaShoes. Tape: prix, livraison, tailles, promo ou humain.";
  }

  if (clean.includes("prix") || clean.includes("tarif")) {
    return "Nos prix varient selon le modèle. Donne-moi le nom de la paire et je te réponds avec le prix exact.";
  }

  if (clean.includes("livraison") || clean.includes("delai") || clean.includes("délai")) {
    return "Livraison au Maroc en 24-72h selon la ville. Paiement à la livraison disponible.";
  }

  if (clean.includes("taille") || clean.includes("pointure")) {
    return "Nous proposons généralement du 36 au 44 selon les modèles. Dis-moi la paire souhaitée et je vérifie le stock.";
  }

  if (clean.includes("promo") || clean.includes("reduction") || clean.includes("réduction")) {
    return "Nous lançons des promos chaque semaine. Je peux te prévenir dès qu'une offre est active sur ton modèle préféré.";
  }

  if (clean.includes("humain") || clean.includes("agent") || clean.includes("conseiller")) {
    return "Parfait. Un conseiller va reprendre la conversation rapidement. Merci de patienter quelques instants.";
  }

  return "Merci pour ton message. Je peux t'aider sur: prix, livraison, tailles, promo. Tu peux aussi écrire humain pour parler à un conseiller.";
}

async function sendWhatsAppText(to, body) {
  const url = `https://graph.facebook.com/v22.0/${WA_PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} ${errorText}`);
  }
}

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "CasaShoes WhatsApp Bot",
    configured: isConfigured(),
  });
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WA_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message?.text?.body || "";

    if (!from) {
      return res.sendStatus(200);
    }

    if (!isConfigured()) {
      console.error("Missing env vars. Please set WA_VERIFY_TOKEN, WA_ACCESS_TOKEN, WA_PHONE_NUMBER_ID.");
      return res.sendStatus(200);
    }

    const reply = buildReply(text);
    await sendWhatsAppText(from, reply);

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`WhatsApp bot server listening on port ${PORT}`);
});
