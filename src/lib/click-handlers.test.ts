import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MouseEvent } from "react";
import { OPEN_LINK_EVENT, linkHandler, type LinkInfo } from "./links";
import { OPEN_RESUME_EVENT, handleResumeClick } from "./resume";

// The handlers only talk to `window` through events, so a bare EventTarget is enough here.
beforeEach(() => {
  vi.stubGlobal("window", new EventTarget());
});
afterEach(() => vi.unstubAllGlobals());

const click = (over: Partial<MouseEvent<HTMLElement>> = {}) => {
  const preventDefault = vi.fn();
  const event = {
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    preventDefault,
    ...over,
  } as unknown as MouseEvent<HTMLElement>;
  return { event, preventDefault };
};

describe("handleResumeClick", () => {
  it("opens the in-page reader on a plain click", () => {
    const opened = vi.fn();
    window.addEventListener(OPEN_RESUME_EVENT, opened);
    const { event, preventDefault } = click();
    handleResumeClick(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(opened).toHaveBeenCalledOnce();
  });

  it.each([
    ["ctrl", { ctrlKey: true }],
    ["cmd", { metaKey: true }],
    ["shift", { shiftKey: true }],
    ["alt", { altKey: true }],
    ["middle button", { button: 1 }],
    ["already handled", { defaultPrevented: true }],
  ])("leaves %s clicks to the browser (new tab / download)", (_name, over) => {
    const opened = vi.fn();
    window.addEventListener(OPEN_RESUME_EVENT, opened);
    const { event, preventDefault } = click(over);
    handleResumeClick(event);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(opened).not.toHaveBeenCalled();
  });
});

describe("linkHandler", () => {
  const info: LinkInfo = { url: "https://github.com/sultanmaliki/setbeat", title: "setbeat" };

  it("opens the link viewer with the link details on a plain click", () => {
    const received: LinkInfo[] = [];
    window.addEventListener(OPEN_LINK_EVENT, (e) => received.push((e as CustomEvent<LinkInfo>).detail));
    const { event, preventDefault } = click();
    linkHandler(info)(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(received).toEqual([info]);
  });

  it("does nothing for modified clicks so ctrl/cmd-click still opens a real tab", () => {
    const opened = vi.fn();
    window.addEventListener(OPEN_LINK_EVENT, opened);
    const { event, preventDefault } = click({ ctrlKey: true });
    linkHandler(info)(event);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(opened).not.toHaveBeenCalled();
  });
});
