"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CourseImage } from "./course-image";

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  price: z.coerce.number().min(0, { message: "Price must be 0 or greater" }),
  isPublished: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
});

// Define the type based on the schema
type FormValues = z.infer<typeof formSchema>;

// Define props for component
interface CourseFormProps {
  initialData?: any; // The course data when editing
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle new category creation
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setIsAddingCategory(true);
      
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription || undefined,
        }),
      });
      
      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prev) => [...prev, newCategory]);
        setNewCategoryName("");
        setNewCategoryDescription("");
        setIsCategoryDialogOpen(false);
        toast.success("Category added successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsAddingCategory(false);
    }
  };
  
  // Prepare default values for the form
  const defaultValues = initialData
    ? {
        ...initialData,
        categoryIds: initialData.categories?.map((cat: any) => cat.category?.id || cat.id) || [],
      }
    : {
        title: "",
        description: "",
        imageUrl: "",
        price: 0,
        isPublished: false,
        categoryIds: [],
      };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Submit handler for creating/updating a course
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      if (initialData) {
        // Update existing course
        const response = await fetch(`/api/courses/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            categoryIds: values.categoryIds || [],
          }),
        });
        
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        
        toast.success("Course updated successfully");
      } else {
        // Create new course
        const response = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            categoryIds: values.categoryIds || [],
          }),
        });
        
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        
        const data = await response.json();
        toast.success("Course created successfully");
        router.push(`/admin/courses/${data.id}`);
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete handler
  const onDelete = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/courses/${initialData.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      
      toast.success("Course deleted successfully");
      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Check if we're editing an existing course
  const isEditing = !!initialData;
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Course description" rows={5} {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      // Reset form errors for this field on change
                      form.clearErrors("imageUrl");
                    }}
                  />
                </FormControl>
                <FormDescription>
                  URL for the course cover image. {!field.value && "If left empty, no image will be displayed."}
                </FormDescription>
                {field.value && !field.value.match(/^(https?:\/\/).*\.(jpg|jpeg|png|gif|webp)$/i) && (
                  <p className="text-sm text-amber-600">
                    This URL may not be a valid image. Make sure it's a direct link to an image file (JPG, PNG, GIF, WEBP).
                  </p>
                )}
                <FormMessage />
                
                {/* Image Preview */}
                {field.value && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Image Preview:</p>
                    <div className="max-w-md">
                      <CourseImage 
                        imageUrl={field.value} 
                        title={form.watch("title") || "Course Preview"} 
                      />
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <FormLabel>Categories</FormLabel>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <FormLabel>Name</FormLabel>
                      <Input
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel>Description (optional)</FormLabel>
                      <Textarea
                        placeholder="Category description"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={handleAddCategory}
                        disabled={isAddingCategory || !newCategoryName.trim()}
                      >
                        {isAddingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    {categories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No categories available. Create one to get started.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2 border rounded-md p-3">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                const currentCategories = field.value || [];
                                if (checked) {
                                  field.onChange([...currentCategories, category.id]);
                                } else {
                                  field.onChange(currentCategories.filter((id) => id !== category.id));
                                }
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>
                    Make this course available to students
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Course" : "Create Course"}
            </Button>
            
            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Course
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the course and all associated lessons.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
} 