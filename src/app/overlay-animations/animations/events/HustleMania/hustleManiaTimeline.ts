// app/overlay-animations/animations/events/HustleMania/hustleManiaTimeline.ts
import gsap from "gsap";

export interface HustleManiaTimelineTargets {
  container: HTMLDivElement | null;
  backgroundScene: SVGElement | null;
  sideBanners: SVGElement | null;
  bannerLeftBody?: SVGElement | null;
  bannerLeftLine?: SVGLineElement | null;
  bannerLeftText?: SVGElement | null;
  bannerRightBody?: SVGElement | null;
  bannerRightLine?: SVGLineElement | null;
  bannerRightText?: SVGElement | null;
  signPanel: SVGElement | null;
  boothGlowLeft: SVGElement | null;
  boothGlowCenter: SVGElement | null;
  boothGlowRight: SVGElement | null;
  speechBubbleLeft: SVGElement | null;
  speechBubbleCenter: SVGElement | null;
  speechBubbleRight: SVGElement | null;
  titleClipStartup: SVGRectElement | null;
  titleClipExpo: SVGRectElement | null;
  titleStartupText: SVGTextElement | null;
  titleExpoText: SVGTextElement | null;
  titleCaption: SVGElement | null;
  titleUnderline: SVGLineElement | null;
  skipButton?: HTMLButtonElement | null;
}

export interface HustleManiaTimelineOptions {
  onComplete?: () => void;
}

/**
 * Creates and returns the official 6-phase GSAP timeline for Hustle Mania.
 *
 * 1. ENTRANCE (0 → ~0.5s): Overlay fades in, base scene scales/fades in.
 * 2. MAIN IDEA (~0.5s → ~1.7s): Banners execute 3-beat unfurl (Expand -> Drop/Settle ->
 *    line-by-line staggered Text reveal) with 0.12s left/right offset; sign panel pops in.
 * 3. INTERACTION (~1.7s → ~2.2s): All three booths animate simultaneously with
 *    soft glow-pulse overlays and speech bubbles popping in directly beside each figure's head.
 * 4. TITLE REVEAL (~2.2s → ~2.9s): "HUSTLE" wipes in, "MANIA" wipes in ~0.1s after
 *    from same origin, caption fades in alongside with blue accent underline.
 * 5. RESOLUTION / HOLD (~2.9s → ~3.6s): Everything settles, idle state holds.
 * 6. EXIT (~3.6s → ~4.2s): Clean staged exit.
 */
