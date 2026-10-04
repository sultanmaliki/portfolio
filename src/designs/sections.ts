/**
 * The in-page anchors every design provides (part of the design contract, checked by
 * e2e/designs.spec.ts). Keeping the ids the same everywhere lets the design switcher carry a visitor
 * to the same section of the next design, and lets links like "/#projects" keep working.
 *
 * A design that merges two sections still needs both ids, for example by putting one id on the heading
 * wrapper. Plain data, no React, so Node-side tests can import it too.
 */
export const SECTION_IDS = ["top", "story", "skills", "experience", "education", "projects", "timeline", "curiosity", "contact"] as const;

export type SectionId = (typeof SECTION_IDS)[number];
