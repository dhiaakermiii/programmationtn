import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4 sm:px-6">
        <h1 className="mb-6 text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        {/* Responsive grid: 1 col on mobile, 3 cols on md+ */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Welcome Card */}
          <Card className="col-span-1 md:col-span-3 focus-within:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-2xl font-semibold">Welcome back, {session.user.name || "User"}</CardTitle>
              <CardDescription>
                Here&apos;s an overview of your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">Your last login was on {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="focus-within:shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-semibold">My Courses</CardTitle>
              <CardDescription>Courses you&apos;re enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card className="focus-within:shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Progress</CardTitle>
              <CardDescription>Your overall learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0%</p>
            </CardContent>
          </Card>

          <Card className="focus-within:shadow-lg">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Subscription</CardTitle>
              <CardDescription>Your current subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">Free</p>
              <p className="text-sm text-muted-foreground">Upgrade for full access</p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-1 md:col-span-3 focus-within:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4 text-center text-muted-foreground">
                No recent activity. Start learning today!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 