export function createHustleManiaTimeline(
  targets: HustleManiaTimelineTargets,
  options: HustleManiaTimelineOptions = {}
): gsap.core.Timeline {
  const {
    container,
    backgroundScene,
    sideBanners,
    bannerLeftBody,
    bannerLeftLine,
    bannerLeftText,
    bannerRightBody,
    bannerRightLine,
    bannerRightText,
    signPanel,
    boothGlowLeft,
    boothGlowCenter,
    boothGlowRight,
    speechBubbleLeft,
    speechBubbleCenter,
    speechBubbleRight,
    titleClipStartup,
    titleClipExpo,
    titleCaption,
    titleUnderline,
    skipButton,
  } = targets;

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      options.onComplete?.();
    },
  });

  // ── Initial State Setup ───────────────────────────────────────────────────
  if (container) {
    gsap.set(container, { opacity: 0 });
  }

  if (skipButton) {
    gsap.set(skipButton, { opacity: 0 });
  }

  if (backgroundScene) {
    gsap.set(backgroundScene, {
      opacity: 0,
      scale: 0.96,
      transformOrigin: "768px 512px",
    });
  }

  // Side banners container: keep visible so hanging lines are anchored
  if (sideBanners) {
    gsap.set(sideBanners, { opacity: 1, y: 0 });
  }

  // Banner bodies: start collapsed at top hanging point (scaleY: 0)
  if (bannerLeftBody) {
    gsap.set(bannerLeftBody, {
      scaleY: 0,
      y: 0,
      transformOrigin: "140px 45px",
    });
  }

  if (bannerRightBody) {
    gsap.set(bannerRightBody, {
      scaleY: 0,
      y: 0,
      transformOrigin: "1396px 45px",
    });
  }

  if (bannerLeftLine) {
    gsap.set(bannerLeftLine, { opacity: 0 });
  }

  if (bannerRightLine) {
    gsap.set(bannerRightLine, { opacity: 0 });
  }

  if (bannerLeftText) {
    const tspans = bannerLeftText.querySelectorAll("tspan");
    if (tspans.length > 0) {
      gsap.set(tspans, { opacity: 0 });
    }
  }

  if (bannerRightText) {
    const tspans = bannerRightText.querySelectorAll("tspan");
    if (tspans.length > 0) {
      gsap.set(tspans, { opacity: 0 });
    }
  }

  if (signPanel) {
    gsap.set(signPanel, {
      opacity: 0,
      scale: 0.94,
      transformOrigin: "768px 132px",
    });
  }

  const boothGlows = [boothGlowLeft, boothGlowCenter, boothGlowRight].filter(Boolean);
  if (boothGlows.length > 0) {
    gsap.set(boothGlows, { opacity: 0, scale: 1 });
  }

  const speechBubbles = [speechBubbleLeft, speechBubbleCenter, speechBubbleRight].filter(Boolean);
  if (speechBubbles.length > 0) {
    gsap.set(speechBubbles, { opacity: 0, scale: 0 });
  }

  if (titleClipStartup) {
    gsap.set(titleClipStartup, { attr: { width: 0 } });
  }

  if (titleClipExpo) {
    gsap.set(titleClipExpo, { attr: { width: 0 } });
  }

  if (titleCaption) {
    gsap.set(titleCaption, { opacity: 0, y: 8 });
  }

  if (titleUnderline) {
    gsap.set(titleUnderline, {
      strokeDasharray: 75,
      strokeDashoffset: 75,
      opacity: 0,
    });
  }

  // ── PHASE 1: ENTRANCE (0.0s → ~0.5s) ──────────────────────────────────────
  if (container) {
    tl.to(container, { opacity: 1, duration: 0.4, ease: "power1.out" }, 0);
  }

  if (backgroundScene) {
    tl.to(
      backgroundScene,
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      0.05
    );
  }

  if (skipButton) {
    tl.to(skipButton, { opacity: 1, duration: 0.3 }, 0.2);
  }

  // ── PHASE 2: BANNER ANIMATION (3-BEAT SEQUENCE) & SIGN PANEL (~0.5s → ~1.7s) ──

  // Left Banner: starts at t = 0.50s
  // Beat A (EXPAND): blue body scales up/unfurls from collapsed state (scaleY: 0 -> 1)
  if (bannerLeftBody) {
    tl.to(
      bannerLeftBody,
      {
        scaleY: 1,
        duration: 0.34,
        ease: "power2.in",
      },
      0.50
    );

    // Beat B (DROP / SETTLE): once fully expanded at 0.84s, settles with slight bounce/overshoot
    tl.fromTo(
      bannerLeftBody,
      { y: -10 },
      {
        y: 0,
        duration: 0.24,
        ease: "back.out(2.4)",
      },
      0.84
    );
  }

  // Beat C (TEXT FORMS): only after banner has fully expanded and settled (t >= 1.08s),
  // reveal text line-by-line staggered ~0.08s apart
  if (bannerLeftText) {
    const leftTspans = bannerLeftText.querySelectorAll("tspan");
    if (leftTspans.length > 0) {
      tl.to(
        leftTspans,
        {
          opacity: 1,
          duration: 0.12,
          stagger: 0.08,
          ease: "power1.out",
        },
        1.10
      );
    }
  }

  if (bannerLeftLine) {
    tl.to(bannerLeftLine, { opacity: 1, duration: 0.15 }, 1.44);
  }

  // Right Banner: starts with ~0.12s stagger offset at t = 0.62s
  // Beat A (EXPAND): blue body scales up/unfurls from collapsed state (scaleY: 0 -> 1)
  if (bannerRightBody) {
    tl.to(
      bannerRightBody,
      {
        scaleY: 1,
        duration: 0.34,
        ease: "power2.in",
      },
      0.62
    );

    // Beat B (DROP / SETTLE): once fully expanded at 0.96s, settles with slight bounce/overshoot
    tl.fromTo(
      bannerRightBody,
      { y: -10 },
      {
        y: 0,
        duration: 0.24,
        ease: "back.out(2.4)",
      },
      0.96
    );
  }

  // Beat C (TEXT FORMS): only after right banner has fully expanded and settled (t >= 1.20s),
  // reveal text line-by-line staggered ~0.08s apart
  if (bannerRightText) {
    const rightTspans = bannerRightText.querySelectorAll("tspan");
    if (rightTspans.length > 0) {
      tl.to(
        rightTspans,
        {
          opacity: 1,
          duration: 0.12,
          stagger: 0.08,
          ease: "power1.out",
        },
        1.22
      );
    }
  }

  if (bannerRightLine) {
    tl.to(bannerRightLine, { opacity: 1, duration: 0.15 }, 1.64);
  }

  // Center Sign Panel entrance
  if (signPanel) {
    tl.to(
      signPanel,
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
      },
      0.70
    );
  }

  // ── PHASE 3: INTERACTION (~1.7s → ~2.2s) ──────────────────────────────────
  // All three booths animate simultaneously
  if (boothGlows.length > 0) {
    tl.fromTo(
      boothGlows,
      { opacity: 0, scale: 0.98 },
      {
        opacity: 0.85,
        scale: 1.02,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      },
      1.70
    );
  }

  // Speech bubbles pop in directly beside each figure's head
  if (speechBubbles.length > 0) {
    tl.to(
      speechBubbles,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      },
      1.78
    );
  }

  // ── PHASE 4: TITLE REVEAL (~2.2s → ~2.9s) ─────────────────────────────────
  // Single text run, both words wiping in from same origin, staggered ~0.1s
  if (titleClipStartup) {
    tl.to(
      titleClipStartup,
      {
        attr: { width: 480 },
        duration: 0.45,
        ease: "power2.out",
      },
      2.20
    );
  }

  if (titleClipExpo) {
    tl.to(
      titleClipExpo,
      {
        attr: { width: 480 },
        duration: 0.45,
        ease: "power2.out",
      },
      2.30
    );
  }

  // Caption lines beside title
  if (titleCaption) {
    tl.to(
      titleCaption,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      2.45
    );
  }

  // Blue underline accent under caption
  if (titleUnderline) {
    tl.to(
      titleUnderline,
      {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      2.60
    );
  }

  // ── PHASE 5: RESOLUTION / HOLD (~2.9s → ~3.6s) ────────────────────────────
  tl.to({}, { duration: 0.7 }, 2.90);

  // ── PHASE 6: EXIT (~3.6s → ~4.2s) ─────────────────────────────────────────
  // Fast fade for title, caption, and speech bubbles
  const quickExitItems = [titleCaption, ...speechBubbles].filter(Boolean);
  if (quickExitItems.length > 0) {
    tl.to(quickExitItems, { opacity: 0, duration: 0.22, ease: "power2.in" }, 3.60);
  }

  // Banners and sign panel retract slightly
  const headerItems = [
    bannerLeftBody,
    bannerRightBody,
    bannerLeftText,
    bannerRightText,
    signPanel,
  ].filter(Boolean);
  if (headerItems.length > 0) {
    tl.to(headerItems, { opacity: 0, y: -15, duration: 0.3, ease: "power2.in" }, 3.68);
  }

  // Rest of scene / container fades out cleanly
  if (container) {
    tl.to(container, { opacity: 0, duration: 0.35, ease: "power2.in" }, 3.80);
  }

  return tl;
}
