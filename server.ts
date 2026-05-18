import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set in environment variables.");
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, body, botcheck } = req.body;
      
      // Honeypot check for bots
      if (botcheck) {
        // Silently drop but return success to fool the bot
        return res.status(200).json({ success: true });
      }

      if (!name || !email || !body) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Por favor, ingresa un correo electrónico válido." });
      }

      let resend;
      try {
        resend = getResend();
      } catch (err) {
        console.warn("Resend API key missing, just logging the message:", req.body);
        // We simulate a success here so the user can test the UI without the API key yet.
        return res.status(200).json({ success: true, message: "Logged to console (API Key missing)" });
      }

      await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: "baez@hitster.page",
        subject: `Nuevo contacto web de: ${name}`,
        html: `
          <h3>Nuevo mensaje de contacto web</h3>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${body.replace(/\n/g, "<br>")}</p>
        `,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error interno al enviar el correo." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express 4 uses '*' for catch-all
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
