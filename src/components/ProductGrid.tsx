import { useEffect, useState } from "react";
import { Product } from "@/src/types";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface ProductGridProps {
  onAddToCart: (p: Product) => void;
  onSelectItem: (p: Product) => void;
  initialFilter?: string;
}

export default function ProductGrid({ onAddToCart, onSelectItem, initialFilter = "Gear" }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(true);

  // Update internal filter when initialFilter prop changes (e.g. route change)
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredProducts = products.filter(p => 
    filter === "Archive" || p.category.includes(filter) || filter === "Gear"
  );

  if (loading) return (
    <div className="py-24 text-center font-mono text-xs uppercase tracking-widest text-white/30">
      Loading System_Data...
    </div>
  );

  return (
    <section id="products" className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
        <div>
          <h2 className="text-7xl font-black italic leading-none tracking-tighter">THE_ARCHIVE</h2>
          <p className="font-sans text-[10px] text-brand-gray mt-4 tracking-[3px] uppercase font-bold">
            [ CURRENT_DROP // VOLUME_04 ]
          </p>
        </div>
        <div className="flex gap-2">
          {["Gear", "Street", "Customs", "Archive"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setFilter(cat)}
              className={cn(
              "font-sans text-[10px] uppercase tracking-[2px] px-6 py-2 border border-[#222] hover:border-brand-toxic hover:text-brand-toxic transition-all font-bold",
              cat === filter ? "text-brand-toxic border-brand-toxic" : "text-white/50"
            )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard 
              product={product} 
              onAddToCart={onAddToCart}
              onSelectItem={onSelectItem}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
