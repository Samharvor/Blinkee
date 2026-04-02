import { useParams, Link } from "wouter";
import { useGetProduct, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Star, Zap, Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id, 10);
  
  const { data: product, isLoading, isError } = useGetProduct(productId, { 
    query: { enabled: !isNaN(productId) } 
  });
  
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Added to Cart",
          description: `${quantity}x ${product?.name} added to your cart.`,
          className: "bg-background border-primary neon-box-cyan text-foreground",
        });
      },
    }
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({
      data: {
        productId: product.id,
        quantity
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-6 w-32 bg-white/5 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-lg bg-white/5" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4 bg-white/5" />
            <Skeleton className="h-6 w-1/4 bg-white/5" />
            <Skeleton className="h-32 w-full bg-white/5 mt-4" />
            <Skeleton className="h-14 w-full bg-white/5 mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center">
        <Zap className="h-16 w-16 text-destructive mb-6" />
        <h1 className="text-4xl font-display font-black uppercase tracking-widest text-white mb-4">Error 404</h1>
        <p className="text-muted-foreground mb-8">Hardware module not found in the current sector.</p>
        <Link href="/shop">
          <Button className="bg-primary font-display font-bold uppercase tracking-widest neon-box-cyan text-background">
            Return to Grid
          </Button>
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link href="/shop" className="inline-flex items-center text-sm font-display tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Grid
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square bg-card border border-white/10 rounded-lg overflow-hidden flex items-center justify-center group"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 m-4 opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/50 m-4 opacity-50"></div>

          {!imageError ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="object-cover w-full h-full max-h-[80%] max-w-[80%] drop-shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Zap className="h-24 w-24 text-primary opacity-30 mb-4" />
              <span className="text-sm uppercase tracking-widest font-display">Visual Feed Offline</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isFeatured && (
              <Badge className="bg-secondary text-secondary-foreground font-display font-bold tracking-wider text-sm px-3 py-1 neon-box-pink border-none">
                FEATURED
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-accent text-accent-foreground font-display font-bold tracking-wider text-sm px-3 py-1 border-none shadow-[0_0_15px_rgba(170,255,0,0.6)]">
                -{discount}% OFF
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-primary font-display font-bold uppercase tracking-widest">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 bg-card border border-white/10 rounded-full px-3 py-1">
              <Star className="h-4 w-4 fill-accent text-accent drop-shadow-[0_0_5px_rgba(170,255,0,0.8)]" />
              <span className="text-sm font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-wider mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-col mb-8 pb-8 border-b border-white/10">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-display font-black text-primary neon-text-cyan">
                ${product.price.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xl text-muted-foreground line-through font-mono">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            
            {product.stock > 0 ? (
              <span className="text-accent text-sm font-display font-bold tracking-widest uppercase mt-4 flex items-center">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2 shadow-[0_0_8px_rgba(170,255,0,1)]"></div>
                {product.stock} Units Available in Local Cache
              </span>
            ) : (
              <span className="text-destructive text-sm font-display font-bold tracking-widest uppercase mt-4">
                Out of Stock - Awaiting Resupply
              </span>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-white/20 text-muted-foreground font-mono bg-card/50">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Area */}
          <div className="bg-card border border-white/10 p-6 rounded-lg mt-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between border border-white/20 rounded bg-background p-1 w-full sm:w-32">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:text-white"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-display font-bold text-lg w-8 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:text-white"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button 
                size="lg" 
                className="flex-1 h-14 bg-primary hover:bg-white text-background hover:text-black font-display font-bold tracking-widest uppercase neon-box-cyan transition-all text-lg"
                disabled={product.stock <= 0 || addToCartMutation.isPending}
                onClick={handleAddToCart}
              >
                {addToCartMutation.isPending ? (
                  "PROCESSING..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> 
                    {product.stock <= 0 ? "UNAVAILABLE" : "ADD TO CART"}
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 text-sm text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Light-speed shipping
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Secure transaction
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
