import { Link } from "wouter";
import { Zap, Twitter, Instagram, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "My whole crew wore these LED cowboy hats at the concert and everyone stopped to take photos with us. Blinkee never disappoints.",
    name: "Jessica M.",
    tag: "Festival Queen",
  },
  {
    quote: "Ordered the glow stick pack for my daughter's birthday party. Kids went absolutely wild. Will 100% order again.",
    name: "David R.",
    tag: "Party Dad",
  },
  {
    quote: "The fiber optic wands are so magical. My toddler thinks I'm a wizard. Worth every penny.",
    name: "Sarah K.",
    tag: "Rave Mom",
  },
  {
    quote: "These LED rings are my go-to icebreaker. Hand them out at networking events and everyone immediately loosens up.",
    name: "Marcus T.",
    tag: "Connector",
  },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />

      {/* ── Magic Matt Testimonials ── */}
      <div className="border-b border-white/10 py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-display tracking-[0.3em] uppercase text-primary neon-text-cyan mb-3">
              What the crowd is saying
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-wider">
              The <span className="text-secondary neon-text-pink">Glow</span> Reviews
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-background border border-white/10 rounded-sm p-5 flex flex-col gap-3 hover:border-primary/40 hover:neon-box-cyan transition-all duration-300"
              >
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-[11px] text-primary font-display uppercase tracking-widest">{t.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Magic Matt brand strip ── */}
      <div className="border-b border-white/10 py-6 relative z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.06)_0%,transparent_70%)]">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-base md:text-lg font-black tracking-[0.2em] uppercase">
            <span className="text-white">Bringing Joy &amp; Excitement Since </span>
            <span className="text-primary neon-text-cyan">2003</span>
            <span className="text-white/40 mx-3">—</span>
            <span className="text-secondary neon-text-pink">Curated by Magic Matt</span>
          </p>
        </div>
      </div>

      {/* ── Main footer columns ── */}
      <div className="container mx-auto px-4 pt-14 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <Zap className="h-6 w-6 text-primary" style={{ filter: "drop-shadow(0 0 6px rgba(0,255,255,0.9))" }} />
              <span className="font-display text-xl font-black tracking-wider text-white logo-glow">
                BLINKEE<span className="text-primary">.COM</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              The original LED party toy destination since 2003. We light up your world — one neon glow at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:neon-box-cyan transition-all duration-300 border border-white/10">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-secondary hover:neon-box-pink transition-all duration-300 border border-white/10">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-6">Shop</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">All Products</Link></li>
              <li><Link href="/shop?category=Party+Hats" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">LED Hats</Link></li>
              <li><Link href="/shop?category=Jewelry" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">LED Rings</Link></li>
              <li><Link href="/shop?category=Eyewear" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Neon Glasses</Link></li>
              <li><Link href="/shop?category=Glow+Sticks" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Glow Sticks</Link></li>
              <li><Link href="/shop?category=Wands" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Fiber Optic Wands</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-6">Support</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">Shipping</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors text-sm uppercase tracking-wider">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-6">Get the Drop</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe for exclusive deals, new arrivals, and Magic Matt's party tips.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="bg-background border border-white/20 px-3 py-2 text-sm w-full focus:outline-none focus:border-primary focus:neon-box-cyan transition-all"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 font-display font-black tracking-wider hover:bg-white hover:text-black transition-colors whitespace-nowrap"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Blinkee.com. All rights reserved. Curated by Magic Matt.
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
