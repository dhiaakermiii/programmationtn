import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for creating a course
const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  isPublished: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
});

// GET all courses (for admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all courses
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("[COURSES_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new course
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = courseSchema.parse(body);

    // Extract category IDs
    const categoryIds = validatedData.categoryIds || [];
    delete validatedData.categoryIds;

    // Create the course
    const course = await prisma.course.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl || "",  // Ensure imageUrl is never null
        price: validatedData.price,
        isPublished: validatedData.isPublished,
        // Connect categories if provided
        categories: categoryIds.length > 0
          ? {
              create: categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Convert Decimal to number for response
    const formattedCourse = {
      ...course,
      price: Number(course.price),
    };

    return NextResponse.json(formattedCourse, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error("[COURSES_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 