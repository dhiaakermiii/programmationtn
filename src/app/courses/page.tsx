import { MainLayout } from "@/components/layout/main-layout";
import prisma from "@/lib/prisma";
import { CourseFilters } from "@/components/courses/course-filters";
import { CourseCard } from "@/components/courses/course-card";
import { Decimal } from '@prisma/client/runtime/library';

export default async function CoursesPage({ 
  searchParams 
}: { 
  searchParams: { 
    [key: string]: string | string[] | undefined 
  }
}) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : 0;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : 500;

  // Build the query based on filters
  const where = {
    isPublished: true,
    // Add category filter if selected
    ...(category ? {
      categories: {
        some: {
          category: {
            name: category
          }
        }
      }
    } : {}),
    // Add search filter if provided
    ...(search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as any } },
        { description: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {}),
    // Add price range filter
    price: {
      gte: new Decimal(minPrice),
      lte: new Decimal(maxPrice)
    }
  };

  // Determine sort order
  let orderBy = {};
  switch (sort) {
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'price_low':
      orderBy = { price: 'asc' };
      break;
    case 'price_high':
      orderBy = { price: 'desc' };
      break;
    case 'title_asc':
      orderBy = { title: 'asc' };
      break;
    case 'title_desc':
      orderBy = { title: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  // Fetch all published courses with their categories
  const courses = await prisma.course.findMany({
    where,
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: orderBy as any,
  });

  // Fetch all categories for filtering
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <MainLayout>
      <div className="container py-8 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Courses</h1>
          
          {/* Filters */}
          <CourseFilters 
            categories={categories} 
            totalCourses={courses.length} 
          />
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold">No courses found</h2>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl}
                price={Number(course.price)}
                categories={course.categories}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 