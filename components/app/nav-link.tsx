"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function NavLink(props: {
  href: string
  children: React.ReactNode
  className?: string
  exact?: boolean
}) {
  const pathname = usePathname()
  const isActive = props.exact ? pathname === props.href : pathname?.startsWith(props.href)

  return (
    <Link
      href={props.href}
      className={cn(
        "px-3 py-1.5 rounded-md transition-colors",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        props.className
      )}
    >
      {props.children}
    </Link>
  )
}

