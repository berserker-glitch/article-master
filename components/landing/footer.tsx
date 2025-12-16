import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-2">
            <div className="font-semibold tracking-tight">ArticleMaster</div>
            <p className="text-sm text-muted-foreground max-w-md">
              Generate structured, SEO-focused long-form articles from YouTube—then publish to WordPress.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Product</div>
            <div className="grid gap-1 text-sm">
              <a className="text-muted-foreground hover:text-foreground" href="#features">
                Features
              </a>
              <a className="text-muted-foreground hover:text-foreground" href="#how-it-works">
                How it works
              </a>
              <a className="text-muted-foreground hover:text-foreground" href="#output">
                Output
              </a>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Account</div>
            <div className="grid gap-1 text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="/login">
                Sign in
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/signup">
                Get started
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} ArticleMaster</div>
          <div>Built for long-form SEO output.</div>
        </div>
      </div>
    </footer>
  )
}
