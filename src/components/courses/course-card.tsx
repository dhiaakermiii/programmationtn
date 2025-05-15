"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseImage } from "./course-image";
import { Decimal } from '@prisma/client/runtime/library';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface CategoryOnCourse {
  category: Category;
}

interface CourseCardProps {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  price: Decimal | number;
  categories: CategoryOnCourse[];
}

export function CourseCard({ 
  id, 
  title, 
  description, 
  imageUrl, 
  price, 
  categories 
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg focus-within:shadow-lg h-full flex flex-col">
      <CourseImage imageUrl={imageUrl} title={title} />
      <CardHeader>
        <CardTitle className="line-clamp-1 text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {categories.map(({ category }) => (
            <Link 
              key={category.id}
              href={`/courses?category=${encodeURIComponent(category.name)}`}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4 mt-auto">
        <div className="text-lg font-bold">${Number(price).toFixed(2)}</div>
        <Link href={`/courses/${id}`}>
          <Button className="h-10 min-w-[100px]">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 