// app/overlay-animations/animations/events/StartupExpo/startupExpoTimeline.ts
import gsap from "gsap";

export interface StartupExpoTimelineTargets {
  container: HTMLElement | null;
  skipButton?: HTMLElement | null;

  // Base scene elements
  backgroundBase?: SVGElement | null;
  sideBanners?: SVGElement | null;
  crackDebris?: SVGElement | null;
  plantLeft?: SVGElement | null;
  plantRight?: SVGElement | null;
  logoBadge?: SVGElement | null;
  dateTag?: SVGElement | null;

  // Stairs steps (bottom to top)
  step1?: SVGElement | null;
  step2?: SVGElement | null;
  step3?: SVGElement | null;
  step4?: SVGElement | null;
  step5?: SVGElement | null;

  // Step banners
  banner1?: SVGElement | null;
  banner2?: SVGElement | null;
  banner3?: SVGElement | null;
  banner4?: SVGElement | null;
  banner5?: SVGElement | null;

  // Banner texts
  bannerText1?: SVGElement | null;
  bannerText2?: SVGElement | null;
  bannerText3?: SVGElement | null;
  bannerText4?: SVGElement | null;
  bannerText5?: SVGElement | null;

  // Lamp & Light
  lampFixture?: SVGElement | null;
  lampBulbGlow?: SVGElement | null;
  lampBulbCore?: SVGElement | null;
  lightCone?: SVGElement | null;

  // Person + Flag
  personFlagGroup?: SVGElement | null;

  // Title & Tagline
  titleClipRect?: SVGRectElement | null;
  titleText?: SVGElement | null;
  taglineText?: SVGElement | null;
}

export interface StartupExpoTimelineOptions {
  onComplete?: () => void;
  onEntranceComplete?: () => void;
}

