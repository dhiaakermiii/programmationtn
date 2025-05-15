import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Schema for updating a course
const courseUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().min(0).optional(),
  isPublished: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
});

// GET a specific course by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        lessons: {
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

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Format response to ensure Decimal is converted to number
    const formattedCourse = {
      ...course,
      price: Number(course.price),
    };

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error("[COURSE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH to update a course
export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = params;

    // Check if the course exists
    const courseExists = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseExists) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = courseUpdateSchema.parse(body);

    // Extract category IDs if provided
    const categoryIds = validatedData.categoryIds;
    delete validatedData.categoryIds;

    // Prepare transaction operations
    const operations = [];

    // Update course basic info
    operations.push(
      prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          ...(validatedData.title && { title: validatedData.title }),
          ...(validatedData.description !== undefined && { description: validatedData.description }),
          ...(validatedData.imageUrl !== undefined && { imageUrl: validatedData.imageUrl }),
          ...(validatedData.price !== undefined && { price: validatedData.price }),
          ...(validatedData.isPublished !== undefined && { isPublished: validatedData.isPublished }),
        },
      })
    );

    // Update categories if provided
    if (categoryIds !== undefined) {
      // First delete all existing category connections
      operations.push(
        prisma.categoriesOnCourses.deleteMany({
          where: {
            courseId,
          },
        })
      );

      // Then create new connections if there are categories
      if (categoryIds.length > 0) {
        operations.push(
          prisma.categoriesOnCourses.createMany({
            data: categoryIds.map((categoryId) => ({
              courseId,
              categoryId,
            })),
          })
        );
      }
    }

    // Execute all operations in a transaction
    await prisma.$transaction(operations);

    // Fetch the updated course with categories
    const updatedCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Format response to ensure Decimal is converted to number
    const formattedCourse = updatedCourse ? {
      ...updatedCourse,
      price: Number(updatedCourse.price),
    } : null;

    return NextResponse.json(formattedCourse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error("[COURSE_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a course
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = params;

    // Check if the course exists
    const courseExists = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseExists) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Delete the course
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 