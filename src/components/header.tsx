"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { UserNav } from "./user-nav";
import { ThemeSwitch } from "./theme-switch";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";

type HeaderProps = {
  userRole: 'ngo' | 'buyer';
}

export function Header({ userRole }: HeaderProps) {
  const { signOut } = useAuth();
  const isNgo = userRole === 'ngo';
  const dashboardLink = isNgo ? "/ngo-dashboard" : "/buyer-dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold font-headline sm:inline-block">
              Carbon Capture
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href={dashboardLink}
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Dashboard
            </Link>
            {isNgo ? (
               <Link
                href="/new-project"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
               >
                 New Project
               </Link>
            ) : (
              <>
                <Link
                  href="/project-registry"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Project Registry
                </Link>
                 <Link
                  href="/my-credits"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  My Credits
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeSwitch />
          <UserNav userRole={userRole} />
        </div>
      </div>
    </header>
  );
}
