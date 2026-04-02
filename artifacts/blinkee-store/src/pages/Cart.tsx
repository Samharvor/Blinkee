import { Link } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveFromCart, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Zap, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { data: cart, isLoading } = useGetCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateItemMutation = useUpdateCartItem({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
    }
  });

  const removeItemMutation = useRemoveFromCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
    }
  });

  const clearCartMutation = useClearCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Cart Cleared",
          description: "All items removed from your cart.",
        });
      }
    }
  });

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemMutation.mutate({ productId });
    } else {
      updateItemMutation.mutate({
        productId,
        data: { quantity: newQuantity }
      });
    }
  };

  const handleRemove = (productId: number) => {
    removeItemMutation.mutate({ productId });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      clearCartMutation.mutate();
      setIsCheckingOut(false);
      toast({
        title: "Order Processed",
        description: "Your neon gear is on the way!",
        className: "bg-background border-secondary neon-box-pink text-foreground",
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-black text-white uppercase tracking-wider mb-8">Loading Cache...</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Skeleton className="h-32 w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-32 w-full bg-white/5 rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-64 w-full bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <ShoppingCart className="h-24 w-24 text-muted-foreground opacity-20" />
          <AlertTriangle className="h-10 w-10 text-secondary absolute bottom-0 right-0" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-wider mb-4">
          Cache is <span className="text-destructive">Empty</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Your inventory slot currently holds zero items. Return to the grid to acquire new hardware.
        </p>
        <Link href="/shop">
          <Button size="lg" className="bg-primary hover:bg-white text-background hover:text-black font-display font-bold tracking-widest uppercase neon-box-cyan h-14 px-8 text-lg">
            Scan for Hardware <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wider">
          Active <span className="text-primary neon-text-cyan">Inventory</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Item List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-card border border-white/10 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-display font-bold uppercase tracking-widest text-muted-foreground bg-background/50 hidden md:grid">
              <div className="col-span-6">Hardware</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="flex flex-col">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div 
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    {/* Mobile layout wrapper */}
                    <div className="md:col-span-6 flex items-center gap-4">
                      <div className="h-20 w-20 bg-background rounded border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Zap className="h-8 w-8 text-primary opacity-30" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-bold text-white line-clamp-2 hover:text-primary transition-colors cursor-pointer">{item.product.name}</h3>
                        </Link>
                        <span className="text-xs text-muted-foreground uppercase font-mono mt-1">{item.product.category}</span>
                        {/* Mobile price */}
                        <div className="md:hidden mt-2 font-mono text-primary">${item.product.price.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="hidden md:block col-span-2 text-center font-mono text-muted-foreground">
                      ${item.product.price.toFixed(2)}
                    </div>

                    {/* Quantity controls */}
                    <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-center mt-2 md:mt-0">
                      <div className="flex items-center border border-white/20 rounded bg-background p-1 w-24">
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-white"
                          disabled={updateItemMutation.isPending}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex-1 text-center font-mono text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-white"
                          disabled={updateItemMutation.isPending || item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      
                      {/* Mobile Total */}
                      <div className="md:hidden font-display font-bold text-white text-lg">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Desktop Total & Remove */}
                    <div className="hidden md:flex col-span-2 justify-end items-center gap-4">
                      <span className="font-display font-bold text-white text-lg">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        disabled={removeItemMutation.isPending}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Mobile Remove */}
                    <div className="md:hidden w-full flex justify-end mt-2">
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="text-xs text-destructive uppercase tracking-widest font-display flex items-center"
                        disabled={removeItemMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove from cache
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-background/30 flex justify-between">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs font-display tracking-widest uppercase"
                onClick={() => clearCartMutation.mutate()}
                disabled={clearCartMutation.isPending}
              >
                Clear Entire Cache
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-white/10 rounded-lg p-6 sticky top-24 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" /> Transaction Summary
            </h2>
            
            <div className="flex flex-col gap-4 mb-6 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cart.totalItems} items)</span>
                <span className="text-white">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent uppercase text-xs">Calculated at Node</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span className="text-accent uppercase text-xs">Calculated at Node</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8 pt-4 border-t border-white/10">
              <span className="text-lg font-display font-bold uppercase tracking-wider text-white">Total</span>
              <span className="text-3xl font-display font-black text-primary neon-text-cyan">
                ${cart.subtotal.toFixed(2)}
              </span>
            </div>
            
            <Button 
              className="w-full h-14 bg-secondary hover:bg-white text-secondary-foreground hover:text-black font-display font-bold tracking-widest uppercase neon-box-pink transition-all text-lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "PROCESSING..." : "SECURE CHECKOUT"}
            </Button>
            
            <div className="mt-4 text-center text-xs text-muted-foreground font-mono">
              <p>Encrypted 256-bit neural connection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
