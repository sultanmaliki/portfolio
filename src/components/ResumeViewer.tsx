"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, X, ZoomIn, ZoomOut } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { OPEN_RESUME_EVENT, RESUME_FILENAME, RESUME_URL } from "@/lib/resume";

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
      className="relative mx-auto bg-white shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      style={{ width, height: height ?? Math.round(width * 1.414) }}
    >
      <canvas ref={canvasRef} aria-hidden className="block" style={{ width, height: height ?? undefined }} />
      <div ref={textRef} className="pdf-text-layer" />
      {links.map((l) => (
        <a
          key={`${l.left}-${l.top}`}
          href={l.url}
          target={l.url.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={l.url.replace(/^mailto:/i, "")}
          className="absolute rounded-sm outline-offset-2 hover:bg-[#6EA8FF]/15"
          style={{ left: l.left, top: l.top, width: l.width, height: l.height }}
        />
      ))}
    </div>
  );
}

function ViewerDialog({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  // Focus handling, Esc to close, Tab kept inside the dialog, page behind not scrollable
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    scrollRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')
      ).filter((n) => n.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const keepPageStill = (e: Event) => {
      if (!scrollRef.current?.contains(e.target as Node)) e.preventDefault();
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

  const numPages = loaded?.doc.numPages ?? 0;
  const zoom = ZOOMS[zoomIndex];
  const pageWidth = Math.max(0, Math.round(Math.min(available, MAX_PAGE_WIDTH) * zoom));

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || numPages < 2) return;
    const page = Math.floor(((el.scrollTop + el.clientHeight / 2) / el.scrollHeight) * numPages) + 1;
    setCurrentPage(Math.min(numPages, Math.max(1, page)));
  }, [numPages]);

  const iconButton =
    "grid h-8 w-8 place-items-center rounded-md text-[#F5F5F5]/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <motion.div
      ref={overlayRef}
      data-resume-viewer
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex h-dvh w-full max-w-4xl flex-col overflow-hidden bg-[#161616] shadow-2xl sm:h-[92dvh] sm:rounded-xl sm:border sm:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 text-[#F5F5F5]/80">
            <FileText aria-hidden className="h-4 w-4 shrink-0 text-[#6EA8FF]" />
            <span className="truncate text-sm font-light">
              <span className="sm:hidden">Resume</span>
              <span className="hidden sm:inline">{RESUME_FILENAME}</span>
            </span>
            {numPages > 1 && (
              <span className="shrink-0 text-xs tabular-nums text-[#F5F5F5]/60">
                {currentPage} / {numPages}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden items-center min-[360px]:flex" role="group" aria-label="Zoom">
              <button type="button" aria-label="Zoom out" className={iconButton} disabled={zoomIndex === 0} onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}>
                <ZoomOut aria-hidden className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-xs tabular-nums text-[#F5F5F5]/60" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              <button type="button" aria-label="Zoom in" className={iconButton} disabled={zoomIndex === ZOOMS.length - 1} onClick={() => setZoomIndex((i) => Math.min(ZOOMS.length - 1, i + 1))}>
                <ZoomIn aria-hidden className="h-4 w-4" />
              </button>
            </div>

            <a
              href={RESUME_URL}
              download={RESUME_FILENAME}
              className="flex items-center gap-1.5 rounded-full border border-[#6EA8FF]/40 px-3 py-1.5 text-xs text-[#6EA8FF] transition-colors hover:bg-[#6EA8FF]/10 sm:text-sm"
            >
              <Download aria-hidden className="h-3.5 w-3.5" />
              <span>
                Download<span className="hidden sm:inline"> PDF</span>
              </span>
            </a>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" aria-label="Open PDF in a new tab" className={`${iconButton} hidden sm:grid`}>
              <ExternalLink aria-hidden className="h-4 w-4" />
            </a>
            <button type="button" aria-label="Close resume" className={iconButton} onClick={onClose}>
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pages */}
        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-label="Resume pages"
          onScroll={onScroll}
          className="relative flex-1 overflow-auto overscroll-contain px-3 py-4 outline-none sm:px-6 sm:py-6"
        >
          {failed ? (
            <div role="alert" className="mx-auto mt-16 max-w-sm text-center text-sm font-light text-[#F5F5F5]/70">
              <p className="mb-4">The preview couldn&rsquo;t be loaded here. You can still read the resume directly.</p>
              <div className="flex justify-center gap-3">
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#6EA8FF]/40 px-4 py-2 text-[#6EA8FF] hover:bg-[#6EA8FF]/10">
                  Open PDF
                </a>
                <a href={RESUME_URL} download={RESUME_FILENAME} className="rounded-full border border-white/20 px-4 py-2 text-[#F5F5F5]/80 hover:bg-white/10">
                  Download
                </a>
              </div>
            </div>
          ) : !loaded || pageWidth === 0 ? (
            <p role="status" className="mt-24 text-center text-sm font-light text-[#F5F5F5]/60">
              Loading resume&hellip;
            </p>
          ) : (
            <div className="mx-auto flex w-max flex-col gap-4">
              {Array.from({ length: numPages }, (_, i) => (
                <PdfPage key={i} loaded={loaded} pageNumber={i + 1} width={pageWidth} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
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
