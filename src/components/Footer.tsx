import { Eye, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-24 pb-12 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-brand-toxic rounded-sm flex items-center justify-center">
                <Eye className="w-5 h-5 text-brand-black" />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter uppercase">HIDDEN</span>
            </div>
            <p className="font-mono text-sm text-white/40 max-w-sm leading-relaxed mb-8">
              Stay in the shadows. High-performance tactical gear for those who ride the edge. 
              Designed in the underground, built for the dirt.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-brand-toxic hover:text-brand-toxic transition-all">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-brand-toxic hover:text-brand-toxic transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-brand-toxic hover:text-brand-toxic transition-all">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-toxic mb-6">Mission_Control</h4>
            <ul className="space-y-4 font-display font-bold text-lg italic uppercase">
              <li><Link to="/admin" className="hover:text-brand-toxic transition-colors text-white/80">Command_Center</Link></li>
              <li><Link to="/archive" className="hover:text-brand-toxic transition-colors">Archive</Link></li>
              <li><Link to="/" className="hover:text-brand-toxic transition-colors">Tactical Gear</Link></li>
              <li><a href="#" className="hover:text-brand-toxic transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-toxic mb-6">Comms_Channel</h4>
            <div className="flex flex-col gap-4">
              <p className="font-mono text-xs text-white/40">Secure your spot in the next drop.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="ENCRYPTED_EMAIL" 
                  className="w-full bg-brand-charcoal border border-white/5 py-3 px-4 font-mono text-xs focus:outline-none focus:border-brand-toxic transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-brand-toxic">
                  JOIN_
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12 gap-6">
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
            © 2024 HIDDEN_PROJECT. ALL SYSTEM RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Privacy_Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms_Of_Engagement</a>
            <a href="#" className="hover:text-white transition-colors">System_status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
