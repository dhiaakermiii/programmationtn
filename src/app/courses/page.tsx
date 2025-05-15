import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function CoursesPage() {
  // Fetch all published courses with their categories
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch all categories for filtering
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <MainLayout>
      <div className="container py-8 px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Courses</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {courses.length} courses
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full h-10 min-w-[44px] px-4">
              All Courses
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className="rounded-full h-10 min-w-[44px] px-4"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold">No courses found</h2>
            <p className="mt-2 text-muted-foreground">
              Check back later for new courses
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-lg focus-within:shadow-lg">
                <div className="aspect-video w-full bg-muted" />
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg font-semibold">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {course.categories.map(({ category }) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-lg font-bold">${Number(course.price).toFixed(2)}</div>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="h-11 min-w-[44px] px-4">View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 