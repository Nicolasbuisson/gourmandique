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
// Otherwise the page can't scroll while the curtain is down. The lock is
// released when the curtain starts to lift, not when it is gone: releasing it
// brings the scrollbar back and reflows the page, and that should happen while
// the page is still covered. The curtain counts as played from that moment, so
// leaving mid-writing plays it again on return.
//
// If this hydrates after the lift has already begun, it counts as played and
// never locks: there is no animationstart left to release it.
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

    const root = document.documentElement;
    const previous = root.style.overflow;
    const release = () => {
      root.style.overflow = previous;
    };
    const onStart = (event: AnimationEvent) => {
      if (event.target !== curtain) return;
      played = true;
      release();
    };

    root.style.overflow = "hidden";
    curtain.addEventListener("animationstart", onStart);
    return () => {
      curtain.removeEventListener("animationstart", onStart);
      release();
    };
  }, [curtainId]);

  return null;
}
