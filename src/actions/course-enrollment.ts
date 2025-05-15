"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Server action for enrolling in a course
 * @param courseId - The ID of the course to enroll in
 * @param hasActiveSubscription - Whether the user has an active subscription
 * @param coursePrice - The price of the course
 */
export async function enrollInCourse(
  courseId: string, 
  hasActiveSubscription: boolean, 
  coursePrice: number
) {
  const session = await getServerSession(authOptions);
  
  // Check if the user is authenticated
  if (!session?.user) {
    redirect("/auth/login");
  }

  // If the user has an active subscription or the course is free, enroll them directly
  if (hasActiveSubscription || coursePrice === 0) {
    try {
      // Check if the course exists
      const course = await prisma.course.findUnique({
        where: {
          id: courseId,
          isPublished: true,
        },
      });

      if (!course) {
        throw new Error("Course not found");
      }

      // Create the enrollment
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
        },
      });

      // Redirect to the course learning page
      redirect(`/learn/${courseId}`);
    } catch (error) {
      // If the enrollment already exists, just redirect to the learning page
      if (error instanceof Error && error.message.includes("Unique constraint")) {
        redirect(`/learn/${courseId}`);
      }
      
      console.error("Error enrolling in course:", error);
      throw new Error("Failed to enroll in course");
    }
  } else {
    // Redirect to checkout for paid courses
    redirect(`/checkout?courseId=${courseId}`);
  }
} 