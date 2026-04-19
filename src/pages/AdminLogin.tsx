import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ShieldAlert, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

export default function AdminLogin() {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(false);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });

      if (res.ok) {
        localStorage.setItem("admin_auth", "true");
        navigate("/admin");
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-charcoal border border-white/5 p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-black border border-white/5 flex items-center justify-center mb-6 group">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Lock className="w-8 h-8 text-brand-toxic group-hover:rotate-12 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <h1 className="text-3xl italic font-black uppercase tracking-tighter mb-2">RESTRICTED_ACCESS</h1>
          <p className="font-mono text-[10px] text-brand-gray uppercase tracking-widest">Sector: COMMAND_CENTER_GATEWAY</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-brand-gray ml-1">Universal_Passkey</label>
            <div className="relative">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-toxic" />
              <input 
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                autoFocus
                className={cn(
                  "w-full bg-black/50 border border-white/5 pl-12 pr-4 py-4 font-mono text-sm uppercase tracking-widest outline-none focus:border-brand-toxic transition-all text-brand-toxic",
                  error && "border-red-500 text-red-500 focus:border-red-500"
                )}
                placeholder="........"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-brand-toxic text-brand-black py-4 font-mono text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
          >
            {isAuthenticating ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
            ) : (
              <>
                INITIALIZE_UPLINK
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 text-center font-mono text-[9px] text-red-500 uppercase tracking-widest font-bold"
            >
              !! Authentication_Failure: INVALID_SIGNAL_DETECTED !!
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-brand-toxic" />
            <span className="font-mono text-[8px] uppercase tracking-widest">TLS_ENCRYPTED</span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-widest">BUILD_77X.9</span>
        </div>
      </motion.div>
    </div>
  );
}
