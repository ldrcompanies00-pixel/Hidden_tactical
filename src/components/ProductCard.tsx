import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Product } from "@/src/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onSelectItem: (p: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onSelectItem }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelectItem(product)}
      className="group relative bg-brand-charcoal overflow-hidden border border-[#222] p-6 flex flex-col justify-end min-h-[300px] cursor-pointer"
    >
      {/* Decorative Line top right */}
      <div className="absolute top-[10px] right-[10px] w-10 h-px bg-brand-toxic z-20" />

      {/* Product Image */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Info */}
      <div className="relative z-10 mt-auto flex items-end justify-between">
        <div className="mb-2 transition-opacity duration-300 group-hover:opacity-0">
          <span className="font-sans font-bold text-xs text-brand-toxic block mb-1">
            ${product.price}.00
          </span>
          <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">
            {product.name}
          </h3>
          <p className="text-[10px] text-brand-gray uppercase tracking-widest">
            {product.category}
          </p>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-10 h-10 bg-brand-toxic text-brand-black flex items-center justify-center hover:bg-white hover:text-brand-black transition-colors group-hover:bg-brand-black group-hover:text-brand-toxic relative z-20"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Hover Info Overlay */}
      <div className="absolute inset-0 bg-brand-neon/90 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="text-brand-black">
          <h4 className="font-display font-black text-3xl mb-4 italic uppercase leading-none">SPECS_</h4>
          <ul className="space-y-2">
            {product.specs.map((spec, i) => (
              <li key={i} className="font-mono text-xs font-bold flex items-center gap-2">
                <div className="w-1 h-1 bg-brand-black" />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
