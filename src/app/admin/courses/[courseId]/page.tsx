import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MainLayout } from "@/components/layout/main-layout";
import { CourseForm } from "@/components/courses/course-form";

interface CourseEditPageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch the course
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Format the categories for the form and prepare safe data for client component
  const formattedCourse = {
    ...course,
    // Convert Decimal to number for client component
    price: Number(course.price),
    // Ensure imageUrl is never undefined
    imageUrl: course.imageUrl || "",
    categories: course.categories.map((item) => item.category),
  };

  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="mb-6 text-3xl font-bold">Edit Course: {course.title}</h1>
        <CourseForm initialData={formattedCourse} />
      </div>
    </MainLayout>
  );
} 