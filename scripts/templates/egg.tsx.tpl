"use client";

import { useState } from "react";
import EggDialog, { EggClose } from "../shared/EggDialog";
import { useEasterEgg } from "../shared/useEasterEgg";
import styles from "./egg.module.css";

/**
 * __NAME__ easter egg (STARTER). Type "__WORD__" (or tap the name five times) to open it.
 *
 * Replace this tap counter with something to play that belongs to this design: a game, a toy, a tiny conversation.
 * See "Easter eggs" in docs/DESIGNS.md for the rules and for what the other designs do, and pick your own secret
 * word: lowercase, three letters or more, not used by another design. `data-egg-active` is set on
 * <main data-design="__SLUG__"> while it is open, so egg.module.css can restyle the page too.
 */
export default function __COMPONENT__Egg() {
  const { active, dismiss } = useEasterEgg({ slug: "__SLUG__", word: "__WORD__", duration: 0 });
  return (
    <EggDialog slug="__SLUG__" active={active} title="__NAME__ easter egg" onClose={dismiss} className={styles.backdrop}>
      <Starter />
    </EggDialog>
  );
}

/** Only mounted while the egg is open, so every visit starts fresh. */
function Starter() {
  const [taps, setTaps] = useState(0);
  return (
    <div className={styles.panel}>
      <h2>Hello! You found it.</h2>
      <p role="status">{taps === 0 ? "Tap the button." : `${taps} ${taps === 1 ? "tap" : "taps"}. Make this a real game.`}</p>
      <div className={styles.actions}>
        <button type="button" data-autofocus onClick={() => setTaps((n) => n + 1)}>
          Tap
        </button>
        <EggClose>Close</EggClose>
      </div>
    </div>
  );
}
