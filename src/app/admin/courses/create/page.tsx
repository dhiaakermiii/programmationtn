import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { MainLayout } from "@/components/layout/main-layout";
import { CourseForm } from "@/components/courses/course-form";

export default async function CreateCoursePage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="mb-6 text-3xl font-bold">Create New Course</h1>
        <CourseForm />
      </div>
    </MainLayout>
  );
} 