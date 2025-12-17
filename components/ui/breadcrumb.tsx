import * as React from "react"
import Link from "next/link"

import { IconChevronRight, IconHome } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <IconHome className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <IconChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}