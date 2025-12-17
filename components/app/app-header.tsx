"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { IconArticle, IconLayoutDashboard, IconSettings, IconShield, IconCreditCard, IconSparkles } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NavLink } from "@/components/app/nav-link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppHeader(props: { username: string; role: "USER" | "SUPERADMIN"; plan?: "FREE" | "PRO" | "PREMIUM" }) {
  const pathname = usePathname()
  const router = useRouter()
  const isSettingsActive = pathname?.startsWith("/settings")

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            ArticleMaster
          </Link>
          <Separator orientation="vertical" className="h-5 hidden sm:block" />
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <NavLink href="/dashboard" exact>
              <span className="inline-flex items-center gap-2">
                <IconLayoutDashboard className="h-4 w-4" />
                Dashboard
              </span>
            </NavLink>
            <NavLink href="/articles">
              <span className="inline-flex items-center gap-2">
                <IconArticle className="h-4 w-4" />
                Articles
              </span>
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isSettingsActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
              <span className="inline-flex items-center gap-2">
                  <IconSettings className="h-4 w-4" />
                  Settings
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => router.push("/settings/billing")} className="flex items-center gap-2">
                  <IconCreditCard className="h-4 w-4" />
                  Plans & Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings/wordpress")} className="flex items-center gap-2">
                <IconSettings className="h-4 w-4" />
                WordPress
                </DropdownMenuItem>
                {props.plan === "PREMIUM" && (
                  <DropdownMenuItem onClick={() => router.push("/settings/generation")} className="flex items-center gap-2">
                    <IconSparkles className="h-4 w-4" />
                    Generation preferences
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {props.role === "SUPERADMIN" && (
              <NavLink href="/admin/users">
                <span className="inline-flex items-center gap-2">
                  <IconShield className="h-4 w-4" />
                  Admin
              </span>
            </NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm text-muted-foreground">@{props.username}</div>
          <form action="/logout" method="post">
            <Button type="submit" variant="secondary" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

