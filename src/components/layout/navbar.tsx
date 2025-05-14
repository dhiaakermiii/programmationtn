"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            E-Learning
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/courses"
              className={`text-sm transition-colors hover:text-primary ${
                pathname === "/courses" ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Courses
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm transition-colors hover:text-primary ${
                  pathname.startsWith("/admin") ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                Admin
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className={`text-sm transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/account">
                <Button variant="ghost">Account</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 