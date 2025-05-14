import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

async function markLessonComplete(formData: FormData) {
  "use server";
  
  const courseId = formData.get("courseId") as string;
  const lessonId = formData.get("lessonId") as string;
  
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return;
  }
  
  // Check if progress record exists
  const existingProgress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });
  
  if (existingProgress) {
    // Update existing progress record
    await prisma.progress.update({
      where: {
        id: existingProgress.id,
      },
      data: {
        completed: true,
      },
    });
  } else {
    // Create new progress record
    await prisma.progress.create({
      data: {
        userId: session.user.id,
        lessonId,
        completed: true,
      },
    });
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await getServerSession(authOptions);
  const { courseId, lessonId } = params;
  
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
  
  // Fetch the course
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
  
  // Find the current lesson
  const currentLesson = course.lessons.find(lesson => lesson.id === lessonId);
  
  if (!currentLesson) {
    redirect(`/learn/${courseId}`);
  }
  
  // Get progress for current lesson
  const progress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });
  
  const isCompleted = !!progress?.completed;
  
  // Find adjacent lessons
  const currentIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-4 flex items-center justify-between">
          <Link href={`/learn/${courseId}`}>
            <Button variant="outline">Back to Course</Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Lesson {currentIndex + 1} of {course.lessons.length}
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
        </div>
        
        {/* Video Player */}
        <div className="mb-8">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted/80">
            {currentLesson.videoUrl ? (
              <iframe
                src={currentLesson.videoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No video available for this lesson</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Lesson Description */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-bold">Lesson Description</h2>
            <p className="text-muted-foreground">{currentLesson.description}</p>
          </CardContent>
        </Card>
        
        {/* Navigation and Completion */}
        <div className="mt-10 flex items-center justify-between">
          <div>
            {prevLesson ? (
              <Link href={`/learn/${courseId}/lessons/${prevLesson.id}`}>
                <Button variant="outline">Previous Lesson</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Previous Lesson
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {isCompleted ? (
              <div className="text-sm font-medium text-primary">
                Completed ✓
              </div>
            ) : (
              <form action={markLessonComplete}>
                <input type="hidden" name="courseId" value={courseId} />
                <input type="hidden" name="lessonId" value={lessonId} />
                <Button type="submit">Mark as Completed</Button>
              </form>
            )}
            
            {nextLesson && (
              <Link href={`/learn/${courseId}/lessons/${nextLesson.id}`}>
                <Button>Next Lesson</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 