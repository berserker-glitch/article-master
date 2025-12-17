import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight" aria-label="ArticleAlchemist - SEO-Friendly AI Blog Generator">
            ArticleAlchemist
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="#features">
              Features
            </a>
            <a className="hover:text-foreground transition-colors" href="#how-it-works">
              How it works
            </a>
            <a className="hover:text-foreground transition-colors" href="#output">
              Output
            </a>
            <a className="hover:text-foreground transition-colors" href="#pricing">
              Pricing
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link className={cn(buttonVariants({ variant: "ghost" }))} href="/login">
            Sign in
          </Link>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

