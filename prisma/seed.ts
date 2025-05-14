import { PrismaClient } from '../src/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create an admin user
    const adminPassword = await hash('Admin123!', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Admin user created: ${admin.name}`);

    // Create some categories
    const categories = [
      { name: 'Web Development', description: 'Learn web development technologies' },
      { name: 'Data Science', description: 'Explore data analysis and visualization' },
      { name: 'Mobile Development', description: 'Build mobile applications' },
      { name: 'DevOps', description: 'Learn about DevOps practices and tools' },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
    console.log(`${categories.length} categories created`);

    // Create a sample course
    const course = await prisma.course.upsert({
      where: { id: 'cltest-course-01' },
      update: {},
      create: {
        id: 'cltest-course-01',
        title: 'Introduction to Next.js',
        description: 'Learn the fundamentals of Next.js, from routing to data fetching.',
        price: 99.99,
        isPublished: true,
        categories: {
          create: [
            {
              category: {
                connect: { name: 'Web Development' }
              }
            }
          ]
        }
      },
    });
    console.log(`Course created: ${course.title}`);

    // Create some lessons
    const lessons = [
      {
        title: 'Getting Started with Next.js',
        description: 'Setting up your development environment and creating your first Next.js app.',
        position: 1,
        courseId: course.id,
      },
      {
        title: 'Routing in Next.js',
        description: 'Learn how the file-based routing system works in Next.js.',
        position: 2,
        courseId: course.id,
      },
      {
        title: 'Data Fetching Strategies',
        description: 'Explore the different ways to fetch data in a Next.js application.',
        position: 3,
        courseId: course.id,
      }
    ];

    for (const lesson of lessons) {
      await prisma.lesson.create({
        data: lesson,
      });
    }
    console.log(`${lessons.length} lessons created`);

    // Create a test user
    const userPassword = await hash('User123!', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Test User',
        password: userPassword,
        role: 'USER',
      },
    });
    console.log(`Test user created: ${user.name}`);

    // Create a sample coupon
    const coupon = await prisma.coupon.upsert({
      where: { code: 'WELCOME20' },
      update: {},
      create: {
        code: 'WELCOME20',
        discountPercent: 20,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
      },
    });
    console.log(`Coupon created: ${coupon.code}`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 