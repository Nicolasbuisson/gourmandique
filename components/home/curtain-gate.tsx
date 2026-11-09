"use client";

import { useLayoutEffect } from "react";

// The curtain plays once per page load. This module stays loaded across
// client-side navigation and is loaded afresh on a refresh, so a refresh plays
// it again and coming back to the home page from elsewhere on the site doesn't.
let played = false;

// Decides whether the hero's curtain plays, and holds the page still while it
// does.
//
// If it has already played, it is hidden. A layout effect, so that happens
// before the browser paints. It can only already have played on a client-side
// navigation, so on a full load the server-rendered curtain is never hidden.
//
// Otherwise the page can't scroll while the curtain is down. The lock doesn't
// touch `overflow`, which would hide the scrollbar and reflow the page when it
// came back. Instead it swallows the wheel, touch and keys that scroll, and
// puts the page back if it moves anyway (the scrollbar itself can still be
// dragged). The lock is released when the curtain starts to lift, so the page
// can be scrolled while it is uncovered. The curtain counts as played from that
// moment, so leaving mid-writing plays it again on return.
//
// If this hydrates after the lift has already begun, it counts as played and
// never locks: there is no animationstart left to release it.

const SCROLL_KEYS = new Set([
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

export function CurtainGate({ curtainId }: { curtainId: string }) {
  useLayoutEffect(() => {
    const curtain = document.getElementById(curtainId);
    if (!curtain) return;
    if (played) {
      curtain.style.display = "none";
      return;
    }

    const lift = curtain.getAnimations()[0];
    if (!lift) return;
    const { delay = 0 } = lift.effect?.getTiming() ?? {};
    if (Number(lift.currentTime ?? 0) >= delay) {
      played = true;
      return;
    }

    const { scrollX, scrollY } = window;
    const block = (event: Event) => event.preventDefault();
    const blockKeys = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      // Typing a space or moving the caret in a field isn't scrolling.
      const target = event.target as HTMLElement;
      if (target.isContentEditable || target.closest("input, textarea, select"))
        return;
      event.preventDefault();
    };
    const hold = () => window.scrollTo(scrollX, scrollY);

    const release = () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("scroll", hold);
    };
    const onStart = (event: AnimationEvent) => {
      if (event.target !== curtain) return;
      played = true;
      release();
    };

    // Not passive, or preventDefault is ignored.
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", hold);
    curtain.addEventListener("animationstart", onStart);
    return () => {
      curtain.removeEventListener("animationstart", onStart);
      release();
    };
  }, [curtainId]);

  return null;
}
