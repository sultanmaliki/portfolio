"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Download, ExternalLink, FileText, X, ZoomIn, ZoomOut } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { linkHandler } from "@/lib/links";
import { OPEN_RESUME_EVENT, RESUME_FILENAME, RESUME_URL } from "@/lib/resume";
import ViewerFrame from "./viewer/ViewerFrame";

type PdfJs = typeof import("pdfjs-dist");
type Loaded = { pdfjs: PdfJs; doc: PDFDocumentProxy };

const ZOOMS = [0.75, 1, 1.25, 1.5, 2];
const MAX_PAGE_WIDTH = 860;

// pdf.js is heavy, so it is only fetched the first time the resume is opened (or hovered).
let loading: Promise<Loaded> | null = null;
function loadPdf(): Promise<Loaded> {
  if (!loading) {
    loading = import("pdfjs-dist").then(async (pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const doc = await pdfjs.getDocument({ url: RESUME_URL }).promise;
      return { pdfjs, doc };
    });
    loading.catch(() => {
      loading = null; // allow a retry
    });
  }
  return loading;
}

type LinkBox = { url: string; left: number; top: number; width: number; height: number };

function PdfPage({ loaded, pageNumber, width }: { loaded: Loaded; pageNumber: number; width: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [links, setLinks] = useState<LinkBox[]>([]);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<unknown> } | undefined;
    let textLayer: { cancel: () => void } | undefined;

    (async () => {
      const page = await loaded.doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
      const canvas = canvasRef.current;
      const textEl = textRef.current;
      if (cancelled || !canvas || !textEl) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      setHeight(viewport.height);

      renderTask = page.render({
        canvas,
        viewport,
        transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
      });
      await renderTask.promise;
      if (cancelled) return;

      // Selectable text on top of the canvas
      textEl.replaceChildren();
      textEl.style.setProperty("--total-scale-factor", String(viewport.scale));
      const layer = new loaded.pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: textEl, viewport });
      textLayer = layer;
      await layer.render();

      // Clickable links (email, LinkedIn, GitHub, …) from the PDF's own annotations
      const annotations = (await page.getAnnotations({ intent: "display" })) as { subtype: string; url?: string; rect: number[] }[];
      if (cancelled) return;
      setLinks(
        annotations
          .filter((a) => a.subtype === "Link" && a.url && /^(https?:|mailto:)/i.test(a.url))
          .map((a) => {
            const [x1, y1] = viewport.convertToViewportPoint(a.rect[0], a.rect[1]);
            const [x2, y2] = viewport.convertToViewportPoint(a.rect[2], a.rect[3]);
            return { url: a.url as string, left: Math.min(x1, x2), top: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
          })
      );
    })().catch((err) => {
      // Superseded renders are cancelled on purpose; anything else is left to the canvas being blank.
      if (err?.name !== "RenderingCancelledException" && err?.name !== "AbortException") console.error(err);
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
      textLayer?.cancel();
    };
  }, [loaded, pageNumber, width]);

  return (
    <div
      className="vw-paper"
      style={{ width, height: height ?? Math.round(width * 1.414) }}
    >
      <canvas ref={canvasRef} aria-hidden style={{ width, height: height ?? undefined }} />
      <div ref={textRef} className="pdf-text-layer" />
      {links.map((l) => (
        <a
          key={`${l.left}-${l.top}`}
          href={l.url}
          target={l.url.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          onClick={l.url.startsWith("mailto:") ? undefined : linkHandler({ url: l.url })}
          aria-label={l.url.replace(/^mailto:/i, "")}
          className="vw-pdf-link"
          style={{ left: l.left, top: l.top, width: l.width, height: l.height }}
        />
      ))}
    </div>
  );
}

