/* __NAME__ easter egg (STARTER): a centred panel with a tap counter. Make it a real game in this design's own look.
   Rules: every control is a real button with a visible focus style, the game starts only on a user action, nothing
   loops forever on its own, and it fits a 375px-wide phone. To restyle the page itself while the egg is open, target
   :global(main[data-design="__SLUG__"][data-egg-active]) (see the other designs for examples). */
.backdrop {
  background: rgba(20, 22, 26, 0.7);
}

.panel {
  width: min(22rem, 100%);
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #14161a;
  text-align: center;
}

.panel h2 {
  margin: 0 0 0.5rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.actions button {
  min-height: 2.5rem;
  padding: 0 1.25rem;
  border: 2px solid #14161a;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #14161a;
  font: inherit;
  cursor: pointer;
}

.actions button:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}
