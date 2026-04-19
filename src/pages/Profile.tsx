import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Package, User, Clock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Profile() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch("/api/user/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error);

  }, [user, navigate, token]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex items-center justify-between border-b border-brand-toxic/50 pb-8 mb-12">
        <div>
          <h2 className="text-6xl italic font-black uppercase tracking-tighter">OPERATIVE_DOSSIER</h2>
          <p className="font-mono text-xs text-brand-gray tracking-[4px] mt-2 block uppercase font-bold">
            ID::{user.id}
          </p>
        </div>
        <button 
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-2 border border-white/10 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white hover:border-brand-toxic transition-all"
        >
          <LogOut className="w-4 h-4" />
          Disengage
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
        <div className="space-y-6">
          <div className="bg-brand-charcoal border border-white/5 p-8">
            <User className="w-8 h-8 text-brand-toxic mb-6" />
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-brand-gray uppercase tracking-widest">Clearance_Name</span>
                <p className="font-sans text-xl font-black uppercase">{user.firstName} {user.lastName}</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-brand-gray uppercase tracking-widest">Comms_Link</span>
                <p className="font-mono text-sm text-white/80">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-brand-toxic/10 border border-brand-toxic/20 p-4 text-brand-toxic font-mono text-[10px] uppercase tracking-widest font-bold">
            <Package className="w-4 h-4" />
            <span>Encrypted_Drops (Order History)</span>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 text-center text-white/30 font-mono text-xs uppercase tracking-widest">
                No active logistics found.
              </div>
            ) : (
              orders.map((order, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={order.id} 
                  className="bg-brand-charcoal border border-white/5 p-6 hover:border-white/20 transition-colors group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-brand-gray uppercase tracking-[2px]">Logistics_ID</span>
                      <p className="font-mono text-sm font-bold text-brand-toxic">{order.id}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="font-mono text-[9px] text-brand-gray uppercase tracking-[2px]">Timestamp</span>
                      <p className="font-mono text-xs flex items-center gap-2 justify-end">
                        <Clock className="w-3 h-3 text-white/40" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-4">
                      {order.items?.map((item: any) => (
                        <div key={item.product.id} className="w-12 h-12 rounded-full border-2 border-brand-charcoal bg-black overflow-hidden relative">
                          <img src={item.product.image} className="w-full h-full object-cover grayscale opacity-60" />
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[9px] text-brand-gray uppercase tracking-[2px] block mb-1">Total_Value</span>
                      <span className="font-display font-black italic text-2xl">${order.total}.00</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center px-4 py-3 bg-black/40">
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                      Status: <span className={order.status === "pending" ? "text-yellow-500" : "text-brand-toxic"}>{order.status}</span>
                    </span>
                    {order.awbNumber && (
                      <span className="font-mono text-[10px] text-brand-gray uppercase tracking-widest">
                        AWB: {order.awbNumber}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
