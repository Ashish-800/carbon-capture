
"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      aria-label="Go to home page"
      className="mr-2"
    >
      <Link href="/">
        <Home className="h-5 w-5" />
      </Link>
    </Button>
  );
}
