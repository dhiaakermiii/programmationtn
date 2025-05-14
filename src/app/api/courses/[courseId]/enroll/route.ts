import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: {
    courseId: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { courseId } = params;

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    // Check if user has active subscription or if the course is free
    const hasActiveSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    const isFree = Number(course.price) === 0;

    // If user doesn't have subscription and course isn't free, they need to pay
    if (!hasActiveSubscription && !isFree) {
      return NextResponse.json(
        { message: "Payment required" },
        { status: 402 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json(
      { 
        message: "Successfully enrolled",
        enrollment
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support GET requests to redirect from server actions
export async function GET(request: Request, { params }: RouteParams) {
  return POST(request, { params });
} 