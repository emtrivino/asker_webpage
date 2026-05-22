---
name: asker-webpage
description: Use this skill when editing, designing, refactoring, or polishing the Asker website, including homepage updates, concert pages, orchestra content, static site layout, responsive styling, visual design, accessibility, SEO metadata, and frontend code quality.
---

# Goal

Improve and maintain the Asker website as a polished, production-ready public website with strong visual quality, clear content structure, responsive layouts, accessible markup, and clean maintainable frontend code.

This skill is designed for work on the Asker website, including pages for concerts, orchestra information, event details, design updates, layout improvements, mobile responsiveness, visual polish, and static website maintenance.

# Design Direction

Use a refined, modern Nordic editorial aesthetic:

- Clean but not generic.
- Elegant spacing and strong hierarchy.
- Calm visual rhythm with carefully chosen accents.
- Professional enough for a cultural/orchestra website.
- Warm, human, and inviting for visitors looking for concerts, events, or organization information.
- Avoid generic AI-looking design.

Do not default to overused design patterns such as purple gradients, generic SaaS cards, random glassmorphism, excessive shadows, or template-like layouts that do not fit the Asker/orchestra context.

# Instructions

When working on the site:

1. First inspect the existing project structure.
   - Identify whether the site is plain HTML/CSS/JS, React, Astro, Vite, Next.js, or another framework.
   - Check existing naming conventions, folders, assets, components, styling files, and build scripts.
   - Preserve the existing architecture unless the user explicitly asks for a larger refactor.

2. Preserve content accuracy.
   - Do not invent concert dates, venues, musicians, prices, links, or organization details.
   - Keep existing Norwegian, English, Spanish, or local-language content intact unless the user asks for copy changes.
   - If content is missing or ambiguous, leave clear placeholders or comments instead of fabricating details.

3. Improve semantic structure.
   - Use proper HTML landmarks: header, nav, main, section, article, footer.
   - Use heading levels in logical order.
   - Make concert/event cards readable and scannable.
   - Keep navigation simple and predictable.
   - Use descriptive links and buttons.

4. Apply high-quality frontend design.
   - Use CSS variables for colors, spacing, typography, borders, and transitions.
   - Use Grid and Flexbox intentionally.
   - Create strong hierarchy through spacing, type scale, contrast, and layout.
   - Add visual polish through subtle details: borders, rhythm, section contrast, refined hover states, and tasteful background treatments.
   - Use animation sparingly and purposefully.
   - Avoid unnecessary dependencies.

5. Make the site responsive.
   - Design mobile-first.
   - Test common widths: mobile, tablet, laptop, and desktop.
   - Ensure navigation, hero sections, concert listings, images, videos, and buttons work well on small screens.
   - Avoid fixed widths that break layout.
   - Prefer fluid spacing and typography using clamp(), min(), max(), minmax(), and responsive grid patterns.

6. Prioritize accessibility.
   - Use meaningful alt text for images.
   - Ensure sufficient color contrast.
   - Keep focus states visible.
   - Make buttons and links keyboard-accessible.
   - Respect reduced motion preferences with prefers-reduced-motion.
   - Do not use clickable divs when buttons or links are appropriate.
   - Ensure forms, if present, have labels, validation messages, and accessible states.

7. Optimize performance.
   - Keep CSS and JavaScript lean.
   - Avoid large libraries unless already used by the project.
   - Optimize image usage and avoid layout shift.
   - Do not add unused assets, unused components, or unnecessary packages.
   - Prefer native browser capabilities when they are enough.

8. Improve SEO and sharing where relevant.
   - Keep page titles descriptive.
   - Use meta descriptions where the framework/project supports them.
   - Use meaningful link text.
   - Structure event/concert information clearly.
   - Keep URLs and navigation understandable.
   - Add or preserve Open Graph metadata if the project already uses it.

9. Maintain code quality.
   - Make focused, minimal changes.
   - Reuse existing components or patterns when possible.
   - Remove dead code only when clearly safe.
   - Keep naming readable and consistent.
   - Prefer simple, maintainable solutions over clever abstractions.
   - Do not rewrite the whole site when a focused improvement is enough.

10. Verify before finishing.
   - Run the relevant build, lint, format, or test command if available.
   - Check for broken links, console errors, obvious layout regressions, and accessibility issues.
   - Summarize what changed and mention any assumptions.
   - Mention any command that could not be run and why.

# Input

The user may ask for:

- Updating the homepage design.
- Adding or editing concert details.
- Improving responsive layout.
- Making the site look more modern.
- Refactoring HTML, CSS, JavaScript, or components.
- Fixing layout bugs.
- Improving navigation.
- Adding images, videos, or event sections.
- Polishing typography, spacing, colors, or animations.
- Preparing the site for GitHub Pages or static deployment.
- Improving accessibility, SEO, or performance.
- Cleaning up old code.

# Output

Produce working code changes appropriate to the existing stack.

Depending on the task, output may include:

- Updated HTML, CSS, JavaScript, React, or framework-specific components.
- Improved page layouts.
- Responsive styling.
- Accessible navigation and content sections.
- Concert/event cards or listings.
- SEO metadata updates.
- Refactored components.
- Bug fixes.
- Performance improvements.
- A concise final summary of changed files, tests run, and remaining notes.

# Best Practices

- Prefer semantic HTML and accessible components.
- Prefer CSS variables for consistent design tokens.
- Prefer responsive layouts using Grid, Flexbox, clamp(), minmax(), and fluid spacing.
- Keep JavaScript minimal unless interactivity is required.
- Respect the project’s current style and tooling.
- Preserve existing deployment setup.
- Do not introduce new dependencies unless there is a clear benefit.
- Do not remove existing content without user approval.
- Do not invent factual information.
- Do not commit secrets, API keys, credentials, or private data.
- Keep the website stable, readable, fast, and easy to maintain.

# Visual Quality Checklist

Before finalizing, make sure the result feels:

- Clear
- Elegant
- Responsive
- Culturally appropriate for an orchestra or public-facing Asker website
- Visually intentional
- Not generic
- Easy to maintain
- Fast to load
- Accessible to visitors

# Things To Avoid

Avoid:

- Generic AI-looking layouts.
- Purple gradient SaaS-style designs unless explicitly requested.
- Random glassmorphism.
- Overly complex animations.
- Unnecessary packages.
- Breaking existing content.
- Replacing working architecture without a clear reason.
- Inventing concert or organization information.
- Hiding important content behind decorative effects.
- Making the site harder to maintain.
