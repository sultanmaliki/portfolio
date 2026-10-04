import styles from "./shared.module.css";

/** First tab stop on every design: jumps past the header to the first section. Neutral on purpose so it works on any palette. */
export default function SkipLink({ href = "#story", children = "Skip to content" }: { href?: string; children?: string }) {
  return (
    <a href={href} className={styles.skip}>
      {children}
    </a>
  );
}
