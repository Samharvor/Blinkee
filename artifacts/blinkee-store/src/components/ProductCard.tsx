import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_GLOW: Record<string, string> = {
  "Party Hats":  "img-glow-pink",
  "Jewelry":     "img-glow-cyan",
  "Wands":       "img-glow-purple",
  "Eyewear":     "img-glow-lime",
  "Glow Sticks": "img-glow-green",
};

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
          className: "bg-background border-primary neon-box-cyan text-foreground",
        });
      },
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate({ data: { productId: product.id, quantity: 1 } });
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const imageGlowClass = CATEGORY_GLOW[product.category] ?? "img-glow-cyan";

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
        <Card className="h-full flex flex-col bg-card border-card-border overflow-hidden group hover:neon-box-cyan transition-all duration-300">

          {/* Image + glow wrapper */}
          <div className={`relative aspect-square overflow-hidden bg-muted flex items-center justify-center ${imageGlowClass}`}>
            {!imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Zap className="h-12 w-12 text-primary opacity-50 mb-2" />
                <span className="text-xs uppercase tracking-widest font-display">No Image</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              {product.isFeatured && (
                <span className="text-[10px] font-display font-black tracking-widest uppercase px-2 py-0.5 rounded-sm bg-secondary/90 text-white neon-box-pink border border-secondary/60">
                  FEATURED
                </span>
              )}
              {discount > 0 && (
                <span className="badge-lime text-[10px] font-display font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
                  -{discount}%
                </span>
              )}
              {product.badge && (
                <span className="text-[10px] font-display font-black tracking-widest uppercase px-2 py-0.5 rounded-sm border border-primary/60 text-primary bg-background/80 backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Quick Add overlay — full solid neon on hover, black text */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-20">
              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock <= 0}
                className="font-display font-black tracking-widest uppercase text-sm min-h-[48px] px-6
                           bg-transparent border-2 border-primary text-primary
                           hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]
                           active:scale-95 transition-all duration-150"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {addToCartMutation.isPending ? "ADDING..." : "QUICK ADD"}
              </Button>
            </div>
          </div>

          {/* Card body */}
          <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-primary font-display uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-background/50 rounded-full px-2 py-0.5">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-[11px] font-bold text-accent">{product.rating.toFixed(1)}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-foreground group-hover:neon-text-cyan transition-all duration-300 mb-auto">
              {product.name}
            </h3>

            <div className="pt-3 flex items-end justify-between">
              <div className="flex flex-col">
                {discount > 0 && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
                <span className="text-lg sm:text-xl font-display font-black text-white neon-text-cyan">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              {product.stock <= 0 && (
                <span className="text-destructive font-display text-[10px] font-bold uppercase tracking-wider">
                  OUT OF STOCK
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
