// app/overlay-animations/animations/events/PitchDeck/pitchDeckTimeline.ts
import gsap from "gsap";

export interface PitchDeckSceneTargets {
  container: HTMLElement | null;
  stageFrame: HTMLElement | null;
  skipButton: HTMLElement | null;

  // Scene layers & elements
  baseLayer: SVGElement | null;
  topLeftHeader: SVGElement | null;
  topRightHeader: SVGElement | null;
  lampLeft: SVGElement | null;
  lampRight: SVGElement | null;
  lightBeamLeft: SVGElement | null;
  lightBeamRight: SVGElement | null;
  leftBanner: SVGElement | null;
  rightBanner: SVGElement | null;

  // Projector screen assembly
  screenFrame: SVGElement | null;
  screenCanvas: SVGElement | null;
  screenContent: SVGElement | null;

  // Presentation contents
  heroTitle: SVGTextElement | null;
  subtitle: SVGElement | null;
  chartBars: (SVGElement | null)[];
  chartArrow: SVGElement | null;
  iconRow1: SVGElement | null;
  iconRow2: SVGElement | null;
  iconRow3: SVGElement | null;
  calloutBubble: SVGElement | null;
}

export interface PitchDeckTimelineOptions {
  onEntranceComplete?: () => void;
  onComplete?: () => void;
}

export function createPitchDeckMasterTl(
  t: PitchDeckSceneTargets,
  options: PitchDeckTimelineOptions = {}
): gsap.core.Timeline {
  const { onEntranceComplete, onComplete } = options;

  // ── Initial setup ──────────────────────────────────────────────────────────
  if (t.container) gsap.set(t.container, { opacity: 0 });
  if (t.stageFrame) gsap.set(t.stageFrame, { opacity: 0, scale: 0.98 });
  if (t.skipButton) gsap.set(t.skipButton, { opacity: 0, pointerEvents: "none" });

  // Base layer (presenter, podium, audience, chairs, plants, stage floor)
  if (t.baseLayer) gsap.set(t.baseLayer, { opacity: 0 });

  // Top headers
  if (t.topLeftHeader) gsap.set(t.topLeftHeader, { opacity: 0, y: -20 });
  if (t.topRightHeader) gsap.set(t.topRightHeader, { opacity: 0, y: -20 });

  // Ceiling lamps & light beams
  if (t.lampLeft) gsap.set(t.lampLeft, { opacity: 0, y: -40, transformOrigin: "382px 0px" });
  if (t.lampRight) gsap.set(t.lampRight, { opacity: 0, y: -40, transformOrigin: "1290px 0px" });
  if (t.lightBeamLeft) gsap.set(t.lightBeamLeft, { opacity: 0 });
  if (t.lightBeamRight) gsap.set(t.lightBeamRight, { opacity: 0 });

  // Side banners
  if (t.leftBanner) gsap.set(t.leftBanner, { opacity: 0, scaleY: 0, transformOrigin: "123px 314px" });
  if (t.rightBanner) gsap.set(t.rightBanner, { opacity: 0, scaleY: 0, transformOrigin: "1549px 312px" });

  // Projector screen structure
  if (t.screenFrame) gsap.set(t.screenFrame, { opacity: 0, y: -15 });
  if (t.screenCanvas) {
    gsap.set(t.screenCanvas, {
      scaleY: 0,
      transformOrigin: "836px 128px",
      opacity: 0,
    });
  }
  if (t.screenContent) gsap.set(t.screenContent, { opacity: 0 });

  // Hero title & subtitle
  if (t.heroTitle) gsap.set(t.heroTitle, { opacity: 0, scale: 0.85, transformOrigin: "709.5px 420px" });
  if (t.subtitle) gsap.set(t.subtitle, { opacity: 0, y: 15 });

  // Chart bars (ordered 1 to 4: lowest to highest)
  t.chartBars.forEach((bar) => {
    if (bar) {
      gsap.set(bar, {
        scaleY: 0,
        transformOrigin: "bottom center",
      });
    }
  });

  // Chart arrow
  if (t.chartArrow) {
    gsap.set(t.chartArrow, {
      opacity: 0,
      scale: 0.75,
      x: -25,
      y: 15,
      transformOrigin: "976px 318px",
    });
  }

  // 3 Icon rows
  if (t.iconRow1) gsap.set(t.iconRow1, { opacity: 0, x: 25 });
  if (t.iconRow2) gsap.set(t.iconRow2, { opacity: 0, x: 25 });
  if (t.iconRow3) gsap.set(t.iconRow3, { opacity: 0, x: 25 });

  // Presenter callout speech bubble
  if (t.calloutBubble) {
    gsap.set(t.calloutBubble, {
      opacity: 0,
      scale: 0.7,
      transformOrigin: "142px 56px",
    });
  }

  // ── Build Master Timeline ──────────────────────────────────────────────────
  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      onComplete?.();
    },
  });

  // ── PHASE 1: Environment & Atmosphere Entrance (0.0s – 1.2s) ───────────────
  tl.to(t.container, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0.0)
    .to(t.stageFrame, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.05)
    .to(t.skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.3 }, 0.4)
    .to(t.baseLayer, { opacity: 1, duration: 0.55, ease: "power1.out" }, 0.1)

    // Top headers descend into place
    .to([t.topLeftHeader, t.topRightHeader], {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: "power2.out",
    }, 0.25)

    // Hanging lamps drop in with smooth overshoot
    .to([t.lampLeft, t.lampRight], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.4)",
    }, 0.2)

    // Light beams glow
    .to([t.lightBeamLeft, t.lightBeamRight], {
      opacity: 0.85,
      duration: 0.5,
      ease: "power1.inOut",
    }, 0.5)

    // Side banners: 3-beat sequence (expand -> drop/settle -> reveal)
    .to([t.leftBanner, t.rightBanner], {
      opacity: 1,
      scaleY: 1,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.out",
    }, 0.45)
    .to([t.leftBanner, t.rightBanner], {
      y: 4,
      duration: 0.12,
      ease: "power1.in",
    }, 1.0)
    .to([t.leftBanner, t.rightBanner], {
      y: 0,
      duration: 0.18,
      ease: "back.out(2)",
    }, 1.12);

  // ── PHASE 2: Projector Screen Drop (1.2s – 2.0s) ───────────────────────────
  tl.to(t.screenFrame, {
    opacity: 1,
    y: 0,
    duration: 0.35,
    ease: "power2.out",
  }, 1.2)
    .to(t.screenCanvas, {
      opacity: 1,
      scaleY: 1,
      duration: 0.65,
      ease: "power3.out",
    }, 1.3)
    .set(t.screenContent, { opacity: 1 }, 1.6);

  // ── PHASE 3: Hero Title Reveal (2.0s – 2.8s) ───────────────────────────────
  tl.to(t.heroTitle, {
    opacity: 1,
    scale: 1,
    duration: 0.55,
    ease: "back.out(1.8)",
  }, 2.0)
    .to(t.subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    }, 2.35)
    .add(() => {
      onEntranceComplete?.();
    }, 2.7);

  // ── PHASE 4: Slide Content Sequential Build (2.8s – 4.5s) ───────────────────
  // Bar chart rising from baseline
  t.chartBars.forEach((bar, index) => {
    if (bar) {
      tl.to(bar, {
        scaleY: 1,
        duration: 0.45,
        ease: "back.out(1.6)",
      }, 2.8 + index * 0.12);
    }
  });

  // Trend arrow swoops upwards over the bars
  tl.to(t.chartArrow, {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    duration: 0.55,
    ease: "power3.out",
  }, 3.35)
    .to(t.chartArrow, {
      scale: 1.06,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
    }, 3.85);

  // 3 Icon rows slide in sequentially (PPT style)
  tl.to(t.iconRow1, {
    opacity: 1,
    x: 0,
    duration: 0.38,
    ease: "power2.out",
  }, 3.5)
    .to(t.iconRow2, {
      opacity: 1,
      x: 0,
      duration: 0.38,
      ease: "power2.out",
    }, 3.75)
    .to(t.iconRow3, {
      opacity: 1,
      x: 0,
      duration: 0.38,
      ease: "power2.out",
    }, 4.0);

  // ── PHASE 5: Presenter Callout & Climax Hold (4.5s – 6.6s) ──────────────────
  tl.to(t.calloutBubble, {
    opacity: 1,
    scale: 1,
    duration: 0.45,
    ease: "back.out(2.2)",
  }, 4.4);

  // Climax hold gap before clean completion
  tl.to({}, { duration: 2.1 }, 4.5);

  // ── PHASE 6: Smooth Exit Transition (6.6s – 7.2s) ──────────────────────────
  tl.to(t.stageFrame, {
    scale: 0.98,
    opacity: 0,
    duration: 0.45,
    ease: "power2.inOut",
  }, 6.6)
    .to(t.container, {
      opacity: 0,
      duration: 0.35,
      ease: "power1.in",
    }, 6.75);

  return tl;
}

