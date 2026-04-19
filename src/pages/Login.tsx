import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Shield, ArrowRight } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        if (!isLogin && !data.token) {
          // If register doesn't return token, auto-login or switch to login
          setIsLogin(true);
          setFormData({ ...formData, password: "" });
        } else {
          login(data.user, data.token || data.user.id);
          navigate("/profile");
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center relative z-10 px-6">
      <div className="w-full max-w-md bg-brand-charcoal border border-white/5 p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Shield className="w-48 h-48" />
        </div>
        
        <h2 className="text-4xl italic font-black mb-8 uppercase tracking-tighter">
          {isLogin ? "CLIENT_ACCESS" : "NEW_OPERATIVE"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 mb-6 font-mono text-[10px] text-red-500 uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest px-1">First_Name</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-brand-toxic outline-none" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest px-1">Last_Name</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-brand-toxic outline-none" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest px-1">Secure_Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-brand-toxic outline-none" />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest px-1">Pass_Code</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 text-sm font-mono focus:border-brand-toxic outline-none" />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-brand-toxic text-brand-black py-4 font-display font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
            {loading ? "INITIALIZING..." : (isLogin ? "AUTHORIZE_ACCESS" : "CREATE_IDENTITY")}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="font-mono text-[10px] text-brand-gray uppercase tracking-widest hover:text-white transition-colors">
            {isLogin ? "Bypass_Security // Register_New" : "Return_to_Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
