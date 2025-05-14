import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all courses
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      lessons: {
        select: {
          id: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Courses</h1>
            <p className="mt-1 text-muted-foreground">
              Showing {courses.length} courses
            </p>
          </div>
          <Link href="/admin/courses/create">
            <Button>Create New Course</Button>
          </Link>
        </div>

        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="mt-2 text-muted-foreground">
                Get started by creating a new course
              </p>
              <div className="mt-6">
                <Link href="/admin/courses/create">
                  <Button>Create Course</Button>
                </Link>
              </div>
            </div>
          ) : (
            courses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {course.title}
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${
                            course.isPublished
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        />
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {course.description?.slice(0, 120)}
                        {course.description && course.description.length > 120
                          ? "..."
                          : ""}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium">Price:</span>{" "}
                      ${Number(course.price).toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Lessons:</span>{" "}
                      {course.lessons.length}
                    </div>
                    <div>
                      <span className="font-medium">Enrollments:</span>{" "}
                      {course._count.enrollments}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {course.isPublished ? "Published" : "Draft"}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
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
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
} 