## Inspiration

Legal documents are everywhere—sign-ups, subscriptions, returns, and job apps—but most people don’t read them because they’re dense and confusing. Our team has all clicked “I agree” without fully understanding what we were signing. We wanted to build something that turns intimidating ToS jargon into clear, plain language and helps users quickly look up unfamiliar terms. The goal: make it realistic for anyone to understand what they’re agreeing to—fast.

## What it does

This web app simplifies Terms of Service (or any pasted/uploaded text) into plain, readable English and lets users look up tricky words on the spot.

Upload or paste: Users can upload a .txt file or paste text directly.

Simplify: The app rewrites long, legal-ish sentences into shorter, clearer ones while preserving the original meaning.

Highlight & define: Unfamiliar words are highlighted; clicking a word opens an inline definition with examples and synonyms.

Reading aids: Estimated reading level, key bullets (“What you’re agreeing to”), and quick flags (e.g., data sharing, auto-renewal) help users spot the important stuff.

## How we built it

Frontend stack: React + Vite for a fast dev experience, TailwindCSS for utility-first styling, and plain JavaScript for app logic.

Text pipeline:

Input normalization (strip weird spacing, convert smart quotes, handle long lines).

Sentence chunking and readability heuristics (split long sentences, simplify passive voice where possible).

Phrase bank for common legal patterns (e.g., “notwithstanding,” “herein,” “shall,” “arising from”) mapped to plain-English equivalents with examples.

Optional synonym substitution with a small safeguard layer so we don’t alter legal meaning (e.g., avoiding replacements inside dates, numbers, or named entities).

Word lookup: Inline panel that shows definition, part of speech, and example usage; results are cached client-side for snappy repeats.

UI/UX:

Drag-and-drop + file picker for .txt.

Two-pane layout: original text on the left, simplified on the right, with synchronized scrolling.

Click-to-highlight terms; keyboard shortcuts for power users.

Tailwind components for consistent spacing, contrast, and mobile responsiveness.

Performance:

Streaming the simplification in chunks for large pastes.

Debounced lookups and memoized renders to keep the UI smooth.

Dev experience:

Vite for hot-reload and small bundles.

ESLint/Prettier for consistent code.

Environment-based config so the lookup service endpoint can be swapped (local vs. hosted) without code changes.

## Challenges we ran into

Preserving meaning while simplifying: It’s easy to make text shorter; it’s hard to keep the legal intent intact. We added rules to avoid rewriting dates, amounts, or defined terms and to keep “must/shall/may” distinctions.

Very long documents: Long ToS walls can freeze the UI if processed all at once. We moved to chunked processing and virtualization so rendering stays responsive.

Ambiguous terms: Some legal phrases depend on context (“material,” “reasonable,” “including but not limited to”). We chose to explain them rather than “replace” them.

File handling quirks: Uploaded .txt files come with odd encodings and invisible characters. We built a normalization step to clean those before parsing.

Build/config bumps: Vite + Tailwind are fast, but we had to tune PostCSS/Tailwind purge and ensure imports stayed ESM-friendly.

## Future plans

More file types: Add PDF/Docx support with server-side extraction for better fidelity.

Deeper flags: Auto-detect sections like arbitration, data sharing, auto-renewal, and cancellation windows—then surface them as quick alerts.

Reading levels: Toggle output (e.g., 6th-grade, 9th-grade, or “concise pro” mode).

Multilingual support: Simplify in Spanish and other languages while keeping the original legal text side-by-side.

Export & share: Download simplified reports as PDF/Markdown with highlighted terms and a glossary.

Personal glossary: Let users save tricky terms and see them auto-explained in future documents.

Privacy guardrails: On-device processing by default, with optional cloud for heavy documents—plus a “no-store” mode.

## Language & Tools

Frameworks: React, Vite

Styling: TailwindCSS

Language: JavaScript (ES modules)

Build/Dev: ESLint, Prettier

Architecture: Client-first processing with optional API endpoint for dictionary/definitions and large-document handling