export function createStartupExpoTimeline(
  t: StartupExpoTimelineTargets,
  options: StartupExpoTimelineOptions = {}
): gsap.core.Timeline {
  const tl = gsap.timeline({
    paused: false,
    onComplete: () => {
      options.onComplete?.();
    },
  });

  const steps = [t.step1, t.step2, t.step3, t.step4, t.step5].filter(Boolean);
  const banners = [t.banner1, t.banner2, t.banner3, t.banner4, t.banner5].filter(Boolean);
  const bannerTexts = [
    t.bannerText1,
    t.bannerText2,
    t.bannerText3,
    t.bannerText4,
    t.bannerText5,
  ].filter(Boolean);

  // ── PHASE 1: SETUP (Zero duration initial property locks) ──────────────────
  if (t.container) {
    tl.set(t.container, { opacity: 1 }, 0);
  }

  // Base background & framing
  if (t.backgroundBase) {
    tl.set(t.backgroundBase, { opacity: 1 }, 0);
  }

  // Base scene elements initial state
  const baseElements = [
    t.crackDebris,
    t.plantLeft,
    t.plantRight,
    t.lampFixture,
    t.logoBadge,
    t.dateTag,
  ].filter(Boolean);

  if (baseElements.length > 0) {
    tl.set(baseElements, { opacity: 0 }, 0);
  }

  const stepItems = [
    { step: t.step1, banner: t.banner1, text: t.bannerText1, origin: "591px 840px", startTime: 0.60 },
    { step: t.step2, banner: t.banner2, text: t.bannerText2, origin: "753px 756px", startTime: 0.75 },
    { step: t.step3, banner: t.banner3, text: t.bannerText3, origin: "915px 672px", startTime: 0.90 },
    { step: t.step4, banner: t.banner4, text: t.bannerText4, origin: "1077px 588px", startTime: 1.05 },
    { step: t.step5, banner: t.banner5, text: t.bannerText5, origin: "1240px 504px", startTime: 1.20 },
  ];

  // CRITICAL: Set scaleY: 0 immediately at t=0 so steps NEVER pop-in before animation
  stepItems.forEach(({ step, origin }) => {
    if (step) {
      tl.set(
        step,
        {
          scaleY: 0,
          opacity: 1,
          transformOrigin: origin,
        },
        0
      );
    }
  });

  // Banners initial state (scaleY: 0 from top)
  if (banners.length > 0) {
    tl.set(
      banners,
      {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "50% 0%",
      },
      0
    );
  }

  // Banner text initial state (hidden)
  if (bannerTexts.length > 0) {
    tl.set(bannerTexts, { opacity: 0 }, 0);
  }

  // Side banners initial state
  if (t.sideBanners) {
    tl.set(t.sideBanners, { opacity: 0, scaleY: 0, transformOrigin: "50% 0%" }, 0);
  }

  // Light cone & Lamp bulb glow initial state
  if (t.lightCone) {
    tl.set(t.lightCone, { opacity: 0 }, 0);
  }
  if (t.lampBulbGlow) {
    tl.set(t.lampBulbGlow, { opacity: 0, scale: 0.5, transformOrigin: "350px 148px" }, 0);
  }
  if (t.lampBulbCore) {
    tl.set(t.lampBulbCore, { opacity: 0 }, 0);
  }

  // Person + Flag initial state (scale: 0)
  if (t.personFlagGroup) {
    tl.set(t.personFlagGroup, { opacity: 0, scale: 0, transformOrigin: "1250px 420px" }, 0);
  }

  // Title clip-path & tagline initial state
  if (t.titleClipRect) {
    tl.set(t.titleClipRect, { attr: { width: 0 } }, 0);
  }
  if (t.taglineText) {
    tl.set(t.taglineText, { opacity: 0, y: 15 }, 0);
  }

  // Skip button initial state
  if (t.skipButton) {
    tl.set(t.skipButton, { opacity: 0, y: -10 }, 0);
  }

  // ── PHASE 2: BASE ENTRANCE (~0.05s → ~0.60s) ──────────────────────────────
  // Base scene (cracked ground, dark lamp, plants, badges) fades in
  if (baseElements.length > 0) {
    tl.to(
      baseElements,
      {
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
      },
      0.05
    );
  }

  // Side banners drop/expand in
  if (t.sideBanners) {
    tl.to(
      t.sideBanners,
      {
        opacity: 1,
        scaleY: 1,
        duration: 0.55,
        ease: "back.out(1.5)",
      },
      0.15
    );
  }

  if (t.skipButton) {
    tl.to(t.skipButton, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.20);
  }

  // ── PHASE 3: STAIRS BUILD & SEQUENTIAL BANNERS (~0.60s → ~2.15s) ───────────
  // Step 1 → Step 5 scaleY 0→1 from bottom baseline, staggered ~0.15s with back.out overshoot
  // Each banner expands and settles ONLY after its step settles, and text wipes in after banner settles.

  stepItems.forEach(({ step, banner, text, origin, startTime }) => {
    // 1. Step rises from baseline with overshoot
    if (step) {
      tl.to(
        step,
        {
          scaleY: 1,
          duration: 0.42,
          ease: "back.out(1.4)",
          transformOrigin: origin,
        },
        startTime
      );
    }

    // Step settles around startTime + 0.38s
    const stepSettleTime = startTime + 0.38;

    // 2. Banner expands from top (scaleY 0→1)
    if (banner) {
      tl.to(
        banner,
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.20,
          ease: "power2.out",
        },
        stepSettleTime
      );

      // Settle drop/bounce
      tl.fromTo(
        banner,
        { y: -7 },
        {
          y: 0,
          duration: 0.16,
          ease: "back.out(2.2)",
        },
        stepSettleTime + 0.18
      );
    }

    // 3. Text wipe-in (STRICTLY after banner shape has settled at stepSettleTime + 0.34s)
    const bannerSettleTime = stepSettleTime + 0.34;
    if (text) {
      tl.to(
        text,
        {
          opacity: 1,
          duration: 0.18,
          ease: "power1.out",
        },
        bannerSettleTime
      );
    }
  });

  // ── PHASE 4: LAMP BULB GLOW & PERSON + FLAG IN SYNC (~2.10s → ~2.70s) ────
  // Lamp bulb pulses + Person with flag lands on step 5
  if (t.lampBulbGlow) {
    tl.fromTo(
      t.lampBulbGlow,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 0.95,
        scale: 1.2,
        duration: 0.22,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      },
      2.10
    );
  }

  if (t.lampBulbCore) {
    tl.to(t.lampBulbCore, { opacity: 1, duration: 0.18 }, 2.15);
  }

  // Person + flag pops onto step-5 timed in exact sync with the light landing
  if (t.personFlagGroup) {
    tl.fromTo(
      t.personFlagGroup,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.42,
        ease: "back.out(2.0)",
      },
      2.10
    );
  }

  // Title wipe-in: single text run with tspans wiping from single origin
  if (t.titleClipRect) {
    tl.to(
      t.titleClipRect,
      {
        attr: { width: 900 },
        duration: 0.48,
        ease: "power2.out",
      },
      2.36
    );
  }

  if (t.taglineText) {
    tl.to(
      t.taglineText,
      {
        opacity: 1,
        y: 0,
        duration: 0.38,
        ease: "power2.out",
      },
      2.58
    );
  }

  tl.call(() => {
    options.onEntranceComplete?.();
  }, undefined, 2.80);

  // ── PHASE 5: RESOLUTION / HOLD (~2.85s → ~3.70s) ──────────────────────────
  tl.to({}, { duration: 0.85 }, 2.85);

  // ── PHASE 6: EXIT (~3.70s → ~4.20s) ───────────────────────────────────────
  const exitForeground = [
    t.titleText,
    t.taglineText,
    t.personFlagGroup,
    t.lightCone,
    t.skipButton,
  ].filter(Boolean);

  if (exitForeground.length > 0) {
    tl.to(
      exitForeground,
      {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
      },
      3.70
    );
  }

  // Rest of scene / container fades out cleanly
  if (t.container) {
    tl.to(
      t.container,
      {
        opacity: 0,
        duration: 0.32,
        ease: "power2.in",
      },
      3.82
    );
  }

  return tl;
}
