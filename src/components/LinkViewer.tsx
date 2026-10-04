"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Globe, Lock, RotateCw, Star, X } from "lucide-react";
import snapshot from "@/data/repos.json";
import { parseRepos, safeHomepage, type Repo } from "@/lib/github";
import { OPEN_LINK_EVENT, type LinkInfo } from "@/lib/links";
import ViewerFrame from "./viewer/ViewerFrame";

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

  const browsing = mode === "browser" && demoUrl && parseWebUrl(demoUrl);
  const shownUrl = browsing ? parseWebUrl(demoUrl!)! : url;
  const externalHref = (browsing ? demoUrl : info.url) ?? info.url;

  const reload = () => {
    setFrameLoaded(false);
    setFrameKey((k) => k + 1);
  };

  const toolbar =
    browsing && shownUrl ? (
      <div className="vw-toolbar" role="toolbar" aria-label="Browser controls">
        <div className="vw-group">
          {cardAvailable && (
            <button type="button" aria-label="Back to preview" className="vw-btn" onClick={() => setMode("card")}>
              <ArrowLeft aria-hidden className="vw-icon" />
            </button>
          )}
          <button type="button" aria-label="Reload page" className="vw-btn" onClick={reload}>
            <RotateCw aria-hidden className="vw-icon" />
          </button>
        </div>
        <div className="vw-address">
          {shownUrl.protocol === "https:" ? (
            <Lock aria-label="Secure connection" className="vw-icon vw-icon-sm vw-lock" />
          ) : (
            <Globe aria-label="Not secure" className="vw-icon vw-icon-sm" />
          )}
          <span className="vw-address-text" title={shownUrl.href}>
            {shownUrl.host}
            <span className="vw-address-path">{shownUrl.pathname === "/" ? "" : shownUrl.pathname}</span>
          </span>
        </div>
        <div className="vw-group">
          <a href={externalHref} target="_blank" rel="noopener noreferrer" aria-label="Open in a new tab" className="vw-btn">
            <ExternalLink aria-hidden className="vw-icon" />
          </a>
          <button type="button" aria-label="Close browser" className="vw-btn" onClick={onClose}>
            <X aria-hidden className="vw-icon" />
          </button>
        </div>
      </div>
    ) : undefined;

  const status =
    browsing && shownUrl ? (
      <div className="vw-status">
        <span>
          Blank or an error? Some sites don&rsquo;t allow embedding.{" "}
          <a href={externalHref} target="_blank" rel="noopener noreferrer">
            Open in a new tab
          </a>
          .
        </span>
      </div>
    ) : undefined;

  return (
    <ViewerFrame
      kind={browsing ? "browser" : "card"}
      marker="link"
      label={browsing ? `Browser: ${shownUrl?.hostname}` : "Link preview"}
      onClose={onClose}
      tabIcon={<Globe aria-hidden className="vw-icon vw-icon-sm" />}
      tabTitle={shownUrl ? hostLabel(shownUrl.host) : "Link"}
      toolbar={toolbar}
      status={status}
    >
      {browsing && shownUrl ? (
        <div className="vw-page">
          {!frameLoaded && (
            <div role="status" className="vw-state">
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
          />
        </div>
      ) : (
        <div className="vw-card" data-vw-scroll>
          <div className="vw-card-head">
            <p className="vw-eyebrow">
              <Globe aria-hidden className="vw-icon" />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{repo ? "Repository" : "Link preview"}</span>
            </p>
            <button type="button" aria-label="Close preview" className="vw-btn" onClick={onClose}>
              <X aria-hidden className="vw-icon" />
            </button>
          </div>

          <h2 translate="no" className="vw-card-title">
            {repo?.name ?? info.title ?? url?.host ?? info.url}
          </h2>
          {(repo?.description ?? info.description) && <p className="vw-card-text">{repo?.description ?? info.description}</p>}

          {repo && repo.topics.length > 0 && (
            <ul aria-label="Topics" className="vw-chips">
              {repo.topics.slice(0, MAX_TOPICS).map((t) => (
                <li key={t} className="vw-chip">
                  {t}
                </li>
              ))}
            </ul>
          )}

          {repo && (
            <div className="vw-meta">
              {repo.language && (
                <span>
                  <span aria-hidden className="vw-lang" />
                  {repo.language}
                </span>
              )}
              <span>
                <Star aria-hidden className="vw-icon vw-icon-sm" />
                <span aria-hidden style={{ fontVariantNumeric: "tabular-nums" }}>{repo.stargazers_count}</span>
                <span className="sr-only">{repo.stargazers_count} {repo.stargazers_count === 1 ? "star" : "stars"}</span>
              </span>
              <span>Updated {formatPushed(repo.pushed_at)}</span>
            </div>
          )}

          <div className="vw-actions">
            <a href={info.url} target="_blank" rel="noopener noreferrer" className="vw-btn vw-btn--label vw-btn--large vw-btn--solid">
              Open on {url ? hostLabel(url.host) : "the web"}
              <ExternalLink aria-hidden className="vw-icon vw-icon-sm" />
            </a>
            {demoUrl && (
              <button
                type="button"
                onClick={() => {
                  setFrameLoaded(false);
                  setMode("browser");
                }}
                className="vw-btn vw-btn--label vw-btn--large vw-btn--primary"
              >
                <Globe aria-hidden className="vw-icon vw-icon-sm" />
                Live demo
              </button>
            )}
          </div>
          {url && blocksFraming(url.host) && (
            <p className="vw-note">
              {hostLabel(url.host)}{" "}opens in a new tab; it doesn&rsquo;t allow being shown inside other pages.
            </p>
          )}
        </div>
      )}
    </ViewerFrame>
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
