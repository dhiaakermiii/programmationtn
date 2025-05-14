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
      <div className="container py-10">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Welcome Card */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Welcome back, {session.user.name || "User"}</CardTitle>
              <CardDescription>
                Here's an overview of your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your last login was on {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Courses you're enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Your overall learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">Free</p>
              <p className="text-sm text-muted-foreground">Upgrade for full access</p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
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