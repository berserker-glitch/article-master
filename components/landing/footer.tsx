import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-2">
            <div className="font-semibold tracking-tight">ArticleAlchemist</div>
            <p className="text-sm text-muted-foreground max-w-md">
              SEO-friendly AI blog generator that converts YouTube videos to optimized blog articles. Our AI transcriber and SEO blog AI tool transforms video transcripts into long-form, keyword-optimized content perfect for search engines.
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
              <Link className="text-muted-foreground hover:text-foreground" href="/terms">
                Terms of Service
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/refund-policy">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} ArticleAlchemist by Scolink. All rights reserved.</div>
          <div>SEO-friendly YouTube to blog converter powered by AI.</div>
        </div>
      </div>
    </footer>
  )
}
