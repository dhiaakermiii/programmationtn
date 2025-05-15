import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { enrollInCourse } from "@/actions/course-enrollment";
import { CourseImage } from "@/components/courses/course-image";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions);
  const { courseId } = params;

  // Fetch course with lessons and categories
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: {
      lessons: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  // Check if course exists
  if (!course) {
    notFound();
  }

  // Check if user is enrolled in this course
  let isEnrolled = false;
  let hasActiveSubscription = false;

  if (session?.user) {
    // Check for enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });

    isEnrolled = !!enrollment;

    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    hasActiveSubscription = !!subscription;
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4 sm:px-6">
        {/* Responsive grid: 1 col on mobile, 3 cols on md+ */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Course Main Info */}
          <div className="col-span-2 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{course.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              {course.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {category.name}
                </span>
              ))}
            </div>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <CourseImage imageUrl={course.imageUrl} title={course.title} />
            </div>
            <div className="prose max-w-none">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">About this course</h2>
              <p className="text-base text-muted-foreground">{course.description}</p>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Course Details</CardTitle>
                <CardDescription>
                  {course.lessons.length} lessons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">
                    ${Number(course.price).toFixed(2)}
                  </p>
                  {hasActiveSubscription && (
                    <p className="text-sm text-muted-foreground">
                      Included in your subscription
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">What you'll learn</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Complete curriculum with detailed explanations</li>
                    <li>Step-by-step guidance through all concepts</li>
                    <li>Practical exercises and real-world examples</li>
                    <li>Lifetime access to course materials</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                {isEnrolled ? (
                  <Link href={`/learn/${courseId}`} className="w-full">
                    <Button className="w-full h-11 min-w-[44px] px-4">Continue Learning</Button>
                  </Link>
                ) : (
                  <Link href={`/api/courses/${courseId}/enroll`} className="w-full">
                    <Button className="w-full h-11 min-w-[44px] px-4">
                      {Number(course.price) === 0
                        ? "Enroll for Free"
                        : `Enroll for $${Number(course.price).toFixed(2)}`}
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl sm:text-2xl font-bold tracking-tight">Course Curriculum</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <Card key={lesson.id} className="focus-within:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-base sm:text-lg font-semibold">
                      {index + 1}. {lesson.title}
                    </CardTitle>
                    {isEnrolled ? (
                      <Link href={`/learn/${courseId}/lessons/${lesson.id}`}>
                        <Button variant="outline" size="sm" className="h-10 min-w-[44px] px-4">Start</Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" className="h-10 min-w-[44px] px-4" disabled>
                        Locked
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 