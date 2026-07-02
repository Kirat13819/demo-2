import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  CornerDownLeft,
  ArrowRight,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am Aria's AI Companion. I can tell you about Aria's art direction practice, her 2025 Tokyo exhibition, or help you start a design collaboration. What would you like to know?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : message;
    if (!rawText.trim() || loading) return;

    const userMsg = rawText.trim();
    if (textToSend === undefined) {
      setMessage("");
    }
    setError(null);
    setLoading(true);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to communicate with AI server");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const starterQuestions = [
    { text: "What services do you offer?", query: "Could you list some of the visual design and art direction services Aria provides?" },
    { text: "Exhibition in Tokyo", query: "Can you tell me more about Aria's digital art exhibition in Tokyo?" },
    { text: "Is Aria available?", query: "Is Aria currently open to new design commissions or lectures?" }
  ];

  return (
    <div id="ai-chatbot-wrapper" className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {!isOpen ? (
          /* FLOATING BOT TRIGGER BUTTON */
          <motion.button
            id="ai-bot-trigger"
            key="bot-trigger"
            initial={{ scale: 0, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 30 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-white/10 hover:border-[#85AB8B] text-[#85AB8B] shadow-2xl transition-all cursor-pointer relative"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6 stroke-[1.8]" />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85AB8B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#85AB8B]"></span>
            </span>
          </motion.button>
        ) : (
          /* CHAT WINDOW CONTAINER */
          <motion.div
            id="ai-chat-window"
            key="chat-window"
            initial={{ scale: 0.85, opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 0.85, opacity: 0, y: 50, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="flex flex-col w-[380px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-100px)] rounded-[24px] bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden font-sans"
            ref={containerRef}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-neutral-900 select-none">
              <div className="flex items-center space-x-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#85AB8B]">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-none mb-1">Aria AI Assistant</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-white/40 font-medium font-mono uppercase tracking-wide">Studio Companion</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Messages Body */}
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto px-5 py-6 space-y-4 select-text hide-scrollbar"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex w-full ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-[18px] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-white text-black font-medium"
                        : "bg-white/5 border border-white/5 text-white/95"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Loading bubble */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-[18px] px-4 py-3 text-sm text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin text-[#85AB8B]" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              )}

              {/* Error Block */}
              {error && (
                <div className="text-center bg-red-950/40 border border-red-900/40 text-red-400 rounded-xl p-3 text-xs">
                  {error}
                </div>
              )}
            </div>

            {/* Quick Prompts Options */}
            {messages.length === 1 && !loading && (
              <div className="px-5 pb-3 pt-1 select-none">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#85AB8B] mb-2">Suggested Topics</p>
                <div className="flex flex-col space-y-2">
                  {starterQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q.query)}
                      className="flex items-center justify-between text-left text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 rounded-xl px-4 py-2.5 transition-all cursor-pointer group"
                    >
                      <span>{q.text}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all text-[#85AB8B]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 border-t border-white/5 bg-neutral-900 select-none flex items-center space-x-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your question..."
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 hover:border-white/10 focus:border-[#85AB8B] focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#85AB8B] text-black hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Send message"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
