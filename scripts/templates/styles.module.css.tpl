/* __NAME__ design: starter styles. Replace with the real look (see docs/DESIGNS.md for the conventions). */

.page {
  --bg: #121212;
  --ink: #f5f5f5;
  --muted: #b4b4b4;
  --accent: #6ea8ff;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-inter), system-ui, sans-serif;
  line-height: 1.65;
}

/* Stops the site's dark default from flashing during overscroll when this design is light */
:global(html:has([data-design="__SLUG__"])) {
  background: #121212;
}

.wrap {
  max-width: 52rem;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
}

.wrap section {
  margin-top: 4rem;
}

/* Zero specificity, so a class like .button can set its own colour */
.page :where(a) {
  color: var(--accent);
  /* Links inside running text must differ by more than colour (WCAG 1.4.1) */
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.page a:focus-visible,
.page button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.page :where(h1, h2, h3) {
  margin: 0 0 0.5rem;
  line-height: 1.15;
}

.page h1 {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 300;
}

.muted {
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.button {
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin-top: 1.5rem;
  text-transform: capitalize;
}
