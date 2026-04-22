import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, CreditCard, Crosshair, Package, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface CheckoutProps {
  cart: { product: Product; quantity: number }[];
  total: number;
  onClearCart: () => void;
}

export default function Checkout({ cart, total, onClearCart }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState<any>(null);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    email: ""
  });
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleNext = () => setStep(prev => prev + 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          items: cart,
          total,
          customer: customerData,
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      setOrderConfirm(data);
      onClearCart();
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && step < 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-brand-toxic mb-6 animate-pulse" />
        <h2 className="text-4xl italic font-black mb-4">INVENTORY_UNAVAILABLE</h2>
        <p className="font-mono text-xs text-brand-gray mb-8 uppercase tracking-[0.2em]">Add items to your depot before initializing checkout.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-brand-toxic text-brand-black px-8 py-4 font-display font-black uppercase text-sm"
        >
          RETURN_TO_BASE
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 relative z-10">
      
      {/* Checkout Sidebar/Summary */}
      <div className="lg:order-2">
        <div className="sticky top-32 glass-card p-8 border border-white/5">
          <div className="flex items-center gap-2 mb-8 border-b border-brand-toxic pb-4">
            <Package className="w-5 h-5 text-brand-toxic" />
            <h3 className="font-display font-black text-xl italic">DEPOT_SUMMARY</h3>
          </div>
          
          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-bold uppercase text-sm leading-none mb-1">{item.product.name}</h4>
                  <span className="font-mono text-[10px] text-brand-gray uppercase">{item.product.category} x {item.quantity}</span>
                </div>
                <span className="font-mono text-xs font-bold">${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex justify-between font-mono text-xs text-brand-gray uppercase">
              <span>Subtotal</span>
              <span>${total}.00</span>
            </div>
            <div className="flex justify-between font-mono text-xs text-brand-gray uppercase">
              <span>Shipping_Tax</span>
              <span className="text-brand-toxic">FREE_SECURE_DROP</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-4">
              <span className="font-display font-black text-lg italic">TOTAL_EQUIV_</span>
              <span className="font-display font-black text-3xl italic">${total}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Main Flow */}
      <div className="lg:order-1">
        <div className="flex items-center gap-12 mb-16 overflow-x-auto pb-4 no-scrollbar">
          {[
            { id: 1, label: "Drop_Location", icon: Crosshair },
            { id: 2, label: "Identity_Verification", icon: Shield },
            { id: 3, label: "Credit_Transfer", icon: CreditCard },
          ].map(s => (
            <div key={s.id} className={`flex items-center gap-3 shrink-0 transition-opacity ${step >= s.id ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-10 h-10 flex items-center justify-center border font-mono text-xs font-bold ${step === s.id ? 'border-brand-toxic text-brand-toxic' : 'border-white/20 text-white'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold hidden sm:block">{s.label}</span>
              {s.id < 3 && <div className="hidden sm:block w-8 h-px bg-white/10 mx-4" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl italic font-black tracking-tighter uppercase mb-12">TACTICAL_DROP</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">Sector_Address</label>
                  <input type="text" value={customerData.address} onChange={(e) => setCustomerData({...customerData, address: e.target.value})} placeholder="STREET_UPLINK" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">City_Zone</label>
                  <input type="text" value={customerData.city} onChange={(e) => setCustomerData({...customerData, city: e.target.value})} placeholder="METRO_ZONE" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">Post_Code</label>
                  <input type="text" value={customerData.postalCode} onChange={(e) => setCustomerData({...customerData, postalCode: e.target.value})} placeholder="XXXXX" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">Contact_Frequency</label>
                  <input type="email" value={customerData.email} onChange={(e) => setCustomerData({...customerData, email: e.target.value})} placeholder="SECURE_CHANNEL@MAIL.COM" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                </div>
              </div>
              <button onClick={handleNext} className="mt-12 group flex items-center gap-4 bg-brand-toxic text-brand-black px-12 py-5 font-display font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02]">
                CONTINUE_TO_VERIFICATION
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl italic font-black tracking-tighter uppercase mb-12">SENDER_ID</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">First_Name</label>
                  <input type="text" value={customerData.firstName} onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})} placeholder="OPERATIVE_FIRST" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">Last_Name</label>
                  <input type="text" value={customerData.lastName} onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})} placeholder="OPERATIVE_LAST" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="mt-12 border border-white/10 px-8 py-5 font-display font-black text-sm uppercase tracking-widest hover:border-brand-toxic transition-all text-white/40 hover:text-white">
                  BACK_
                </button>
                <button onClick={handleNext} className="mt-12 flex-1 group flex items-center justify-center gap-4 bg-brand-toxic text-brand-black py-5 font-display font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02]">
                  PROCEED_TO_CREDITS
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl italic font-black tracking-tighter uppercase mb-12">CREDIT_UPLINK</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">Card_Hash</label>
                  <div className="relative">
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">Expiry_Pulse</label>
                    <input type="text" placeholder="MM/YY" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-brand-gray uppercase tracking-widest px-2">CVV_Code</label>
                    <input type="text" placeholder="XXX" className="w-full bg-brand-charcoal border border-white/5 p-4 text-sm font-mono focus:border-brand-toxic transition-colors outline-none" required />
                  </div>
                </div>
              </div>
              
              <p className="font-mono text-[10px] text-brand-gray uppercase text-center mt-12 bg-white/5 p-4 border border-white/5 italic">
                Secure transaction bypass active. Your credentials are encrypted on a local node.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={isProcessing}
                  className="mt-6 border border-white/10 px-8 py-5 font-display font-black text-sm uppercase tracking-widest hover:border-brand-toxic transition-all text-white/40 hover:text-white disabled:opacity-50"
                >
                  BACK_
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="mt-6 flex-1 bg-brand-toxic text-brand-black py-5 font-display font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isProcessing ? "PROCESSING_TRANSFER..." : "AUTHORIZE_ENCRYPTED_TRANSFER"}
                  {!isProcessing && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && orderConfirm && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckCircle className="w-24 h-24 text-brand-toxic mb-8" />
              <h2 className="text-4xl sm:text-6xl md:text-7xl italic font-black tracking-tighter uppercase mb-6">SIGNAL_CONFIRMED</h2>
              <div className="bg-brand-charcoal p-12 border border-brand-toxic/50 max-w-lg w-full mb-12 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                <div className="space-y-6 text-left">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-brand-gray">ORDER_ID__</span>
                    <span className="text-brand-toxic font-bold">{orderConfirm.orderId}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-brand-gray">DISPATCH_WINDOW__</span>
                    <span className="text-white font-bold">{orderConfirm.dispatchTime}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-brand-gray">DECRYPTION_SENT_TO__</span>
                    <span className="text-white font-bold italic">YOUR_UPLINK</span>
                  </div>
                  <p className="font-mono text-[10px] text-white/40 pt-6 border-t border-white/5 leading-relaxed uppercase">
                    Your equipment is being pulled from the shadows. Track the signal via the encrypted link sent to your comms channel.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/")}
                className="bg-brand-toxic text-brand-black px-12 py-5 font-display font-black uppercase text-sm tracking-widest hover:bg-white transition-all"
              >
                RETURN_TO_THE_SHADOWS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
