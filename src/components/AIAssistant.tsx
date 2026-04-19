import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X, Send, Terminal, Shield } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'SYSTEM_READY: I am your Hidden Supply Specialist. State your riding conditions or gear requirements for tactical analysis.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the "Hidden Supply Specialist", a tactical AI for a high-end Supermoto/Motocross streetwear brand called "Hidden". 
          Your tone is professional, technical, mysterious, and tactical. 
          Use terms like "Depot", "Analysis", "Briefing", "Sector", "Thermal Protection".
          The brand sells: Tactical Stealth Goggles, Carbon Grip Gloves, Heavyweight Hoodies, and Technical Balaclavas. 
          Respond concisely. If asked for a recommendation, explain the tactical advantage of the gear (e.g. anti-fog, knuckle protection, moisture-wicking).`,
        },
        contents: input,
      });

      const botMsg = { role: 'bot' as const, text: response.text || "COMM_ERROR: Signal lost. Re-establishing link..." };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'FATAL_ERROR: Uplink compromised. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 w-14 h-14 bg-brand-toxic text-brand-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.4)] z-[90] hover:scale-110 transition-transform group"
      >
        <Shield className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-full max-w-sm h-[500px] bg-brand-black border border-white/10 z-[100] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-charcoal p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-toxic" />
                <span className="font-mono text-[10px] uppercase tracking-[2px] font-bold">Uplink: Hidden_Spec</span>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 hover:text-brand-toxic" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 tread-pattern-overlay">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 font-mono text-[11px] leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-brand-toxic text-brand-black font-bold' 
                      : 'bg-white/5 border border-white/5 text-white/80'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 font-mono text-[10px] animate-pulse">ANALYZING_INPUT...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-brand-charcoal border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="INPUT_QUERY_HERE"
                className="flex-1 bg-black border border-white/5 p-2 font-mono text-[10px] focus:outline-none focus:border-brand-toxic transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="w-10 h-10 bg-brand-toxic text-brand-black flex items-center justify-center hover:bg-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
