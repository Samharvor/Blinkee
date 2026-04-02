import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

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
    }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate({
      data: {
        productId: product.id,
        quantity: 1
      }
    });
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col bg-card border-card-border overflow-hidden group hover:neon-box-cyan transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center">
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
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.isFeatured && (
                <Badge className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-display font-bold tracking-wider neon-box-pink border-none">
                  FEATURED
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground font-display font-bold tracking-wider border-none shadow-[0_0_10px_rgba(170,255,0,0.5)]">
                  -{discount}%
                </Badge>
              )}
              {product.badge && !product.isFeatured && (
                <Badge variant="outline" className="border-primary text-primary font-display font-bold tracking-wider bg-background/80 backdrop-blur-sm">
                  {product.badge.toUpperCase()}
                </Badge>
              )}
            </div>
            
            {/* Quick Add Overlay */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <Button 
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock <= 0}
                className="font-display font-bold tracking-widest uppercase bg-primary hover:bg-primary text-primary-foreground neon-box-cyan"
              >
                {addToCartMutation.isPending ? "ADDING..." : "QUICK ADD"}
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-primary font-display uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-background/50 rounded-full px-2 py-0.5">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-xs font-bold text-accent">{product.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-foreground group-hover:neon-text-cyan transition-all duration-300">
              {product.name}
            </h3>
            
            <div className="mt-auto pt-4 flex items-end justify-between">
              <div className="flex flex-col">
                {discount > 0 && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-display font-bold text-white neon-text-cyan">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              
              {product.stock <= 0 && (
                <span className="text-destructive font-display text-xs font-bold uppercase tracking-wider">
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
