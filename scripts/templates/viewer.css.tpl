/* __NAME__ viewer (STARTER): how the built-in browser window and the PDF reader look inside this design.
 *
 * The behaviour is shared (src/components/viewer). This file only restyles it: set the --vw-* tokens, and add
 * rules for the parts you want to change beyond colour. The structure and the full token list are documented
 * at the top of src/components/viewer/viewer.css. Look at a finished design (for example swiss or glassmorphism)
 * to see how far a theme can go. Derive it from this design's own palette, type, borders, radii and shadows,
 * and keep text AA-contrast: e2e/viewers.spec.ts runs axe on every viewer state.
 *
 * Fonts: pass the design's next/font `variable` classes to <ViewerTheme fonts={...}> in index.tsx, then use them here
 * with var(--font-xxx).
 */
[data-viewer-theme="__SLUG__"] {
  --vw-scrim: rgba(250, 250, 252, 0.88);
  --vw-scrim-blur: 4px;
  --vw-bg: #ffffff;
  --vw-fg: #14161a;
  --vw-soft: #2d3138;
  --vw-muted: #555b66;
  --vw-accent: #1d4ed8;
  --vw-accent-fg: #ffffff;
  --vw-frame: 1px solid #d7dae0;
  --vw-radius: 0.625rem;
  --vw-shadow: 0 24px 60px -24px rgba(20, 22, 26, 0.45);
  --vw-title-display: flex;
  --vw-title-bg: #f1f3f6;
  --vw-title-fg: #2d3138;
  --vw-title-line: 1px solid #d7dae0;
  --vw-dot-1: #c9ced6;
  --vw-dot-2: #c9ced6;
  --vw-dot-3: #c9ced6;
  --vw-tab-fg: #2d3138;
  --vw-bar-bg: #f8f9fb;
  --vw-bar-fg: #2d3138;
  --vw-bar-line: 1px solid #d7dae0;
  --vw-btn-fg: #2d3138;
  --vw-btn-hover-bg: #e8ebf0;
  --vw-btn-hover-fg: #14161a;
  --vw-pri-fg: #1d4ed8;
  --vw-pri-hover-bg: #e6edff;
  --vw-solid-bg: #14161a;
  --vw-solid-fg: #ffffff;
  --vw-addr-bg: #ffffff;
  --vw-addr-fg: #14161a;
  --vw-addr-line: 1px solid #d7dae0;
  --vw-body-bg: #e9ecf1;
  --vw-paper-shadow: 0 6px 24px rgba(20, 22, 26, 0.18);
  --vw-chip-bg: #eef0f4;
  --vw-chip-fg: #2d3138;
  --vw-chip-line: 1px solid #d7dae0;
  --vw-status-bg: #f1f3f6;
  --vw-status-fg: #555b66;
  --vw-status-line: 1px solid #d7dae0;
  --vw-focus: #1d4ed8;
}
