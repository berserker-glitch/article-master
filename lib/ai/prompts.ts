export function chaptersPrompt(args: {
  videoTitle?: string | null
  transcript: string
}) {
  return `You are a senior editor. Organize the following transcript into a clean chapter plan.

IMPORTANT: Do NOT cut or remove any content. Your job is to ORGANIZE the existing captions into logical chapters, not to summarize or condense them.

Rules:
- Output must match the requested JSON schema exactly.
- Create a clear title and 4-10 sections based on the natural flow of the content.
- Each section has a heading, a concise summary, and 3-8 keyPoints.
- The keyPoints should reflect the actual topics covered in that section of the transcript.
- Do not mention the words \"video\", \"YouTube\", \"transcript\", or that this is a conversion.
- Preserve all information - just organize it into logical sections.

Context title: ${args.videoTitle || "(unknown)"}

Transcript:
${args.transcript}`
}

export function writerPrompt(args: {
  videoTitle?: string | null
  chaptersJson: string
  transcript: string
}) {
  return `You are a professional technical/marketing writer.

Write a highly focused, SEO-optimized, professional long-form article in Markdown.

Hard rules:
- Do NOT mention you are summarizing a video or using a transcript.
- Do NOT mention YouTube.
- Write as if the content is an original article.
- Use clear headings and short paragraphs.
- Avoid excessive bullet points and numbered lists. Use lists only when truly helpful:
  - Key takeaways: max 5 bullets total.
  - If you must include a checklist: max 5 items, and keep it rare.
- Prefer specificity, avoid fluff and repetition.
- Minimum length: 1500 words. Target 1800-2200 words when possible.
- Include:
  - A strong H1 title
  - A 1-paragraph intro that matches search intent
  - A short "Key takeaways" bullet list (max 5 bullets)
  - A table of contents as plain lines (no bullets/numbers)
  - Multiple H2 sections with practical details and examples (avoid lists unless necessary)
  - A short FAQ (5-8 questions) using H3 question headings (no bullet/number lists)
  - A conclusion with next steps
- At the very top, include an HTML comment with:
  - SEO Title (<= 60 chars)
  - Meta Description (<= 155 chars)
  - Primary Keyword
  - 5-10 Secondary Keywords

Use these chapters as the outline:
${args.chaptersJson}

Source content (for facts and details):
${args.transcript}

Optional title context: ${args.videoTitle || "(unknown)"}`
}

export function critiquePrompt(args: { draftMarkdown: string }) {
  return `You are a senior editor.

Analyze the article below and produce a detailed critique.

Rules:
- Output must match the requested JSON schema exactly.
- Provide concrete, actionable fixes.
- Focus on clarity, structure, SEO, and professionalism.

Article:
${args.draftMarkdown}`
}

export function rewritePrompt(args: { draftMarkdown: string; critiqueJson: string }) {
  return `You are a professional writer.

Rewrite the article below according to the critique.

Rules:
- Output ONLY the rewritten article in Markdown.
- Do NOT mention the critique.
- Do NOT mention YouTube/video/transcript.
- Implement fixes faithfully.
- Ensure the final article is SEO-first and long-form (minimum 1500 words).
- Reduce bullet points/numbered lists (keep only minimal, high-value lists).
- Preserve or improve the SEO HTML comment block (SEO Title, Meta Description, Primary/Secondary keywords).

Critique:
${args.critiqueJson}

Draft:
${args.draftMarkdown}`
}

export function expandPrompt(args: { articleMarkdown: string; transcript: string }) {
  return `You are a professional editor and SEO writer.

Expand and improve the article below so it becomes a complete long-form, SEO-optimized piece.

Rules:
- Output ONLY the updated article in Markdown.
- Minimum length: 1500 words (target 1800-2400).
- Do NOT mention YouTube/video/transcript.
- Keep the topic tightly focused (no filler).
- Add depth by expanding explanations, adding examples, and adding a few more relevant subsections.
- Avoid excessive bullet points and numbered lists.
- Ensure the article contains: Key takeaways, table of contents, FAQ (5-8 questions), and a conclusion.
- Keep or improve the SEO HTML comment block at the top.

Use this source content for facts and details:
${args.transcript}

Current article:
${args.articleMarkdown}`
}

