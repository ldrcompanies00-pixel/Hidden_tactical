import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Tread Pattern Background element */}
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] tread-pattern-overlay z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 md:grid-cols-[1fr_1.2fr] items-center gap-12">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-display font-black text-xs tracking-[5px] text-brand-toxic uppercase mb-6">
              Tactical Supermoto
            </p>
            <h1 className="text-[110px] md:text-[140px] leading-[0.85] mb-12 font-black tracking-[-6px]">
              STAY <br />
              <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1px var(--color-brand-white)' }}>UNSEEN</span> <br />
              RIDE FAST
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-8"
          >
            <button className="bg-brand-toxic text-brand-black px-12 py-5 font-display font-black text-sm tracking-widest uppercase italic hover:bg-white transition-all transform hover:scale-105">
              Shop Drop 004
            </button>
            <div className="text-[11px] text-brand-gray w-48 leading-relaxed font-bold uppercase tracking-tighter">
              Engineered for the streets. Tested in the dirt. Limit 2 items per customer.
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block">
          {/* Decorative larger image or visual can go here, for now it balances the Grid */}
        </div>
      </div>
      
      {/* Scrolling Text Marquee */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden whitespace-nowrap opacity-5 select-none">
        <div className="animate-marquee inline-block text-[15rem] font-black uppercase italic tracking-tighter">
          HIDDEN HIDDEN HIDDEN HIDDEN HIDDEN HIDDEN HIDDEN
        </div>
        <div className="animate-marquee inline-block text-[15rem] font-black uppercase italic tracking-tighter ml-12">
          HIDDEN HIDDEN HIDDEN HIDDEN HIDDEN HIDDEN HIDDEN
        </div>
      </div>
    </div>
  );
}
