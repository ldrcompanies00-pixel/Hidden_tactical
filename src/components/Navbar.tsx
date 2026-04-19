import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore(state => state.user);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      className={`${isActive(to) ? 'text-brand-toxic' : 'text-white/50 hover:text-brand-toxic'} transition-colors font-bold tracking-[2px]`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 bg-brand-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-display font-black text-3xl tracking-tighter uppercase border-b-4 border-brand-toxic pb-0.5">HIDDEN</Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 font-sans text-[11px] uppercase text-white">
          <NavLink to="/" label="Gear" />
          <NavLink to="/street" label="Street" />
          <NavLink to="/customs" label="Customs" />
          <NavLink to="/archive" label="Archive" />
        </div>

        <div className="flex items-center gap-6">
          <Link to={user ? "/profile" : "/login"} className="hidden md:flex items-center gap-2 text-white/50 hover:text-brand-toxic transition-colors">
            <User className="w-4 h-4" />
            <span className="font-sans text-[11px] uppercase font-bold tracking-[2px]">{user ? "Dossier" : "Access"}</span>
          </Link>
          <button 
            onClick={onOpenCart}
            className="relative group font-sans text-[11px] tracking-[2px] uppercase font-bold hover:text-brand-toxic transition-colors"
          >
            Cart ({cartCount})
          </button>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-charcoal border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6 font-sans text-[11px] tracking-[2px] uppercase font-bold">
              <Link to="/" onClick={() => setIsOpen(false)} className={isActive("/") ? 'text-brand-toxic' : ''}>Gear</Link>
              <Link to="/street" onClick={() => setIsOpen(false)} className={isActive("/street") ? 'text-brand-toxic' : ''}>Street</Link>
              <Link to="/customs" onClick={() => setIsOpen(false)} className={isActive("/customs") ? 'text-brand-toxic' : ''}>Customs</Link>
              <Link to="/archive" onClick={() => setIsOpen(false)} className={isActive("/archive") ? 'text-brand-toxic' : ''}>Archive</Link>
              <Link to={user ? "/profile" : "/login"} onClick={() => setIsOpen(false)} className={isActive("/profile") || isActive("/login") ? 'text-brand-toxic' : ''}>{user ? "Dossier" : "Access"}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
