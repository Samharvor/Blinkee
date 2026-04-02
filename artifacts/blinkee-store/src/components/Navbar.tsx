import { Link, useLocation } from "wouter";
import { useGetCart } from "@workspace/api-client-react";
import { ShoppingCart, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: cart } = useGetCart();
  const cartItemCount = cart?.totalItems || 0;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo with permanent neon cyan glow */}
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="h-6 w-6 text-primary" style={{ filter: "drop-shadow(0 0 6px rgba(0,255,255,0.9)) drop-shadow(0 0 12px rgba(0,255,255,0.6))" }} />
          <span
            className="font-display text-xl font-black tracking-wider text-white logo-glow select-none"
          >
            BLINKEE<span className="text-primary">.COM</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold tracking-widest uppercase transition-colors hover:text-primary ${location === "/" ? "text-primary neon-text-cyan" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`text-sm font-semibold tracking-widest uppercase transition-colors hover:text-primary ${location === "/shop" ? "text-primary neon-text-cyan" : "text-muted-foreground"}`}
          >
            Shop
          </Link>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-white/5 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black text-white shadow-[0_0_8px_rgba(255,0,170,0.9)]">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-white/5 hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black text-white shadow-[0_0_8px_rgba(255,0,170,0.9)]">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={closeMenu}
            className={`p-3 rounded border border-transparent text-center font-display tracking-widest ${location === "/" ? "bg-primary/10 border-primary/30 text-primary neon-text-cyan" : "hover:bg-white/5"}`}
          >
            HOME
          </Link>
          <Link
            href="/shop"
            onClick={closeMenu}
            className={`p-3 rounded border border-transparent text-center font-display tracking-widest ${location === "/shop" ? "bg-primary/10 border-primary/30 text-primary neon-text-cyan" : "hover:bg-white/5"}`}
          >
            SHOP
          </Link>
        </div>
      )}
    </nav>
  );
}
