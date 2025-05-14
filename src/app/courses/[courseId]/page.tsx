import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

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

  // Handle enrollment
  const handleEnrollment = async () => {
    if (!session) {
      redirect("/auth/login");
    }

    // If user has subscription or course is free, they can enroll directly
    if (hasActiveSubscription || Number(course.price) === 0) {
      redirect(`/api/courses/${courseId}/enroll`);
    } else {
      // Otherwise, redirect to checkout
      redirect(`/checkout?courseId=${courseId}`);
    }
  };

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          {/* Course Main Info */}
          <div className="col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            
            <div className="flex flex-wrap gap-2">
              {course.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {category.name}
                </span>
              ))}
            </div>
            
            <div className="aspect-video w-full rounded-lg bg-muted"></div>
            
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold">About this course</h2>
              <p>{course.description}</p>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
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
                    <Button className="w-full">Continue Learning</Button>
                  </Link>
                ) : (
                  <form action={handleEnrollment}>
                    <Button type="submit" className="w-full">
                      {Number(course.price) === 0
                        ? "Enroll for Free"
                        : `Enroll for $${Number(course.price).toFixed(2)}`}
                    </Button>
                  </form>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Course Curriculum</h2>
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <Card key={lesson.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {index + 1}. {lesson.title}
                    </CardTitle>
                    {isEnrolled ? (
                      <Link href={`/learn/${courseId}/lessons/${lesson.id}`}>
                        <Button variant="outline" size="sm">Start</Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
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