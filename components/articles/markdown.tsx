"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"

function stripLeadingHtmlComment(input: string) {
  // Removes a leading `<!-- ... -->` block (used for SEO metadata) so the UI doesn't show it.
  const trimmed = input.trimStart()
  if (!trimmed.startsWith("<!--")) return input
  const endIdx = trimmed.indexOf("-->")
  if (endIdx < 0) return input
  return trimmed.slice(endIdx + 3).trimStart()
}

export function Markdown(props: { value: string }) {
  const value = React.useMemo(() => stripLeadingHtmlComment(props.value), [props.value])

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-h2:mt-10 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2 prose-p:my-3 prose-li:my-1">
      <ReactMarkdown
        components={{
          h1: ({ children, ...rest }) => (
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" {...rest}>
              {children}
            </h1>
          ),
          h2: ({ children, ...rest }) => (
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight" {...rest}>
              {children}
            </h2>
          ),
          h3: ({ children, ...rest }) => (
            <h3 className="text-base md:text-lg font-semibold tracking-tight" {...rest}>
              {children}
            </h3>
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  )
}

