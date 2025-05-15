"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Category = {
  id: string;
  name: string;
  description?: string | null;
};

interface CourseFiltersProps {
  categories: Category[];
  totalCourses: number;
}

export function CourseFilters({ categories, totalCourses }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter values from URL
  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "0";
  const currentMaxPrice = searchParams.get("maxPrice") || "500";
  const currentSearch = searchParams.get("search") || "";
  
  // State for price filter
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(currentMinPrice), 
    parseInt(currentMaxPrice)
  ]);
  
  // State for search input
  const [searchInput, setSearchInput] = useState(currentSearch);
  
  // Create a function to update URL with filters
  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update params based on provided updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    params.delete("page");
    
    // Update URL
    router.push(`/courses?${params.toString()}`);
  };
  
  // Handle category filter
  const handleCategoryClick = (categoryName: string) => {
    if (currentCategory === categoryName) {
      applyFilters({ category: null });
    } else {
      applyFilters({ category: categoryName });
    }
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchInput || null });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    applyFilters({ sort: value });
  };
  
  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  const applyPriceFilter = () => {
    applyFilters({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString()
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    router.push("/courses");
    setPriceRange([0, 500]);
    setSearchInput("");
  };
  
  // Check if any filters are applied
  const hasFilters = currentCategory || currentSort !== "newest" || 
    currentMinPrice !== "0" || currentMaxPrice !== "500" || currentSearch;
  
  return (
    <div className="space-y-4">
      {/* Search and filter count */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Input
            placeholder="Search courses..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-8"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                applyFilters({ search: null });
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
          <Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0">
            🔍
          </Button>
        </form>
        
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {totalCourses} {totalCourses === 1 ? 'course' : 'courses'}
          </p>
          
          {hasFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="h-9 gap-1"
            >
              <X size={14} />
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        <Button
          variant={!currentCategory ? "default" : "outline"}
          size="sm"
          onClick={() => applyFilters({ category: null })}
          className="rounded-full h-9"
        >
          All Courses
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category.name)}
            className="rounded-full h-9"
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Advanced filters */}
      <div className="flex flex-wrap gap-2 border-t pt-4">
        {/* Sort options */}
        <Select
          value={currentSort}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="min-w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="title_asc">Title: A-Z</SelectItem>
            <SelectItem value="title_desc">Title: Z-A</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Price filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3 gap-1">
              <SlidersHorizontal size={14} />
              Price Range
              {(currentMinPrice !== "0" || currentMaxPrice !== "500") && (
                <span className="ml-1 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Price Range</h4>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={500}
                step={5}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="min-price">Min Price</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">$</span>
                    <Input
                      id="min-price"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="w-20 h-8"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="max-price">Max Price</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">$</span>
                    <Input
                      id="max-price"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="w-20 h-8"
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={applyPriceFilter} 
                className="w-full"
              >
                Apply Price Filter
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 