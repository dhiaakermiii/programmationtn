import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST to enroll in a course
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const { courseId } = params;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.redirect(new URL("/courses", req.url));
    }

    // Check if the user already has an enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      // User is already enrolled, redirect to course
      return NextResponse.redirect(new URL(`/learn/${courseId}`, req.url));
    }

    // If the course is not free, check if the user has an active subscription
    if (Number(course.price) > 0) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      });

      if (!subscription) {
        // User doesn't have a subscription, redirect to checkout
        return NextResponse.redirect(new URL(`/checkout?courseId=${courseId}`, req.url));
      }
    }

    // Create an enrollment
    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });

    // Redirect to the course learning page
    return NextResponse.redirect(new URL(`/learn/${courseId}`, req.url));
  } catch (error) {
    console.error("[COURSE_ENROLL]", error);
    return NextResponse.redirect(new URL("/courses", req.url));
  }
} 