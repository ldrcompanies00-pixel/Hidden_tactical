/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Product } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2 } from "lucide-react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("admin_auth") === "true";

  useEffect(() => {
    if (!isAuth) {
      navigate("/admin/login");
    }
  }, [isAuth, navigate]);

  return isAuth ? <>{children}</> : null;
}

function AppContent() {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-x-hidden">
      <div className="checkered-border fixed top-0 left-0 z-[100]" />
      
      {/* Background Badge */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[20vw] whitespace-nowrap opacity-[0.03] rotate-[-15deg] pointer-events-none uppercase z-0">
        Underground Elite
      </div>

      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-grow pt-10 relative z-10">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} onSelectItem={setSelectedProduct} initialFilter="Gear" />} />
          <Route path="/street" element={<Home onAddToCart={addToCart} onSelectItem={setSelectedProduct} initialFilter="Street" />} />
          <Route path="/customs" element={<Home onAddToCart={addToCart} onSelectItem={setSelectedProduct} initialFilter="Customs" />} />
          <Route path="/archive" element={<Home onAddToCart={addToCart} onSelectItem={setSelectedProduct} initialFilter="Archive" />} />
          <Route path="/checkout" element={<Checkout cart={cart} total={cartTotal} onClearCart={clearCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <div className="sidebar-info hidden md:flex fixed right-10 bottom-16 [writing-mode:vertical-rl] rotate-180 items-center gap-8 font-mono text-[10px] text-brand-gray tracking-[4px] z-50 pointer-events-none">
        2024 COLLECTION — DESIGNED IN THE SHADOWS
        <div className="w-px h-24 bg-brand-gray" />
      </div>

      <Footer />
      
      <div className="checkered-border fixed bottom-0 left-0 z-[100]" />

      <AIAssistant />

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-black border-l border-white/5 z-[120] flex flex-col p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl italic font-black">YOUR_GEAR</h2>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:text-brand-toxic">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <ShoppingBag className="w-12 h-12 mb-4" />
                    <p className="font-mono text-xs uppercase tracking-widest text-white/40">Inventory Empty_</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b border-white/5 pb-6 last:border-0 group">
                      <div className="w-24 h-24 bg-brand-charcoal overflow-hidden border border-white/5">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <span className="font-sans text-[10px] text-brand-toxic font-bold uppercase tracking-widest">{item.product.category}</span>
                        <h4 className="text-lg font-bold uppercase">{item.product.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-mono text-xs font-bold">${item.product.price} x {item.quantity}</p>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-gray">Credits_Total</span>
                    <span className="font-display font-black text-3xl italic">${cartTotal}.00</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/checkout");
                    }}
                    className="w-full bg-brand-toxic text-brand-black py-5 font-display font-black uppercase text-sm tracking-[0.2em] transform hover:scale-[1.02] transition-transform"
                  >
                    Initialize_Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-brand-charcoal border border-white/10 grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-6 right-6 w-12 h-12 bg-black border border-white/10 flex items-center justify-center z-20 hover:text-brand-toxic transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-[400px] md:h-full relative overflow-hidden bg-black/40">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                <div className="absolute bottom-10 left-10 flex gap-4">
                  <div className="w-4 h-4 bg-brand-toxic animate-pulse rounded-full" />
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Live_Product_Feed</span>
                </div>
              </div>

              <div className="p-8 sm:p-12 md:p-20 flex flex-col">
                <div className="mb-8 md:mb-12">
                  <span className="font-display font-black text-[10px] sm:text-xs text-brand-toxic tracking-[3px] sm:tracking-[5px] uppercase mb-4 block">
                    {selectedProduct.category} // ARCHIVE_004
                  </span>
                  <h2 className="text-3xl sm:text-6xl md:text-8xl italic font-black uppercase leading-[0.85] tracking-tighter mb-6 md:mb-8">
                    {selectedProduct.name}
                  </h2>
                  <p className="font-sans text-brand-gray text-base sm:text-lg leading-relaxed uppercase tracking-tight font-bold">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 md:mb-12">
                  <div>
                    <h5 className="font-mono text-[10px] text-white/20 uppercase tracking-[3px] mb-4">Specs_Analysis</h5>
                    <ul className="space-y-3">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="font-mono text-[10px] sm:text-xs text-white/60 flex items-center gap-3">
                          <div className="w-1 h-1 bg-brand-toxic" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] text-white/20 uppercase tracking-[3px] mb-4">Tactical_Brief</h5>
                    <p className="font-mono text-[10px] text-white/40 leading-loose uppercase italic tracking-wider">
                      Tested in high-speed urban environments. Reinforced stitching. Weatherproof coating. Limited release.
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 border-t border-white/5 pt-10 md:pt-12">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-white/20 uppercase">Unit_Price</span>
                    <span className="font-display font-black text-3xl sm:text-4xl">${selectedProduct.price}.00</span>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full sm:flex-1 bg-brand-toxic text-brand-black h-14 sm:h-16 flex items-center justify-center font-display font-black uppercase text-sm tracking-[0.2em] transform hover:scale-[1.02] transition-all"
                  >
                    ADD_TO_DEPOT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