function ViewerDialog({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(1);
  const [available, setAvailable] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    loadPdf().then(
      (l) => !cancelled && setLoaded(l),
      () => !cancelled && setFailed(true)
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // Fit-to-width: follow the size of the scroll area (debounced so a window drag doesn't re-render every frame)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      const style = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      setAvailable((prev) => (Math.abs(prev - w) < 1 ? prev : Math.round(w)));
    };
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(measure, 120);
    });
    measure();
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const numPages = loaded?.doc.numPages ?? 0;
  const zoom = ZOOMS[zoomIndex];
  const pageWidth = Math.max(0, Math.round(Math.min(available, MAX_PAGE_WIDTH) * zoom));

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || numPages < 2) return;
    const page = Math.floor(((el.scrollTop + el.clientHeight / 2) / el.scrollHeight) * numPages) + 1;
    setCurrentPage(Math.min(numPages, Math.max(1, page)));
  }, [numPages]);

  const toolbar = (
    <div className="vw-toolbar" role="toolbar" aria-label="Resume controls">
      <div className="vw-doc">
        <FileText aria-hidden className="vw-icon vw-lock" />
        <span className="vw-doc-name">
          <span className="vw-show-sm">Resume</span>
          <span className="vw-hide-sm">{RESUME_FILENAME}</span>
        </span>
        {numPages > 1 && (
          <span className="vw-doc-pages">
            {currentPage} / {numPages}
          </span>
        )}
      </div>

      <div className="vw-group vw-zoom vw-hide-xs" role="group" aria-label="Zoom">
        <button type="button" aria-label="Zoom out" className="vw-btn" disabled={zoomIndex === 0} onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}>
          <ZoomOut aria-hidden className="vw-icon" />
        </button>
        <span className="vw-zoom-level" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" aria-label="Zoom in" className="vw-btn" disabled={zoomIndex === ZOOMS.length - 1} onClick={() => setZoomIndex((i) => Math.min(ZOOMS.length - 1, i + 1))}>
          <ZoomIn aria-hidden className="vw-icon" />
        </button>
      </div>

      <div className="vw-group">
        <a href={RESUME_URL} download={RESUME_FILENAME} aria-label="Download PDF" className="vw-btn vw-btn--label vw-btn--primary vw-btn--download">
          <Download aria-hidden className="vw-icon vw-icon-sm" />
          <span className="vw-hide-phone">
            Download<span className="vw-hide-sm"> PDF</span>
          </span>
        </a>
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" aria-label="Open PDF in a new tab" className="vw-btn vw-hide-sm">
          <ExternalLink aria-hidden className="vw-icon" />
        </a>
        <button type="button" aria-label="Close resume" className="vw-btn" onClick={onClose}>
          <X aria-hidden className="vw-icon" />
        </button>
      </div>
    </div>
  );

  const status = (
    <div className="vw-status">
      <span aria-hidden>{numPages ? `Page ${currentPage} of ${numPages}` : "Loading"}</span>
      <span className="vw-hide-sm">Text is selectable and links are clickable.</span>
    </div>
  );

  return (
    <ViewerFrame
      kind="pdf"
      marker="resume"
      label="Resume"
      onClose={onClose}
      tabIcon={<FileText aria-hidden className="vw-icon vw-icon-sm" />}
      tabTitle={RESUME_FILENAME}
      toolbar={toolbar}
      status={status}
      initialFocus={scrollRef}
    >
      <div ref={scrollRef} tabIndex={0} role="region" aria-label="Resume pages" data-vw-scroll onScroll={onScroll} className="vw-pages">
        {failed ? (
          <div role="alert" className="vw-empty">
            <p>The preview couldn&rsquo;t be loaded here. You can still read the resume directly.</p>
            <div className="vw-actions" style={{ justifyContent: "center" }}>
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="vw-btn vw-btn--label vw-btn--primary vw-btn--large">
                Open PDF
              </a>
              <a href={RESUME_URL} download={RESUME_FILENAME} className="vw-btn vw-btn--label vw-btn--large">
                Download
              </a>
            </div>
          </div>
        ) : !loaded || pageWidth === 0 ? (
          <p role="status" className="vw-empty">
            Loading resume&hellip;
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "max-content", margin: "0 auto" }}>
            {Array.from({ length: numPages }, (_, i) => (
              <PdfPage key={i} loaded={loaded} pageNumber={i + 1} width={pageWidth} />
            ))}
          </div>
        )}
      </div>
    </ViewerFrame>
  );
}

/**
 * Built-in PDF reader. Any link can open it with openResume() / handleResumeClick from
 * "@/lib/resume"; the event keeps the triggers (nav, contact) decoupled from this component.
 */
export default function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const show = () => setOpen(true);
    // Warm pdf.js up as soon as someone shows interest in the resume, so opening feels instant
    const warm = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(`a[href="${RESUME_URL}"]`)) loadPdf().catch(() => {});
    };
    window.addEventListener(OPEN_RESUME_EVENT, show);
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    return () => {
      window.removeEventListener(OPEN_RESUME_EVENT, show);
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
    };
  }, []);

  return <AnimatePresence>{open && <ViewerDialog key="resume" onClose={close} />}</AnimatePresence>;
}
