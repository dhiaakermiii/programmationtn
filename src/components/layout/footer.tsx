import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background py-8">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">E-Learning Platform</h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive learning platform for acquiring modern skills.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/blog" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="block py-2 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary" style={{ minHeight: 44 }}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} E-Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 