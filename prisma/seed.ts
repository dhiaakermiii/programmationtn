import { PrismaClient } from '../src/generated/prisma/index.js';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Create users with different roles
    const users = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'Admin123!',
        role: 'ADMIN',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        email: 'teacher@example.com',
        name: 'Jane Smith',
        password: 'Teacher123!',
        role: 'INSTRUCTOR',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        email: 'student1@example.com',
        name: 'Alex Johnson',
        password: 'Student123!',
        role: 'USER',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      {
        email: 'student2@example.com',
        name: 'Maria Garcia',
        password: 'Student123!',
        role: 'USER',
        image: 'https://randomuser.me/api/portraits/women/4.jpg',
      },
      {
        email: 'student3@example.com',
        name: 'John Lee',
        password: 'Student123!',
        role: 'USER',
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
    ];

    for (const user of users) {
      const hashedPassword = await hash(user.password, 10);
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role as any,
          image: user.image,
        },
      });
    }
    console.log(`${users.length} users created`);

    // Create comprehensive categories
    const categories = [
      { 
        name: 'Web Development', 
        description: 'Learn frontend and backend technologies for building modern web applications.'
      },
      { 
        name: 'Data Science', 
        description: 'Master data analysis, machine learning, and statistical methods.' 
      },
      { 
        name: 'Mobile Development', 
        description: 'Build native and cross-platform mobile applications for iOS and Android.' 
      },
      { 
        name: 'DevOps', 
        description: 'Learn CI/CD, containerization, cloud infrastructure, and automation.' 
      },
      { 
        name: 'UI/UX Design', 
        description: 'Create intuitive user interfaces and enhance user experience.' 
      },
      { 
        name: 'Cybersecurity', 
        description: 'Understand security principles, vulnerabilities, and protection methods.' 
      },
      { 
        name: 'Blockchain', 
        description: 'Explore blockchain technology, smart contracts, and decentralized apps.' 
      },
      { 
        name: 'Artificial Intelligence', 
        description: 'Study machine learning, deep learning, and AI applications.' 
      },
      { 
        name: 'Game Development', 
        description: 'Design and develop games for various platforms.' 
      },
      { 
        name: 'Cloud Computing', 
        description: 'Master AWS, Azure, GCP, and cloud architecture principles.' 
      },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
    console.log(`${categories.length} categories created`);

    // Create multiple courses with different categories
    const courses = [
      {
        id: 'course-nextjs-mastery',
        title: 'Next.js Mastery: From Zero to Production',
        description: 'Master Next.js by building real-world applications with React, TypeScript, and modern backend integrations. Learn server-side rendering, static site generation, API routes, and deployment strategies.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop',
        price: 129.99,
        isPublished: true,
        categories: ['Web Development'],
      },
      {
        id: 'course-data-visualization',
        title: 'Data Visualization with D3.js',
        description: 'Learn how to create stunning data visualizations using D3.js. This course covers everything from basic charts to complex interactive dashboards that tell compelling stories with data.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
        price: 89.99,
        isPublished: true,
        categories: ['Data Science', 'Web Development'],
      },
      {
        id: 'course-react-native',
        title: 'React Native for Beginners',
        description: 'Build cross-platform mobile apps for iOS and Android using React Native. This course will take you from the fundamentals to deploying your first app to the app stores.',
        imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1470&auto=format&fit=crop',
        price: 99.99,
        isPublished: true,
        categories: ['Mobile Development'],
      },
      {
        id: 'course-devops-pipeline',
        title: 'Building CI/CD Pipelines with GitHub Actions',
        description: 'Set up automated workflows for continuous integration and deployment using GitHub Actions. Learn how to automate testing, building, and deploying your applications.',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1476&auto=format&fit=crop',
        price: 79.99,
        isPublished: true,
        categories: ['DevOps'],
      },
      {
        id: 'course-ui-design',
        title: 'UI Design Principles and Practices',
        description: 'Learn the fundamental principles of good UI design and how to apply them in practice. This course covers color theory, typography, layout design, and prototyping.',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1528&auto=format&fit=crop',
        price: 69.99,
        isPublished: true,
        categories: ['UI/UX Design'],
      },
      {
        id: 'course-ethical-hacking',
        title: 'Ethical Hacking and Penetration Testing',
        description: 'Learn ethical hacking techniques to identify and fix security vulnerabilities in web applications and networks. This course provides hands-on experience with security tools and methodologies.',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop',
        price: 149.99,
        isPublished: true,
        categories: ['Cybersecurity'],
      },
      {
        id: 'course-blockchain-dapps',
        title: 'Building Decentralized Apps on Ethereum',
        description: 'Learn how to develop decentralized applications (DApps) on the Ethereum blockchain. This course covers smart contracts, Solidity programming, Web3.js, and frontend integration.',
        imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1374&auto=format&fit=crop',
        price: 119.99,
        isPublished: true,
        categories: ['Blockchain', 'Web Development'],
      },
      {
        id: 'course-machine-learning',
        title: 'Practical Machine Learning with Python',
        description: 'Build real-world machine learning models with Python. This course covers data preprocessing, model selection, evaluation, and deployment for solving practical problems.',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1470&auto=format&fit=crop',
        price: 139.99,
        isPublished: true,
        categories: ['Artificial Intelligence', 'Data Science'],
      },
      {
        id: 'course-unity-3d',
        title: 'Game Development with Unity 3D',
        description: 'Create immersive 3D games with Unity. This course teaches game development fundamentals, C# programming, physics, animation, and publishing your games to multiple platforms.',
        imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=1374&auto=format&fit=crop',
        price: 109.99,
        isPublished: false, // Unpublished course
        categories: ['Game Development'],
      },
      {
        id: 'course-aws-serverless',
        title: 'AWS Serverless Architecture',
        description: 'Design and implement serverless applications using AWS Lambda, API Gateway, DynamoDB, and other AWS services. Learn cost-effective, scalable cloud architecture patterns.',
        imageUrl: 'https://images.unsplash.com/photo-1603322327561-7c9d4d494a78?q=80&w=1470&auto=format&fit=crop',
        price: 129.99,
        isPublished: true,
        categories: ['Cloud Computing', 'DevOps'],
      },
    ];

    // Create courses with their categories
    for (const courseData of courses) {
      const { categories: categoryNames, ...courseDetails } = courseData;
      
      // Create the course
      const course = await prisma.course.upsert({
        where: { id: courseData.id },
        update: {},
        create: courseDetails,
      });
      
      // Link categories to the course
      for (const categoryName of categoryNames) {
        await prisma.categoriesOnCourses.create({
          data: {
            course: { connect: { id: course.id } },
            category: { connect: { name: categoryName } },
          },
        });
      }
    }
    console.log(`${courses.length} courses created`);

    // Create lessons for the Next.js course
    const nextjsLessons = [
      {
        title: 'Introduction to Next.js',
        description: 'Overview of Next.js, its features, and how it compares to other React frameworks.',
        position: 1,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-intro.mp4',
      },
      {
        title: 'Setting Up Your Development Environment',
        description: 'Install and configure the necessary tools for Next.js development.',
        position: 2,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-setup.mp4',
      },
      {
        title: 'File-Based Routing in Next.js',
        description: 'Learn how Next.js handles routing using the file system structure.',
        position: 3,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-routing.mp4',
      },
      {
        title: 'Data Fetching Strategies',
        description: 'Explore getStaticProps, getServerSideProps, and client-side data fetching.',
        position: 4,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-data-fetching.mp4',
      },
      {
        title: 'API Routes and Backend Integration',
        description: 'Create serverless API endpoints within your Next.js application.',
        position: 5,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-api-routes.mp4',
      },
      {
        title: 'Authentication in Next.js',
        description: 'Implement authentication using NextAuth.js.',
        position: 6,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-auth.mp4',
      },
      {
        title: 'Styling in Next.js',
        description: 'CSS Modules, Styled Components, Tailwind CSS, and other styling options.',
        position: 7,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-styling.mp4',
      },
      {
        title: 'Deploying to Vercel',
        description: 'Deploy your Next.js application to Vercel and configure domains.',
        position: 8,
        isPublished: true,
        courseId: 'course-nextjs-mastery',
        videoUrl: 'https://example.com/videos/nextjs-deployment.mp4',
      },
    ];

    // Create lessons for the Data Visualization course
    const dataVizLessons = [
      {
        title: 'Introduction to D3.js',
        description: 'Understanding the basics of D3.js and SVG.',
        position: 1,
        isPublished: true,
        courseId: 'course-data-visualization',
        videoUrl: 'https://example.com/videos/d3-intro.mp4',
      },
      {
        title: 'Data Binding and DOM Manipulation',
        description: 'Learn how to bind data to DOM elements in D3.',
        position: 2,
        isPublished: true,
        courseId: 'course-data-visualization',
        videoUrl: 'https://example.com/videos/d3-data-binding.mp4',
      },
      {
        title: 'Creating Basic Charts',
        description: 'Build bar charts, line charts, and scatter plots.',
        position: 3,
        isPublished: true,
        courseId: 'course-data-visualization',
        videoUrl: 'https://example.com/videos/d3-basic-charts.mp4',
      },
      {
        title: 'Scales and Axes',
        description: 'Work with scales and axes to create responsive visualizations.',
        position: 4,
        isPublished: true,
        courseId: 'course-data-visualization',
        videoUrl: 'https://example.com/videos/d3-scales.mp4',
      },
      {
        title: 'Animations and Transitions',
        description: 'Add animations to your visualizations.',
        position: 5,
        isPublished: true,
        courseId: 'course-data-visualization',
        videoUrl: 'https://example.com/videos/d3-animations.mp4',
      },
      {
        title: 'Interactive Dashboards',
        description: 'Create interactive dashboards with multiple visualizations.',
        position: 6,
        isPublished: true,
        courseId: 'course-data-visualization',
        videoUrl: 'https://example.com/videos/d3-dashboards.mp4',
      },
    ];

    // Create all lessons
    const allLessons = [...nextjsLessons, ...dataVizLessons];
    for (const lesson of allLessons) {
      await prisma.lesson.create({
        data: lesson,
      });
    }
    console.log(`${allLessons.length} lessons created`);

    // Create enrollments
    const enrollments = [
      { userId: users[2].email, courseId: 'course-nextjs-mastery' },
      { userId: users[2].email, courseId: 'course-data-visualization' },
      { userId: users[3].email, courseId: 'course-nextjs-mastery' },
      { userId: users[4].email, courseId: 'course-react-native' },
      { userId: users[4].email, courseId: 'course-devops-pipeline' },
    ];

    for (const enrollment of enrollments) {
      const user = await prisma.user.findUnique({
        where: { email: enrollment.userId },
      });
      
      if (user) {
        await prisma.enrollment.create({
          data: {
            user: { connect: { id: user.id } },
            course: { connect: { id: enrollment.courseId } },
          },
        });
      }
    }
    console.log(`${enrollments.length} enrollments created`);

    // Create progress records for some lessons
    const usersWithEnrollments = await prisma.user.findMany({
      where: { email: { in: [users[2].email, users[3].email, users[4].email] } },
      include: { enrollments: { include: { course: { include: { lessons: true } } } } },
    });

    let progressCount = 0;
    for (const user of usersWithEnrollments) {
      for (const enrollment of user.enrollments) {
        for (const lesson of enrollment.course.lessons) {
          // Randomly mark some lessons as completed
          if (Math.random() > 0.3) {
            await prisma.progress.create({
              data: {
                user: { connect: { id: user.id } },
                lesson: { connect: { id: lesson.id } },
                completed: true,
              },
            });
            progressCount++;
          }
        }
      }
    }
    console.log(`${progressCount} progress records created`);

    // Create coupons
    const coupons = [
      {
        code: 'WELCOME20',
        discountPercent: 20,
        discountAmount: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxUses: 100,
        isActive: true,
      },
      {
        code: 'SUMMER2023',
        discountPercent: 15,
        discountAmount: 0,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        maxUses: 200,
        isActive: true,
      },
      {
        code: 'FLASH50',
        discountPercent: 50,
        discountAmount: 0,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        maxUses: 50,
        isActive: true,
      },
      {
        code: 'NEWUSER',
        discountPercent: 0,
        discountAmount: 10.00,
        expiresAt: null, // Never expires
        maxUses: null, // Unlimited uses
        isActive: true,
      },
    ];

    for (const coupon of coupons) {
      await prisma.coupon.upsert({
        where: { code: coupon.code },
        update: {},
        create: coupon,
      });
    }
    console.log(`${coupons.length} coupons created`);

    // Create some payments
    const payments = [
      {
        userId: users[2].email,
        amount: 129.99,
        currency: 'USD',
        status: 'COMPLETED',
        couponCode: 'WELCOME20',
      },
      {
        userId: users[3].email,
        amount: 129.99,
        currency: 'USD',
        status: 'COMPLETED',
        couponCode: null,
      },
      {
        userId: users[4].email,
        amount: 99.99,
        currency: 'USD',
        status: 'COMPLETED',
        couponCode: 'FLASH50',
      },
      {
        userId: users[4].email,
        amount: 79.99,
        currency: 'USD',
        status: 'COMPLETED',
        couponCode: null,
      },
    ];

    for (const payment of payments) {
      const user = await prisma.user.findUnique({
        where: { email: payment.userId },
      });
      
      let coupon = null;
      if (payment.couponCode) {
        coupon = await prisma.coupon.findUnique({
          where: { code: payment.couponCode },
        });
      }
      
      if (user) {
        await prisma.payment.create({
          data: {
            user: { connect: { id: user.id } },
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status as any,
            coupon: coupon ? { connect: { id: coupon.id } } : undefined,
          },
        });
      }
    }
    console.log(`${payments.length} payments created`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 