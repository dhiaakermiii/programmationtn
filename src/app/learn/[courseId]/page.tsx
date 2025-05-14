import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearnPageProps {
  params: {
    courseId: string;
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const session = await getServerSession(authOptions);
  const { courseId } = params;

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user is enrolled in this course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  // Fetch course with all published lessons
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
    },
  });

  if (!course) {
    redirect("/courses");
  }

  // Fetch progress for all lessons in this course
  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lesson: {
        courseId,
      },
    },
  });

  // Create a map of lesson IDs to progress
  const progressMap = progress.reduce((acc, curr) => {
    acc[curr.lessonId] = curr;
    return acc;
  }, {} as Record<string, typeof progress[0]>);

  // Calculate overall course progress
  const completedLessons = progress.filter((p) => p.completed).length;
  const totalLessons = course.lessons.length;
  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  // Get the first lesson or the first incomplete lesson
  const firstIncompleteLesson = course.lessons.find(
    (lesson) => !progressMap[lesson.id]?.completed
  );
  const nextLesson = firstIncompleteLesson || course.lessons[0];

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="mt-2 text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed ({progressPercentage}%)
            </p>
          </div>
          {nextLesson && (
            <Link href={`/learn/${courseId}/lessons/${nextLesson.id}`}>
              <Button>
                {completedLessons > 0 ? "Continue Learning" : "Start Learning"}
              </Button>
            </Link>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10 h-3 w-full rounded-full bg-muted">
          <div
            className="h-3 rounded-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => {
            const isCompleted = progressMap[lesson.id]?.completed || false;

            return (
              <Card key={lesson.id} className={isCompleted ? "border-primary/50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                        {index + 1}
                      </span>
                      {lesson.title}
                      {isCompleted && (
                        <span className="ml-2 text-xs text-primary">
                          (Completed)
                        </span>
                      )}
                    </CardTitle>
                    <Link href={`/learn/${courseId}/lessons/${lesson.id}`}>
                      <Button variant="outline" size="sm">
                        {isCompleted ? "Review" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
} 