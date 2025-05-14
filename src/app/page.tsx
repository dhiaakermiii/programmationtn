import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Unlock Your Potential with Online Learning
              </h1>
              <p className="text-xl text-muted-foreground">
                Access high-quality courses taught by industry experts and take your skills to the next level.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/courses">
                  <Button size="lg">Browse Courses</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" size="lg">
                    Sign Up for Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-8 shadow-lg">
                <div className="aspect-video w-full rounded-md bg-card"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose Our Platform
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
              We offer a complete solution for students and professionals looking to enhance their skills
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Expert-Led Courses</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals with years of real-world experience
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Learn at Your Pace</h3>
              <p className="text-muted-foreground">
                Access course content anytime and learn at your own convenience
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Vibrant Community</h3>
              <p className="text-muted-foreground">
                Join a community of learners and share your experiences and knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-lg bg-primary/5 p-8 md:p-12">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Start Learning?
              </h2>
              <p className="mx-auto mt-4 max-w-[600px] text-lg text-muted-foreground">
                Join thousands of students who are already taking advantage of our platform to improve their skills.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/courses">
                  <Button size="lg">Explore Courses</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
