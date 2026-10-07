/** Names things the way Magritte did: "Ceci n'est pas une pipe". Pure, so it is unit tested. */

export interface Noun {
  /** With its article: "un lien". */
  fr: string;
  en: string;
}

const BY_TAG: Record<string, Noun> = {
  a: { fr: "un lien", en: "a link" },
  button: { fr: "un bouton", en: "a button" },
  h1: { fr: "un titre", en: "a title" },
  h2: { fr: "un titre", en: "a title" },
  h3: { fr: "un titre", en: "a title" },
  h4: { fr: "un titre", en: "a title" },
  p: { fr: "un paragraphe", en: "a paragraph" },
  img: { fr: "une image", en: "an image" },
  svg: { fr: "un dessin", en: "a drawing" },
  path: { fr: "un dessin", en: "a drawing" },
  canvas: { fr: "un tableau", en: "a painting" },
  ul: { fr: "une liste", en: "a list" },
  ol: { fr: "une liste", en: "a list" },
  li: { fr: "un détail", en: "a list item" },
  nav: { fr: "un chemin", en: "a navigation" },
  header: { fr: "un chapeau", en: "a header" },
  footer: { fr: "un pied", en: "a footer" },
  section: { fr: "une scène", en: "a section" },
  article: { fr: "une histoire", en: "an article" },
  main: { fr: "une page", en: "a page" },
  span: { fr: "un mot", en: "a word" },
  time: { fr: "un moment", en: "a time" },
  dl: { fr: "une définition", en: "a definition list" },
  dt: { fr: "une question", en: "a term" },
  dd: { fr: "une réponse", en: "a description" },
  figure: { fr: "une figure", en: "a figure" },
  input: { fr: "une question", en: "a field" },
  div: { fr: "une boîte", en: "a box" },
};

export const FALLBACK: Noun = { fr: "un objet", en: "an object" };

/** What to call an element: its role first (a link styled as a button is still a link), then its tag. */
export function nounFor(tag: string, role?: string | null): Noun {
  if (role === "button") return BY_TAG.button;
  if (role === "link") return BY_TAG.a;
  return BY_TAG[tag.toLowerCase()] ?? FALLBACK;
}

export const caption = (noun: Noun) => `Ceci n’est pas ${noun.fr}.`;
