import { Link } from "wouter";
import { Zap, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4 inline-flex">
              <Zap className="h-6 w-6 text-primary group-hover:text-secondary transition-colors duration-300" />
              <span className="font-display text-xl font-bold tracking-wider text-white group-hover:neon-text-cyan transition-all duration-300">
                BLINKEE<span className="text-primary">.COM</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              The ultimate online destination for LED toys, light-up gadgets, and electrifying novelty products. We bring the neon underground to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:neon-box-cyan transition-all duration-300 border border-white/10">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-secondary hover:neon-box-pink transition-all duration-300 border border-white/10">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-accent shadow-none hover:shadow-[0_0_10px_rgba(170,255,0,0.5)] transition-all duration-300 border border-white/10 hover:border-accent">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-6 text-lg">Shop</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">All Products</Link></li>
              <li><Link href="/shop?category=wearables" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Wearables</Link></li>
              <li><Link href="/shop?category=decor" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Room Decor</Link></li>
              <li><Link href="/shop?category=party" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Party Supplies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-6 text-lg">Support</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">Shipping</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-6 text-lg">Transmission</h4>
            <p className="text-muted-foreground text-sm mb-4">Subscribe to our frequency for exclusive drops and cyber deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-background border border-white/20 px-4 py-2 text-sm w-full focus:outline-none focus:border-primary focus:neon-box-cyan transition-all"
              />
              <button 
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 font-display font-bold tracking-wider hover:bg-white transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Blinkee.com. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-white text-xs uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-white text-xs uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
