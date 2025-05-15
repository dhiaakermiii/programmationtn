"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);

  // Nav links for reuse in desktop and mobile
  const navLinks = (
    <>
      <Link
        href="/courses"
        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary ${
          pathname === "/courses" ? "text-foreground font-semibold" : "text-muted-foreground"
        }`}
        style={{ minHeight: 44 }}
      >
        Courses
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary ${
            pathname.startsWith("/admin") ? "text-foreground font-semibold" : "text-muted-foreground"
          }`}
          style={{ minHeight: 44 }}
        >
          Admin
        </Link>
      )}
      {isLoggedIn && (
        <Link
          href="/dashboard"
          className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary ${
            pathname === "/dashboard" ? "text-foreground font-semibold" : "text-muted-foreground"
          }`}
          style={{ minHeight: 44 }}
        >
          Dashboard
        </Link>
      )}
    </>
  );

  // Auth buttons for reuse
  const authButtons = isLoggedIn ? (
    <>
      <Link href="/profile" className="flex items-center gap-2">
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-muted"
          />
        ) : (
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-xl text-muted-foreground border border-muted">👤</span>
        )}
        <Button variant="ghost" className="h-11 min-w-[44px] px-4">Account</Button>
      </Link>
      <Button variant="outline" className="h-11 min-w-[44px] px-4" onClick={() => signOut()}>
        Logout
      </Button>
    </>
  ) : (
    <>
      <Link href="/auth/login">
        <Button variant="ghost" className="h-11 min-w-[44px] px-4">Login</Button>
      </Link>
      <Link href="/auth/register">
        <Button className="h-11 min-w-[44px] px-4">Register</Button>
      </Link>
    </>
  );

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          E-Learning
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden h-11 w-11 flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">{navLinks}</nav>
        <div className="hidden sm:flex items-center gap-2">{authButtons}</div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden bg-background border-t">
          <div className="flex flex-col gap-2 p-4">
            {navLinks}
            <div className="flex flex-col gap-2 mt-2">{authButtons}</div>
          </div>
        </nav>
      )}
    </header>
  );
} 