import type { MouseEvent } from "react";

export const RESUME_URL = "/resume.pdf";
export const RESUME_FILENAME = "Syed_Mohammed_Sultan_Resume.pdf";
export const OPEN_RESUME_EVENT = "portfolio:open-resume";

/** Opens the built-in resume reader (see ResumeViewer). */
export function openResume() {
  window.dispatchEvent(new Event(OPEN_RESUME_EVENT));
}

/**
 * onClick for links that point at the resume PDF. A plain click opens the in-page reader;
 * modified clicks (new tab, download, etc.) and no-JS visitors still get the raw PDF.
 */
export function handleResumeClick(e: MouseEvent<HTMLElement>) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openResume();
}
