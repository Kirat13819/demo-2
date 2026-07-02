import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of the Gemini client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// System Instruction to style the chatbot as Aria Chen's smart companion
const SYSTEM_INSTRUCTION = `You are the Aria Chen AI Portfolio Companion, an elegant, highly professional, and minimalist digital assistant.
Aria Chen is an elite, independent Art Director and Visual Designer.
Your tone should be articulate, refined, contemporary, and helpful, mirroring the high-end minimalist design aesthetic of Aria's portfolio.
Avoid excessively exclamation marks, promotional fluff, or long rambling paragraphs. Keep answers concise, beautiful, and structured.

Here are the facts about Aria Chen:
- Branding: Aria Chen™ is an Independent Art Director focusing on minimalist systems and high-fidelity visual storytelling for global institutions.
- Current Practice: Currently exploring the tactile qualities of digital interfaces and the future of spatial interaction design.
- Milestones / Timeline:
  * 2025: Opening of the "Digital Soul" solo exhibition in Tokyo, exploring the intersection of generative algorithms and traditional typography.
  * 2024: Guest Lecturer at Basel School of Design, focusing on minimalist interface systems and the psychology of negative space.
  * 2023: Won the "International Design Excellence" award for rebranding the Global Archive, a study in timeless modernism.
  * 2022: Founded "Studio Aria" in London, transitioning from agency lead to independent direction.
- Collaborative Offerings:
  * Visual Design (Systematic): Core Brand Identity, Design Systems, Typography Foundations.
  * Art Direction (Conceptual): Creative Strategy, Photography Direction, Narrative Storytelling.
  * Product Core (Strategic): UI/UX Ecosystems, Motion Foundations, Prototype Systems.
- Availability: Currently accepting selected commissions for late 2024 and beyond. Visitors can click the "Start Collaboration" button to inquire.

Answer questions based on this information. If visitors ask general visual design questions, offer refined minimalist perspectives.`;

// Backend API route for chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Format chat history for @google/genai content schema:
    // [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const formattedContents: any[] = [];

    if (Array.isArray(history)) {
      history.forEach((msg: any) => {
        if ((msg.role === "user" || msg.role === "model") && msg.text) {
          formattedContents.push({
            role: msg.role,
            parts: [{ text: msg.text }]
          });
        }
      });
    }

    // Append current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was unable to formulate a response. Please try again.";
    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while contacting the AI assistant." 
    });
  }
});

// Vite Middleware integrated after API routes
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving compiled static assets from dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite startup error:", err);
});
