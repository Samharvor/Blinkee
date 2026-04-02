import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListProducts, useListCategories, getGetCartQueryKey } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce"; // We need a debounce hook, or inline it. Let's inline a simple one for the search.

export default function Shop() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [inStock, setInStock] = useState<boolean>(searchParams.get("inStock") === "true");
  
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPriceRange(priceRange), 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (inStock) params.set("inStock", "true");
    
    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ''}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      setLocation(newUrl, { replace: true });
    }
  };

  useEffect(() => {
    updateUrl();
  }, [category, debouncedSearch, inStock]);

  const { data: products, isLoading: productsLoading } = useListProducts({
    category: category || undefined,
    search: debouncedSearch || undefined,
    minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : undefined,
    maxPrice: debouncedPriceRange[1] < 100 ? debouncedPriceRange[1] : undefined,
    inStock: inStock ? true : undefined,
  });

  const { data: categories } = useListCategories();

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setPriceRange([0, 100]);
    setInStock(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-sm border-b border-white/10 pb-2">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search network..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-white/20 focus-visible:ring-primary focus-visible:border-primary font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-sm border-b border-white/10 pb-2">Sectors</h3>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setCategory("")}
            className={`text-left px-3 py-2 rounded text-sm tracking-wider uppercase font-display transition-all ${category === "" ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
          >
            All Hardware
          </button>
          {categories?.map((cat) => (
            <button 
              key={cat.slug}
              onClick={() => setCategory(cat.name)}
              className={`text-left px-3 py-2 rounded text-sm tracking-wider uppercase font-display flex justify-between items-center transition-all ${category === cat.name ? 'bg-primary/20 text-primary border-l-2 border-primary neon-box-cyan' : 'text-muted-foreground hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] bg-background/50 px-1.5 py-0.5 rounded opacity-70">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-sm border-b border-white/10 pb-2">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6 [&_[role=slider]]:bg-secondary [&_[role=slider]]:border-secondary [&_[role=slider]]:shadow-[0_0_10px_rgba(255,0,170,0.8)] [&_[data-orientation=horizontal]]:bg-secondary"
          />
          <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}{priceRange[1] === 100 ? '+' : ''}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-sm border-b border-white/10 pb-2">Availability</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock" className="text-sm font-display tracking-wider uppercase text-muted-foreground">In Stock Only</Label>
          <Switch 
            id="in-stock" 
            checked={inStock}
            onCheckedChange={setInStock}
            className="data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          />
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={clearFilters}
        className="w-full mt-4 border-white/20 text-muted-foreground hover:bg-white/5 hover:text-white font-display tracking-widest uppercase text-xs"
      >
        <X className="h-4 w-4 mr-2" /> Clear Parameters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wider mb-2">
            Hardware <span className="text-primary neon-text-cyan">Grid</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {productsLoading ? "Scanning network..." : `Found ${products?.length || 0} items matching parameters`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden border-primary/50 text-primary neon-box-cyan">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-card border-r-white/10">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="font-display font-bold tracking-widest uppercase text-white">Filter Parameters</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0 bg-card p-6 rounded-lg border border-white/10 h-fit sticky top-24">
          <SidebarContent />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="h-[350px] rounded-lg border border-white/10 bg-card overflow-hidden flex flex-col">
                  <Skeleton className="h-[200px] w-full bg-white/5 rounded-none" />
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <Skeleton className="h-4 w-1/3 bg-white/5" />
                    <Skeleton className="h-6 w-3/4 bg-white/5" />
                    <Skeleton className="h-8 w-1/4 bg-white/5 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-lg bg-card/50 border-dashed">
              <X className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-widest mb-2">No hardware found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">The requested parameters returned zero matches in the current network sector.</p>
              <Button 
                onClick={clearFilters}
                className="bg-primary text-primary-foreground font-display tracking-widest uppercase neon-box-cyan"
              >
                Reset Parameters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
