let observer: IntersectionObserver | undefined;

/**
 * Marks an element with `data-shown` the first time it scrolls into view (and keeps it). Pure CSS
 * does the rest (see `Reveal` and the stroke-drawing in the sketch design), so reduced-motion and
 * print styles work from the first paint with no JavaScript branching, and nothing can differ
 * between the server render and hydration. One shared observer serves every element.
 *
 * Returns a cleanup function for useEffect.
 */
export function showOnView(el: Element): () => void {
  if (typeof IntersectionObserver === "undefined") {
    el.setAttribute("data-shown", "");
    return () => {};
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-shown", "");
        observer?.unobserve(entry.target);
      }
    },
    // Fires as soon as the element's top edge is above the lower 8% of the screen, however tall the element is
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );
  observer.observe(el);
  return () => observer?.unobserve(el);
}
