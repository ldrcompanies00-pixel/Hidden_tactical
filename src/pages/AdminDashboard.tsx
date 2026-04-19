import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Package, 
  FileText, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  RefreshCcw,
  Search,
  ShieldCheck,
  Plus,
  Trash2,
  Users,
  Settings,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics"); // Default to professional overview
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oRes, pRes, aRes, cRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/products"),
        fetch("/api/admin/analytics"),
        fetch("/api/admin/config-status")
      ]);
      const [oData, pData, aData, cData] = await Promise.all([oRes.json(), pRes.json(), aRes.json(), cRes.json()]);
      setOrders(oData.reverse());
      setProducts(pData);
      setAnalytics(aData);
      setConfigStatus(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black text-white relative flex">
      {/* Tactical Sidebar Navigation */}
      <div className="w-64 border-r border-white/5 bg-brand-charcoal/20 fixed left-0 top-0 h-full pt-32 hidden lg:flex flex-col z-[40]">
        <div className="px-6 mb-12">
          <div className="flex items-center gap-3 text-brand-toxic mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-[4px]">Verified_Access</span>
          </div>
          <h2 className="text-xl font-black italic uppercase">Ops_Center</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={BarChart3} label="Analytics_Stream" />
          <SidebarLink active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={Package} label="Order_Queue" />
          <SidebarLink active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} icon={Truck} label="Inventory_Vault" />
          <SidebarLink active={activeTab === "customers"} onClick={() => setActiveTab("customers")} icon={Users} label="User_Directory" />
          <SidebarLink active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={Settings} label="System_Config" />
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={() => {
              localStorage.removeItem("admin_auth");
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/20 text-red-500 font-mono text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </div>

      {/* Main Stream Content */}
      <main className="flex-1 lg:ml-64 px-6 md:px-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-toxic mb-2">
              <div className="w-2 h-2 rounded-full bg-brand-toxic animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Command_Center_v4.2</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
              {activeTab.replace("_", " ")}
            </h1>
          </div>
          <button 
            onClick={fetchData} 
            className="flex items-center gap-3 bg-brand-charcoal border border-white/5 px-6 py-3 font-mono text-[10px] uppercase tracking-widest hover:border-brand-toxic transition-all"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            Sync_Signal
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "analytics" && <AnalyticsView key="analytics" data={analytics} orders={orders} />}
          {activeTab === "orders" && <OrdersView key="orders" orders={orders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} loading={loading} onRefresh={fetchData} onSelectOrder={setSelectedOrder} />}
          {activeTab === "inventory" && <InventoryView key="inventory" products={products} onRefresh={fetchData} />}
          {activeTab === "customers" && <CustomersView key="customers" orders={orders} />}
          {activeTab === "settings" && <SettingsView key="settings" configStatus={configStatus} />}
        </AnimatePresence>
      </main>

      {/* Shared Order Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onRefresh={fetchData} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-all relative group",
        active ? "text-brand-toxic bg-brand-toxic/5" : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-4 h-4 transition-colors", active ? "text-brand-toxic" : "text-white/20 group-hover:text-white/60")} />
      {label}
      {active && <motion.div layoutId="nav-active" className="absolute right-0 w-1 h-3/4 bg-brand-toxic" />}
    </button>
  );
}

// Sub-Views

function AnalyticsView({ data, orders }: any) {
  if (!data) return <div className="py-20 text-center font-mono opacity-20">DECRYPTING_ANALYTICS...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      {/* KPI Stream */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIBox label="NET_REVENUE" value={`$${orders.reduce((acc: any, o: any) => acc + o.total, 0)}`} trend="+12.4%" />
        <KPIBox label="AVG_TICKET" value={`$${orders.length ? Math.round(orders.reduce((acc: any, o: any) => acc + o.total, 0) / orders.length) : 0}`} trend="+5.2%" />
        <KPIBox label="UNIT_VELOCITY" value={orders.length} trend={data.orderVelocity} />
        <KPIBox label="USER_NODES" value={data.totalCustomers} trend="+18.9%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 bg-brand-charcoal border border-white/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-mono text-[10px] uppercase tracking-[4px] text-brand-gray">Revenue_Timeline</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono"><div className="w-2 h-2 bg-brand-toxic rounded-full" /> Sales</div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/20"><div className="w-2 h-2 bg-white/20 rounded-full" /> Volume</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="date" stroke="#ffffff20" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#ffffff20" fontSize={10} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", fontSize: "10px", fontFamily: "monospace" }}
                  itemStyle={{ color: "#39FF14" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#39FF14" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-brand-charcoal border border-white/5 p-8">
          <h3 className="font-mono text-[10px] uppercase tracking-[4px] text-brand-gray mb-8 text-center">Equipment_Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categories}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={["#39FF14", "#EAB308", "#ffffff20", "#ffffff40"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", fontSize: "10px", fontFamily: "monospace" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {data.categories.map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-[10px] font-mono uppercase">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5" style={{ backgroundColor: ["#39FF14", "#EAB308", "#ffffff20", "#ffffff40"][i % 4] }} />
                  {cat.name}
                </div>
                <span>${cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function KPIBox({ label, value, trend }: any) {
  return (
    <div className="bg-brand-charcoal border border-white/5 p-6 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover:scale-100 transition-all">
        <TrendingUp className="w-12 h-12 text-brand-toxic" />
      </div>
      <p className="font-mono text-[9px] text-brand-gray uppercase tracking-[3px] mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-black italic">{value}</h4>
        <span className="font-mono text-[9px] text-brand-toxic font-black">{trend}</span>
      </div>
    </div>
  );
}

function OrdersView({ orders, searchTerm, setSearchTerm, loading, onRefresh, onSelectOrder }: any) {
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = orders.filter((o: any) => 
    (filterStatus === "all" || o.status === filterStatus) &&
    (o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 bg-brand-charcoal/40 p-4 border border-white/5">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
          <input 
            type="text" 
            placeholder="FILTER_ORDERS..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 pl-12 pr-4 py-3 font-mono text-[11px] uppercase tracking-widest outline-none focus:border-brand-toxic"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {["all", "pending", "processing", "dispatched", "delivered"].map(s => (
            <button 
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-4 py-2 font-mono text-[9px] uppercase tracking-wider border transition-all h-full",
                filterStatus === s ? "bg-brand-toxic text-brand-black border-brand-toxic" : "border-white/5 text-white/40 hover:text-white"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-brand-charcoal border border-white/5 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/60 border-b border-white/10">
              <th className="p-6 text-left font-mono text-[10px] uppercase text-brand-gray tracking-widest">Order_Node</th>
              <th className="p-6 text-left font-mono text-[10px] uppercase text-brand-gray tracking-widest">Status_Flag</th>
              <th className="p-6 text-left font-mono text-[10px] uppercase text-brand-gray tracking-widest">Asset_Value</th>
              <th className="p-6 text-right font-mono text-[10px] uppercase text-brand-gray tracking-widest">Interaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center font-mono text-xs opacity-40 animate-pulse">UPLINK_IN_PROGRESS...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center font-mono text-xs opacity-20 uppercase tracking-[4px]">No_Telemetry_Detected</td></tr>
            ) : (
              filtered.map((o: any) => (
                <tr key={o.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => onSelectOrder(o)}>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black/40 border border-white/10 flex items-center justify-center font-mono text-[10px] text-white/20">
                        #{o.id.slice(-4)}
                      </div>
                      <div>
                        <p className="font-bold uppercase tracking-tight text-sm mb-0.5">{o.id}</p>
                        <p className="font-mono text-[9px] text-brand-gray">{new Date(o.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 font-mono text-[9px] uppercase font-black tracking-widest",
                      o.status === "pending" ? "bg-yellow-500/10 text-yellow-500" : 
                      o.status === "dispatched" ? "bg-brand-toxic/10 text-brand-toxic" : "bg-white/10 text-white/40"
                    )}>
                      <div className={cn("w-1 h-1 rounded-full", o.status === "pending" ? "bg-yellow-500 animate-pulse" : "bg-brand-toxic")} />
                      {o.status}
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-display font-black italic text-lg leading-none">${o.total}.00</p>
                  </td>
                  <td className="p-6 text-right">
                    <button className="w-10 h-10 flex items-center justify-center border border-white/5 hover:border-brand-toxic transition-all text-white/20 hover:text-brand-toxic">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, onClose, onRefresh }: any) {
  const [formData, setFormData] = useState(product || {
    name: "",
    category: "Gear",
    price: 0,
    description: "",
    image: `https://picsum.photos/seed/${Math.random()}/800/800`,
    specs: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-charcoal border border-white/10 w-full max-w-xl p-8 relative z-10">
        <h3 className="text-3xl font-black italic uppercase italic mb-8">{product ? "Edit_Asset" : "New_Deployment"}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="font-mono text-[9px] uppercase text-white/40 tracking-widest px-1">Asset_Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-brand-toxic outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-[9px] uppercase text-white/40 tracking-widest px-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm appearance-none outline-none focus:border-brand-toxic"
              >
                <option value="Gear">Gear</option>
                <option value="Street">Street</option>
                <option value="Customs">Customs</option>
                <option value="Archive">Archive</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[9px] uppercase text-white/40 tracking-widest px-1">Price_Value ($)</label>
              <input 
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-brand-toxic outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[9px] uppercase text-white/40 tracking-widest px-1">Intel_Description</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-4 font-mono text-xs focus:border-brand-toxic outline-none resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Abort
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-brand-toxic text-brand-black font-display font-black uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              {loading ? "Syncing..." : "Confirm_Deployment"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function InventoryView({ products, onRefresh }: any) {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const deleteProduct = async (id: string) => {
    if (!confirm("Confirm asset termination?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[4px] text-brand-gray px-1">Vault_Inventory</h3>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-brand-toxic text-brand-black px-6 py-3 font-display font-black uppercase text-xs tracking-widest transform hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Deploy_New_Asset
        </button>
      </div>

      <div className="bg-brand-charcoal border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/40 border-b border-white/10 font-mono text-[10px] text-brand-gray uppercase tracking-widest text-left">
            <tr>
              <th className="p-6">Asset_ID</th>
              <th className="p-6">Intel_Visual</th>
              <th className="p-6">Designation</th>
              <th className="p-6">Class</th>
              <th className="p-6">Value ($)</th>
              <th className="p-6 text-right">Ops_Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p: any) => (
              <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-mono text-[10px] text-brand-toxic">{p.id}</td>
                <td className="p-6">
                  <div className="w-12 h-12 bg-black/40 border border-white/10 overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </div>
                </td>
                <td className="p-6">
                  <span className="font-bold uppercase tracking-tight text-sm">{p.name}</span>
                </td>
                <td className="p-6">
                  <span className="font-mono text-[9px] bg-white/5 px-3 py-1 uppercase tracking-widest text-brand-gray">{p.category}</span>
                </td>
                <td className="p-6 font-display font-black italic text-brand-toxic text-lg">${p.price}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="w-10 h-10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <ProductModal 
            product={editingProduct} 
            onClose={() => {
              setIsAdding(false);
              setEditingProduct(null);
            }} 
            onRefresh={onRefresh} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CustomersView({ orders }: any) {
  const customerMap = orders.reduce((acc: any, o: any) => {
    const email = o.customer?.email || "ANONYMOUS";
    if (!acc[email]) {
      acc[email] = {
        email,
        orders: 0,
        spend: 0,
        lastOrder: o.createdAt
      };
    }
    acc[email].orders += 1;
    acc[email].spend += o.total;
    return acc;
  }, {});

  const customers = Object.values(customerMap);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-brand-charcoal border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/40 border-b border-white/10 font-mono text-[10px] text-brand-gray uppercase tracking-widest text-left">
            <tr>
              <th className="p-6">Node_ID (Email)</th>
              <th className="p-6">Mission_Count</th>
              <th className="p-6">Lifetime_Spend</th>
              <th className="p-6 text-right">Last_Uplink</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c: any, i: number) => (
              <tr key={i} className="group hover:bg-white/[0.02]">
                <td className="p-6 font-bold uppercase tracking-tight font-sans">{c.email}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Package className="w-3 h-3 text-brand-toxic" />
                    {c.orders}
                  </div>
                </td>
                <td className="p-6 font-display font-black italic text-lg text-brand-toxic">${c.spend}.00</td>
                <td className="p-6 text-right font-mono text-[10px] text-brand-gray uppercase">{new Date(c.lastOrder).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function SettingsView({ configStatus }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-brand-charcoal border border-white/5 p-10 shadow-2xl">
        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-r from-brand-toxic to-yellow-500 bg-clip-text text-transparent">SYSTEM_ARCHITECTURE</h3>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] text-white/20 uppercase tracking-[3px]">Uplink_Security</h4>
            <div className="grid grid-cols-2 gap-4">
              <ConfigCard label="PASSKEY_AUTH" status={configStatus?.security ? "ACTIVE" : "MISSING"} info="v4.2 Encryption" />
              <ConfigCard label="IP_WHITELIST" status="BYPASS" info="Global Ops" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-[10px] text-white/20 uppercase tracking-[3px]">Active_Integrations</h4>
            <div className="space-y-3">
              <IntegrationBox name="SAMEDAY_ROMANIA" status={configStatus?.sameday ? "SYNCED" : "OFFLINE"} isConnected={configStatus?.sameday} />
              <IntegrationBox name="SMARTBILL_RO" status={configStatus?.smartbill ? "INTEGRATED" : "NOT_FOUND"} isConnected={configStatus?.smartbill} />
              <IntegrationBox name="GEMINI_AI_CORE" status="OPTIMIZED" isConnected={true} />
              <IntegrationBox name="STRIPE_PAYMENTS" status="READY" isConnected={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-toxic/5 opacity-0 group-hover:opacity-100 italic font-black text-brand-toxic overflow-hidden pointer-events-none break-all text-[8px] leading-none select-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i}>0101100101011010101001010101010010101HIDDEN_SYSTEM_OVERRIDE_010101010101</div>
          ))}
        </div>
        
        <Settings className="w-16 h-16 text-brand-toxic mb-8 animate-[spin_10s_linear_infinite]" />
        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Command_Protocol</h3>
        <p className="font-mono text-[11px] text-brand-gray uppercase tracking-widest leading-loose max-w-sm">
          All changes to environmental variables must be committed via the <span className="text-white">Central Registry</span>. Tactical restarts occur automatically upon successful deployment.
        </p>
      </div>
    </motion.div>
  );
}

function OrderDetailsModal({ order, onClose, onRefresh }: any) {
  const [processing, setProcessing] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setProcessing(true);
    try {
      await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const generateInvoice = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/invoice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id })
      });
      const data = await res.json();
      if (data.success) {
        alert(`INVOICE GENERATED (${data.provider}): ${data.invoiceNumber}`);
      } else {
        alert(`ERROR: ${data.error}`);
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const generateAWB = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/awb/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id })
      });
      const data = await res.json();
      alert(`AWB: ${data.awbNumber}`);
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-xl" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-charcoal border border-white/10 w-full max-w-5xl shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-12 overflow-hidden max-h-[90vh]">
        
        {/* Detail Panel */}
        <div className="lg:col-span-8 p-12 overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-1">ANALYSIS: {order.id}</h2>
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-brand-gray">
                <Clock className="w-3 h-3" /> Timestamp: {new Date(order.createdAt).toISOString()}
              </div>
            </div>
            <div className={cn(
              "px-4 py-2 border font-mono text-[10px] uppercase font-black tracking-[3px]",
              order.status === "pending" ? "border-yellow-500 text-yellow-500" : "border-brand-toxic text-brand-toxic"
            )}>
              {order.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[4px] text-white/20 mb-6 px-1">Tactical_Assets</h4>
              <div className="space-y-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center bg-black/40 border border-white/5 p-4 group">
                    <img src={item.product.image} className="w-16 h-16 object-cover grayscale opacity-50 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h5 className="font-bold text-sm uppercase leading-none mb-1">{item.product.name}</h5>
                      <p className="font-mono text-[9px] text-brand-gray uppercase">QTY: {item.quantity} // ${item.product.price} UNIT</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[4px] text-white/20 mb-4 px-1">Customer_Intel</h4>
                <div className="p-6 border border-white/5 bg-black/20 font-mono text-[10px] space-y-3">
                  <div className="flex justify-between uppercase"><span className="text-white/20">Name:</span> <span>{order.customer?.firstName} {order.customer?.lastName}</span></div>
                  <div className="flex justify-between uppercase"><span className="text-white/20">Email:</span> <span className="text-brand-toxic">{order.customer?.email}</span></div>
                  <div className="flex justify-between uppercase"><span className="text-white/20">Signal:</span> <span>{order.customer?.phone}</span></div>
                  <div className="flex flex-col pt-3 border-t border-white/5">
                    <span className="text-white/20 uppercase mb-1">Grid_Coords:</span>
                    <span className="italic leading-relaxed">{order.customer?.address}, {order.customer?.city}, {order.customer?.country}</span>
                  </div>
                </div>
              </div>
              <div className="bg-brand-toxic/5 border border-brand-toxic/20 p-6 flex flex-col items-center justify-center">
                <span className="font-mono text-[9px] uppercase tracking-[4px] text-brand-toxic mb-1">Total_Extraction_Value</span>
                <span className="text-5xl font-black italic underline decoration-brand-toxic decoration-4 underline-offset-8">${order.total}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 bg-black/60 p-10 flex flex-col border-l border-white/5 h-full">
          <div className="mb-10">
            <h4 className="font-mono text-[10px] uppercase tracking-[4px] text-white/20 mb-6">Ops_Registry</h4>
            <div className="space-y-4">
              <LogItem label="Invoice" value={order.invoiceNumber || "NULL"} />
              <LogItem label="Sameday_AWB" value={order.awbNumber || "NULL"} />
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[4px] text-white/20 mb-4">Command_Override</h4>
            <ActionBtn onClick={() => updateStatus("processing")} disabled={processing || order.status === "processing"} label="Initialize_Ops" color="white" />
            <ActionBtn onClick={() => generateInvoice()} disabled={processing || !!order.invoiceNumber} label="Generate_SmartBill_Invoice" color="white" />
            <ActionBtn onClick={() => generateAWB()} disabled={processing || !!order.awbNumber} label="Generate_Tactical_AWB" color="brand-toxic" />
            <ActionBtn onClick={() => updateStatus("delivered")} disabled={processing || order.status === "delivered"} label="Mark_Delivered" color="yellow-500" />
            <button 
              onClick={onClose}
              className="w-full text-brand-gray font-mono text-[10px] uppercase tracking-widest mt-8 hover:text-white transition-colors"
            >
              Abort_Analysis
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helpers

function ConfigCard({ label, status, info }: any) {
  return (
    <div className="bg-black/40 border border-white/5 p-4 flex flex-col justify-between h-24">
      <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", status === "ACTIVE" ? "bg-brand-toxic shadow-brand-toxic/50" : "bg-white/20 shadow-white/10")} />
        <span className="font-display font-black italic text-lg">{status}</span>
      </div>
      <p className="font-mono text-[7px] text-white/20 uppercase text-right">{info}</p>
    </div>
  );
}

function IntegrationBox({ name, status, isConnected }: any) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-black/40 border transition-all group",
      isConnected ? "border-white/5 hover:border-brand-toxic" : "border-red-500/20 opacity-50"
    )}>
      <span className="font-mono text-[10px] text-brand-gray uppercase tracking-widest group-hover:text-white transition-colors">{name}</span>
      <div className="flex items-center gap-3">
        <span className={cn(
          "font-mono text-[8px] font-black tracking-widest",
          isConnected ? "text-brand-toxic" : "text-red-500"
        )}>{status}</span>
        {isConnected ? (
          <CheckCircle2 className="w-3 h-3 text-brand-toxic" />
        ) : (
          <AlertCircle className="w-3 h-3 text-red-500" />
        )}
      </div>
    </div>
  );
}

function LogItem({ label, value }: any) {
  return (
    <div className="space-y-2">
      <span className="font-mono text-[9px] uppercase text-white/20 block">{label}</span>
      <div className="bg-brand-charcoal/40 border border-white/5 px-4 py-3 font-mono text-[10px] text-brand-toxic truncate">
        {value}
      </div>
    </div>
  );
}

function ActionBtn({ label, onClick, disabled, color }: any) {
  const colorMap: any = {
    "white": "bg-white text-black hover:bg-brand-toxic",
    "brand-toxic": "bg-brand-toxic text-brand-black hover:bg-white",
    "yellow-500": "bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-white"
  };

  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full py-4 font-display font-black uppercase text-xs tracking-widest transition-all disabled:opacity-20 flex items-center justify-center gap-3",
        colorMap[color] || "bg-white text-black"
      )}
    >
      {label}
      {disabled && <ShieldCheck className="w-4 h-4" />}
    </button>
  );
}