/**
 * Ambient idle loops for lamps and speech bubble pulse during presentation hold.
 */
export function startPitchDeckIdleLoops(
  t: Pick<
    PitchDeckSceneTargets,
    "lampLeft" | "lampRight" | "lightBeamLeft" | "lightBeamRight" | "calloutBubble"
  >
): gsap.core.Tween[] {
  const loops: gsap.core.Tween[] = [];

  // Gentle sway on ceiling lamps
  if (t.lampLeft) {
    loops.push(
      gsap.to(t.lampLeft, {
        rotation: 1.2,
        transformOrigin: "382px 0px",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  if (t.lampRight) {
    loops.push(
      gsap.to(t.lampRight, {
        rotation: -1.2,
        transformOrigin: "1290px 0px",
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  // Light beam ambient breathing
  if (t.lightBeamLeft) {
    loops.push(
      gsap.to(t.lightBeamLeft, {
        opacity: 0.65,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }
  if (t.lightBeamRight) {
    loops.push(
      gsap.to(t.lightBeamRight, {
        opacity: 0.65,
        duration: 2.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  // Presenter speech bubble breathing
  if (t.calloutBubble) {
    loops.push(
      gsap.to(t.calloutBubble, {
        scale: 1.03,
        transformOrigin: "142px 56px",
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  return loops;
}

/**
 * Fast clean exit sequence when user clicks Skip or modal is dismissed.
 */
export function runPitchDeckExit(
  container: HTMLElement | null,
  idleLoops: gsap.core.Tween[],
  onComplete?: () => void
): void {
  idleLoops.forEach((tw) => tw.kill());

  if (!container) {
    onComplete?.();
    return;
  }

  gsap.to(container, {
    opacity: 0,
    scale: 0.98,
    duration: 0.35,
    ease: "power2.inOut",
    onComplete: () => {
      onComplete?.();
    },
  });
}
