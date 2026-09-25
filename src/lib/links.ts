import type { MouseEvent } from "react";
import type { Repo } from "@/lib/github";

export const OPEN_LINK_EVENT = "portfolio:open-link";

export interface LinkInfo {
  url: string;
  title?: string;
  description?: string;
  /** Repo details for the preview card (looked up from the build snapshot when omitted). */
  repo?: Repo;
  /** Open straight in the embedded browser. Only for sites known to allow framing (own demos). */
  embed?: boolean;
}

/** Opens the in-page link viewer (see LinkViewer). */
export function openLink(info: LinkInfo) {
  window.dispatchEvent(new CustomEvent<LinkInfo>(OPEN_LINK_EVENT, { detail: info }));
}

/**
 * onClick for external links. A plain click opens the in-page viewer; modified clicks
 * (new tab, download, …) and no-JS visitors still get the normal link.
 */
export function linkHandler(info: LinkInfo) {
  return (e: MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openLink(info);
  };
}
