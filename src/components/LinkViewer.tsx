"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Globe, Lock, RotateCw, Star, X } from "lucide-react";
import snapshot from "@/data/repos.json";
import { parseRepos, safeHomepage, type Repo } from "@/lib/github";
import { OPEN_LINK_EVENT, type LinkInfo } from "@/lib/links";

const SNAPSHOT = parseRepos(snapshot) ?? [];
const MAX_TOPICS = 8;

const normalize = (url: string) => url.replace(/\/+$/, "").toLowerCase();
const findRepo = (url: string): Repo | undefined => SNAPSHOT.find((r) => normalize(r.html_url) === normalize(url));

// Only web links are ever shown; anything else falls back to a plain new-tab link.
function parseWebUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

// These two send X-Frame-Options / frame-ancestors headers, so an embedded view would just be an error box.
const blocksFraming = (host: string) => /(^|.)(github|linkedin).com$/.test(host);

const hostLabel = (host: string) => {
  const h = host.replace(/^www\./, "");
  if (h === "github.com") return "GitHub";
  if (h === "linkedin.com") return "LinkedIn";
  return h;
};

const formatPushed = (iso: string) => new Date(iso).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });

type Mode = "card" | "browser";

function ViewerDialog({ info, onClose }: { info: LinkInfo; onClose: () => void }) {
  const url = parseWebUrl(info.url);
  const repo = info.repo ?? findRepo(info.url);
  const repoDemo = safeHomepage(repo?.homepage ?? null);
  const embed = !!info.embed && !(url && blocksFraming(url.host));
  // Where the embedded browser points: the link itself for demos, or the repo's live site from a card.
  const demoUrl = embed ? info.url : repoDemo;
  const cardAvailable = !embed || !!repo;

  const [mode, setMode] = useState<Mode>(embed ? "browser" : "card");
  const [frameKey, setFrameKey] = useState(0);
  const [frameLoaded, setFrameLoaded] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe')
      ).filter((n) => n.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const keepPageStill = (e: Event) => {
      // Let the card scroll on small screens; block everything else from moving the page underneath
      if (!panelRef.current?.contains(e.target as Node)) e.preventDefault();
    };
    const overlay = overlayRef.current;
    window.addEventListener("keydown", onKeyDown);
    overlay?.addEventListener("wheel", keepPageStill, { passive: false });
    overlay?.addEventListener("touchmove", keepPageStill, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      overlay?.removeEventListener("wheel", keepPageStill);
      overlay?.removeEventListener("touchmove", keepPageStill);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true });
    };
  }, [onClose]);

  const iconButton =
    "grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#F5F5F5]/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30";

  const browsing = mode === "browser" && demoUrl && parseWebUrl(demoUrl);
  const shownUrl = browsing ? parseWebUrl(demoUrl!)! : url;
  const externalHref = (browsing ? demoUrl : info.url) ?? info.url;

  return (
    <motion.div
      ref={overlayRef}
      data-link-viewer
      role="dialog"
      aria-modal="true"
      aria-label={browsing ? `Browser: ${shownUrl?.hostname}` : "Link preview"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm ${browsing ? "sm:p-6" : "p-4"}`}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={
          browsing
            ? "flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-[#161616] shadow-2xl outline-none sm:h-[92dvh] sm:rounded-xl sm:border sm:border-white/10"
            : "flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl outline-none"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {browsing && shownUrl ? (
          <>
            {/* Browser toolbar */}
            <div className="flex h-12 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/5 px-2 sm:gap-2 sm:px-3">
              {cardAvailable && (
                <button type="button" aria-label="Back to preview" className={iconButton} onClick={() => setMode("card")}>
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                aria-label="Reload page"
                className={iconButton}
                onClick={() => {
                  setFrameLoaded(false);
                  setFrameKey((k) => k + 1);
                }}
              >
                <RotateCw aria-hidden className="h-4 w-4" />
              </button>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-[#F5F5F5]/80 sm:text-sm">
                {shownUrl.protocol === "https:" ? (
                  <Lock aria-label="Secure connection" className="h-3.5 w-3.5 shrink-0 text-[#6EA8FF]" />
                ) : (
                  <Globe aria-label="Not secure" className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate" title={shownUrl.href}>
                  {shownUrl.host}
                  <span className="text-[#F5F5F5]/60">{shownUrl.pathname === "/" ? "" : shownUrl.pathname}</span>
                </span>
              </div>
              <a href={externalHref} target="_blank" rel="noopener noreferrer" aria-label="Open in a new tab" className={iconButton}>
                <ExternalLink aria-hidden className="h-4 w-4" />
              </a>
              <button type="button" aria-label="Close browser" className={iconButton} onClick={onClose}>
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>

            {/* Page */}
            <div className="relative flex-1 bg-white">
              {!frameLoaded && (
                <div role="status" className="absolute inset-0 grid place-items-center bg-[#161616] text-sm font-light text-[#F5F5F5]/60">
                  Loading {shownUrl.host}&hellip;
                </div>
              )}
              <iframe
                key={frameKey}
                src={shownUrl.href}
                title={`${hostLabel(shownUrl.host)} (embedded)`}
                onLoad={() => setFrameLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            <p className="shrink-0 border-t border-white/10 bg-white/5 px-3 py-2 text-xs font-light text-[#F5F5F5]/60">
              Blank or an error? Some sites don&rsquo;t allow embedding.{" "}
              <a href={externalHref} target="_blank" rel="noopener noreferrer" className="text-[#6EA8FF] underline underline-offset-2">
                Open in a new tab
              </a>
              .
            </p>
          </>
        ) : (
          /* Preview card */
          <div className="overflow-y-auto overscroll-contain p-6 sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <p className="flex min-w-0 items-center gap-2 text-xs uppercase tracking-widest text-[#F5F5F5]/60">
                <Globe aria-hidden className="h-4 w-4 shrink-0 text-[#6EA8FF]" />
                <span className="truncate">{url ? hostLabel(url.host) : "Link"}</span>
              </p>
              <button type="button" aria-label="Close preview" className={`${iconButton} -mr-2 -mt-1.5`} onClick={onClose}>
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>

            <h2 translate="no" className="mb-3 break-words text-2xl font-semibold tracking-tight text-white">
              {repo?.name ?? info.title ?? url?.host ?? info.url}
            </h2>
            {(repo?.description ?? info.description) && (
              <p className="mb-5 font-light leading-relaxed text-[#F5F5F5]/70">{repo?.description ?? info.description}</p>
            )}

            {repo && repo.topics.length > 0 && (
              <ul aria-label="Topics" className="mb-5 flex list-none flex-wrap gap-2">
                {repo.topics.slice(0, MAX_TOPICS).map((t) => (
                  <li key={t} className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-[#F5F5F5]/80">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {repo && (
              <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#F5F5F5]/60">
                {repo.language && (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#6EA8FF]" />
                    {repo.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Star aria-hidden className="h-3.5 w-3.5" />
                  <span aria-hidden className="tabular-nums">{repo.stargazers_count}</span>
                  <span className="sr-only">{repo.stargazers_count} {repo.stargazers_count === 1 ? "star" : "stars"}</span>
                </span>
                <span>Updated {formatPushed(repo.pushed_at)}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5]"
              >
                Open on {url ? hostLabel(url.host) : "the web"}
                <ExternalLink aria-hidden className="h-4 w-4" />
              </a>
              {demoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setFrameLoaded(false);
                    setMode("browser");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#6EA8FF]/40 px-5 py-2.5 text-sm text-[#6EA8FF] transition-colors hover:bg-[#6EA8FF]/10"
                >
                  <Globe aria-hidden className="h-4 w-4" />
                  Live demo
                </button>
              )}
            </div>
            {url && blocksFraming(url.host) && (
              <p className="mt-5 text-xs font-light text-[#F5F5F5]/60">
                {hostLabel(url.host)}{" "}opens in a new tab; it doesn&rsquo;t allow being shown inside other pages.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * In-page link viewer: repo/profile links open a preview card, live demos open in an embedded
 * browser. GitHub and LinkedIn forbid framing, so they never go through the iframe.
 * Trigger it with linkHandler()/openLink() from "@/lib/links".
 */
export default function LinkViewer() {
  const [info, setInfo] = useState<{ id: number; link: LinkInfo } | null>(null);
  const close = useCallback(() => setInfo(null), []);

  useEffect(() => {
    let id = 0;
    const show = (e: Event) => {
      const link = (e as CustomEvent<LinkInfo>).detail;
      if (link?.url) setInfo({ id: ++id, link });
    };
    window.addEventListener(OPEN_LINK_EVENT, show);
    return () => window.removeEventListener(OPEN_LINK_EVENT, show);
  }, []);

  return <AnimatePresence>{info && <ViewerDialog key={info.id} info={info.link} onClose={close} />}</AnimatePresence>;
}
