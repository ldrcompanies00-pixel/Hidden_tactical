import { useState, useMemo, useEffect } from "react";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import { Product } from "../types";

interface HomeProps {
  onAddToCart: (p: Product) => void;
  onSelectItem: (p: Product) => void;
  initialFilter?: string;
}

export default function Home({ onAddToCart, onSelectItem, initialFilter = "Gear" }: HomeProps) {
  useEffect(() => {
    // Scroll to top on page mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex-grow">
      <Hero />
      
      {/* Banner Section */}
      <div className="bg-brand-toxic py-4 overflow-hidden border-y border-brand-black relative z-10">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="font-mono text-[10px] font-black text-brand-black uppercase tracking-[0.5em] mx-12">
              REINFORCED_MATERIALS // TACTICAL_GEAR // URBAN_SURVIVAL //
            </span>
          ))}
        </div>
      </div>

      <ProductGrid 
        onAddToCart={onAddToCart} 
        onSelectItem={onSelectItem} 
        initialFilter={initialFilter}
      />

      {/* Brand Statement */}
      <section className="py-48 bg-brand-charcoal text-center overflow-hidden relative">
        <div className="absolute inset-0 tread-pattern-overlay opacity-20" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-8xl mb-12 italic">
            WE ARE <span className="text-brand-toxic">THE SHADOWS</span> IN THE DUST.
          </h2>
          <p className="font-sans text-sm text-brand-gray max-w-xl mx-auto leading-loose uppercase tracking-widest font-bold">
            Rooted in Supermoto culture. Engineered for the underground. 
            Hidden is more than gear, it's a tactical mindset.
          </p>
        </div>
      </section>
    </div>
  );
}
