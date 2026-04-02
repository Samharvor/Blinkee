import { useGetFeaturedProducts, useGetStoreStats, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Zap, Box, Star, Layers, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useGetFeaturedProducts();
  const { data: stats, isLoading: statsLoading } = useGetStoreStats();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.15)_0%,transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay z-0" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] z-0" />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10 text-primary mb-8 neon-box-cyan"
            >
              <Activity className="h-4 w-4" />
              <span className="text-xs font-bold tracking-widest uppercase font-display">System Online // Grid Active</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white mb-6 uppercase"
            >
              Illuminate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent filter drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                Existence
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Enter the neon underground. The ultimate destination for LED toys, light-up gadgets, and electrifying novelty hardware.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/shop">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-white text-primary-foreground hover:text-black font-display font-bold tracking-widest uppercase neon-box-cyan transition-all w-full sm:w-auto">
                  Enter Shop <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop?category=Eyewear">
                <Button size="lg" variant="outline" className="h-14 px-8 border-secondary text-secondary hover:bg-secondary hover:text-white font-display font-bold tracking-widest uppercase neon-box-pink transition-all bg-transparent w-full sm:w-auto">
                  View Eyewear
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-card border-b border-white/10 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,170,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[gradient_15s_ease_infinite]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { icon: Box, label: "Products", value: stats?.totalProducts, loading: statsLoading },
              { icon: Layers, label: "Categories", value: stats?.totalCategories, loading: statsLoading },
              { icon: Zap, label: "Featured", value: stats?.featuredCount, loading: statsLoading },
              { icon: Star, label: "Avg Rating", value: stats?.averageRating?.toFixed(1), loading: statsLoading }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <stat.icon className={`h-6 w-6 mb-3 ${i % 2 === 0 ? 'text-primary' : 'text-secondary'}`} />
                {stat.loading ? (
                  <Skeleton className="h-10 w-20 bg-muted mb-1" />
                ) : (
                  <span className={`text-3xl font-display font-black tracking-wider mb-1 ${i % 2 === 0 ? 'neon-text-cyan' : 'neon-text-pink'}`}>
                    {stat.value}
                  </span>
                )}
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wider mb-2 flex items-center gap-3">
                <Zap className="h-8 w-8 text-accent" />
                Featured <span className="text-primary neon-text-cyan">Hardware</span>
              </h2>
              <p className="text-muted-foreground">High-voltage selections for maximum impact.</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="hover:bg-primary/20 hover:text-primary font-display tracking-widest uppercase">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-[400px] rounded-lg border border-white/10 bg-card overflow-hidden flex flex-col">
                  <Skeleton className="h-[250px] w-full bg-white/5 rounded-none" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <Skeleton className="h-4 w-1/3 bg-white/5" />
                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                    <Skeleton className="h-8 w-1/4 bg-white/5 mt-auto" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts?.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-card border-y border-white/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,170,0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wider mb-4">
              Browse the <span className="text-secondary neon-text-pink">Sectors</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-white/5 border border-white/10" />
              ))
            ) : (
              categories?.map((cat, index) => (
                <Link key={cat.slug} href={`/shop?category=${encodeURIComponent(cat.name)}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="h-full"
                  >
                    <div className="bg-background border border-white/10 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center gap-3 hover:border-primary hover:neon-box-cyan transition-all group relative overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="font-display font-bold uppercase tracking-wider text-sm md:text-base group-hover:text-primary transition-colors relative z-10">
                        {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full relative z-10">
                        {cat.count} items
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Newsletter / CTA */}
      <section className="py-32 bg-background relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <Zap className="h-16 w-16 text-accent mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-widest mb-6 leading-tight">
            Ready to <span className="text-accent filter drop-shadow-[0_0_10px_rgba(170,255,0,0.8)]">Light Up?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join the grid. Connect with the network. Get 10% off your first hardware requisition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="ENTER NEURAL LINK (EMAIL)" 
              className="bg-card/50 backdrop-blur-md border border-white/20 h-14 px-6 text-center sm:text-left focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(170,255,0,0.3)] transition-all min-w-[300px] font-mono text-sm"
            />
            <Button size="lg" className="h-14 px-8 bg-accent text-accent-foreground hover:bg-white font-display font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(170,255,0,0.5)]">
              Initialize
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
