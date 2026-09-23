// app/overlay-animations/animations/events/ECellMeet/eCellMeetTimeline.ts
import gsap from "gsap";

export interface ECellMeetTimelineTargets {
  container: HTMLElement | null;
  skipButton?: HTMLElement | null;
  svg?: SVGSVGElement | null;
}

export interface ECellMeetTimelineOptions {
  onComplete?: () => void;
  loop?: boolean;
}

/**
 * Master GSAP timeline for "The E-CELL Meet" Animation.
 *
 * Synchronized ~5-Second Master Sequence:
 * 0.00 – 0.60: INNER TRIANGLES & initial branding/ambient dots.
 * 0.50 – 1.10: OUTER TRIANGLES (appear after inner triangles settle).
 * 0.20 – 2.20: NETWORK CONNECTIONS (sequential line drawing with balanced left/right rhythm).
 * 1.00 – 2.00: PEOPLE GROUP (enters subtly and settles completely inside upper arc).
 * 1.80 – 2.70: "E-CELL" title reveals and settles.
 * 2.30 – 3.20: "MEET" title reveals and settles.
 * 3.10 – 3.80: "CONNECT" appears.
 * 3.30 – 4.00: "COLLABORATE" appears + bullet 1.
 * 3.50 – 4.20: "CREATE" appears + bullet 2 + side lines draw outward without overlapping text.
 * 4.20 – 5.00: Final network/node settle + stable hold with resting idle motion.
 */
export function createECellMeetTimeline(
  targets: ECellMeetTimelineTargets,
  options: ECellMeetTimelineOptions = {}
): gsap.core.Timeline {
  const { onComplete, loop = false } = options;
  const { container, skipButton } = targets;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  if (!container) return tl;

  // Accessibility: prefers-reduced-motion check
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    gsap.set(container, { opacity: 0 });
    if (skipButton) gsap.set(skipButton, { opacity: 1, pointerEvents: "auto" });

    tl.to(container, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
    tl.addLabel("settled", 0.35);
    tl.addLabel("exit", 5.0);
    tl.to(container, { opacity: 0, duration: 0.35, ease: "power1.in" }, "exit");
    return tl;
  }

  const q = gsap.utils.selector(container);

  // 1. Branding & Background Elements
  const elBrandingLeft = q("#ecell-top-branding-left");
  const elBrandingRight = q("#ecell-top-branding-right");
  const elAmbientDots = q("#ecell-ambient-dots circle");

  // 2. Corner Chevrons & Clouds & Triangles (Inner vs Outer)
  const elChevronBLBlue = q("#bl-chevron-blue");
  const elChevronBRBlue = q("#br-chevron-blue");
  const elChevronBLGreen = q("#bl-chevron-green");
  const elChevronBRGreen = q("#br-chevron-green");
  const elCloudLeft = q("#cloud-left");
  const elCloudRight = q("#cloud-right");
  const elTrianglesInner = q("#ecell-triangles-inner polygon");
  const elTrianglesOuter = q("#ecell-triangles-outer polygon");

  // 3. The 7 Institution Nodes
  const elNode1 = q("#college-node-1"); // Top-Left (Blue)
  const elNode2 = q("#college-node-2"); // Mid-Left (Green)
  const elNode3 = q("#college-node-3"); // Bottom-Left (Blue)
  const elNode4 = q("#college-node-4"); // Bottom-Center (Blue)
  const elNode5 = q("#college-node-5"); // Top-Right (Green)
  const elNode6 = q("#college-node-6"); // Mid-Right (Blue)
  const elNode7 = q("#college-node-7"); // Bottom-Right (Green)

  // 4. Connecting Lines (Solid conduits & progressive clip rects for dotted lines)
  const elLine1 = q("#net-line-1");
  const elClipDot1 = q("#clip-rect-dot-1"); // Level 1 Left dotted
  const elLine5 = q("#net-line-5");
  const elClipDot3 = q("#clip-rect-dot-3"); // Level 1 Right dotted

  const elLine2 = q("#net-line-2");
  const elClipDot2 = q("#clip-rect-dot-2"); // Level 2 Left dotted
  const elLine6 = q("#net-line-6");
  const elClipDot4 = q("#clip-rect-dot-4"); // Level 2 Right dotted

  const elLine3 = q("#net-line-3");
  const elLine7 = q("#net-line-7");
  const elUpperArc = q("#upper-arc-path");

  // 5. Junction / Node Dots
  const elDot1 = q("#net-dot-1");
  const elDot2 = q("#net-dot-2");
  const elDot3 = q("#net-dot-3");
  const elDot5 = q("#net-dot-5");
  const elDot6 = q("#net-dot-6");
  const elDot7 = q("#net-dot-7");
  const elArcDotLeft = q("#arc-dot-left");
  const elArcDotMidLeft = q("#arc-dot-mid-left");
  const elArcDotTop = q("#arc-dot-top");
  const elArcDotMidRight = q("#arc-dot-mid-right");
  const elArcDotRight = q("#arc-dot-right");
  const elPulseDots = q("#ecell-traveling-dots circle");

  // 6. Upper People Group (Framed Comfortably Inside Upper Arc Container)
  // Note: Permanently STATIC and centered inside arc — no animation/translation
  const _elPeople = q("#ecell-people-group");

  // 7. Dominant Center Title
  const elTitleECell = q("#title-ecell");
  const elTitleMeet = q("#title-meet");

  // 8. Subtitle Elements (Separated Words, Bullets & Lines)
  const elWordConnect = q("#sub-word-connect");
  const elDotSub1 = q("#sub-dot-1");
  const elWordCollaborate = q("#sub-word-collaborate");
  const elDotSub2 = q("#sub-dot-2");
  const elWordCreate = q("#sub-word-create");
  const elSubLineLeft = q("#sub-line-left");
  const elSubLineRight = q("#sub-line-right");

  // =========================================================================
  // INITIAL ZERO / RESET STATES
  // =========================================================================
  gsap.set(container, { opacity: 1, backgroundColor: "#2A2A2A" });
  if (skipButton) gsap.set(skipButton, { opacity: 0, y: -10 });

  // Top branding headers
  gsap.set([elBrandingLeft, elBrandingRight], { opacity: 0, y: -10 });

  // Ambient dots
  elAmbientDots.forEach((dot, idx) => {
    const dx = (idx % 2 === 0 ? -1 : 1) * (15 + (idx * 4) % 20);
    const dy = (idx % 3 === 0 ? -1 : 1) * (10 + (idx * 5) % 15);
    gsap.set(dot, { opacity: 0, scale: 0.1, x: dx, y: dy, transformOrigin: "center center" });
  });

  // Corner chevrons: Blue outer and Green inner separate initial offsets
  gsap.set(elChevronBLBlue, { x: -90, y: 45, opacity: 0 });
  gsap.set(elChevronBRBlue, { x: 90, y: 45, opacity: 0 });
  gsap.set(elChevronBLGreen, { x: -60, y: 30, opacity: 0 });
  gsap.set(elChevronBRGreen, { x: 60, y: 30, opacity: 0 });

  // Clouds
  gsap.set(elCloudLeft, { x: -50, opacity: 0 });
  gsap.set(elCloudRight, { x: 50, opacity: 0 });

  // Decorative triangles: Inner vs Outer initial states
  gsap.set(elTrianglesInner, {
    opacity: 0,
    scale: 0.2,
    transformOrigin: "center center",
  });
  gsap.set(elTrianglesOuter, {
    opacity: 0,
    scale: 0.2,
    transformOrigin: "center center",
  });

  // Institution Nodes (Circles + Icons)
  const allNodes = [elNode1, elNode2, elNode3, elNode4, elNode5, elNode6, elNode7];
  allNodes.forEach((node) => {
    gsap.set(node, { opacity: 0, scale: 0.2 });
  });

  // Solid Lines setup for progressive SVG line drawing
  const allSolidLines = [
    elLine1,
    elLine5,
    elLine2,
    elLine6,
    elLine3,
    elLine7,
  ];

  allSolidLines.forEach((line) => {
    if (!line || line.length === 0) return;
    const l = line[0] as unknown as SVGLineElement;
    const x1 = parseFloat(l.getAttribute("x1") || "0");
    const y1 = parseFloat(l.getAttribute("y1") || "0");
    const x2 = parseFloat(l.getAttribute("x2") || "0");
    const y2 = parseFloat(l.getAttribute("y2") || "0");
    const len = Math.hypot(x2 - x1, y2 - y1) || 120;
    gsap.set(l, {
      strokeDasharray: len,
      strokeDashoffset: len,
      opacity: 0,
    });
  });

  // Clip rects for dotted lines: start with width = 0
  gsap.set([elClipDot1, elClipDot2, elClipDot3, elClipDot4], {
    attr: { width: 0 },
  });

  // Upper Arc setup for drawing
  if (elUpperArc && elUpperArc.length > 0) {
    const arcPath = elUpperArc[0] as unknown as SVGPathElement;
    const arcLen = arcPath.getTotalLength ? arcPath.getTotalLength() : 445;
    gsap.set(arcPath, {
      strokeDasharray: arcLen,
      strokeDashoffset: arcLen,
      opacity: 0,
    });
  }

  // Subtitle decorative lines setup for outward draw
  [elSubLineLeft, elSubLineRight].forEach((line) => {
    if (!line || line.length === 0) return;
    const l = line[0] as unknown as SVGLineElement;
    const x1 = parseFloat(l.getAttribute("x1") || "0");
    const x2 = parseFloat(l.getAttribute("x2") || "0");
    const len = Math.abs(x2 - x1) || 32;
    gsap.set(l, {
      strokeDasharray: len,
      strokeDashoffset: len,
      opacity: 0,
    });
  });

  // Junction dots
  const allDots = [
    elDot1,
    elDot2,
    elDot3,
    elDot5,
    elDot6,
    elDot7,
    elArcDotLeft,
    elArcDotMidLeft,
    elArcDotTop,
    elArcDotMidRight,
    elArcDotRight,
  ];
  allDots.forEach((dot) => {
    gsap.set(dot, { opacity: 0, scale: 0, transformOrigin: "center center" });
  });

  if (elPulseDots && elPulseDots.length > 0) {
    gsap.set(elPulseDots, { opacity: 0 });
  }

  // Dominant Title elements initial states
  gsap.set(elTitleECell, { opacity: 0, y: 16, scale: 0.97, transformOrigin: "512px 278px" });
  gsap.set(elTitleMeet, { opacity: 0, y: 16, scale: 0.97, transformOrigin: "512px 398px" });

  // Subtitle Words and Dots initial states
  gsap.set([elWordConnect, elWordCollaborate, elWordCreate], {
    opacity: 0,
    scale: 0.96,
  });
  gsap.set([elDotSub1, elDotSub2], {
    opacity: 0,
    scale: 0,
    transformOrigin: "center center",
  });

  // =========================================================================
  // MASTER TIMELINE: CONTINUOUS, POLISHED & FAST (~2.55 SECONDS TOTAL)
  // Flow:
  // 1. Bottom/side elements (Blue outer triangle, then Green inner triangle)
  // 2. Buildings + Connections (Level 1 → Level 2 → Level 3, locking on arrival)
  // 3. Title (E-CELL and MEET smooth entrance, followed by subtitle)
  // 4. Remaining decorative elements
  // 5. Final Triangles (Inner then Outer)
  // 6. Settle immediately into completely static state
  // =========================================================================

  // [0.00 – 0.50s] Phase 1: Context & Bottom/Side Elements
  tl.to(
    [elBrandingLeft, elBrandingRight],
    {
      opacity: 1,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
      stagger: 0.05,
    },
    0.00
  );

  if (skipButton) {
    tl.to(
      skipButton,
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      0.05
    );
  }

  tl.to(
    elAmbientDots,
    {
      opacity: (idx) => [0.65, 0.75, 0.6, 0.8, 0.65, 0.55][idx % 6],
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.38,
      ease: "power2.out",
      stagger: 0.02,
    },
    0.05
  );

  tl.to(
    [elCloudLeft, elCloudRight],
    {
      x: 0,
      opacity: 0.95,
      duration: 0.38,
      ease: "power2.out",
    },
    0.08
  );

  // 1) Bottom Corner Triangles: Blue outer triangle enters first
  tl.to(
    [elChevronBLBlue, elChevronBRBlue],
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.38,
      ease: "power2.out",
    },
    0.05
  );

  // 2) Green inner triangle enters immediately after it
  tl.to(
    [elChevronBLGreen, elChevronBRGreen],
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    0.20
  );

  // =========================================================================
  // Phase 2: Buildings + Connections (Level 1 → Level 2 → Level 3)
  // Continuous, sequential entrances with matching lines, then locked.
  // =========================================================================

  // --- LEVEL 1 (0.35s – 0.78s) ---
  // Top buildings enter smoothly
  tl.to(
    elNode1,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    0.35
  );

  tl.to(
    elNode5,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    0.38
  );

  // Synchronized Level 1 connections
  tl.to(
    [elLine1, elLine5],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.28,
      ease: "power2.out",
      stagger: 0.02,
    },
    0.44
  );

  tl.to(
    [elClipDot1, elClipDot3],
    {
      attr: { width: 85 },
      duration: 0.30,
      ease: "power2.out",
    },
    0.44
  );

  tl.to(
    elUpperArc,
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.32,
      ease: "power2.inOut",
    },
    0.46
  );

  tl.to(
    [elDot1, elDot5, elArcDotLeft, elArcDotRight, elArcDotMidLeft, elArcDotMidRight, elArcDotTop],
    {
      opacity: 1,
      scale: 1,
      duration: 0.18,
      ease: "back.out(1.8)",
      stagger: 0.02,
    },
    0.58
  );

  // --- LEVEL 2 (0.72s – 1.15s) ---
  // Mid buildings enter smoothly
  tl.to(
    elNode2,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    0.72
  );

  tl.to(
    elNode6,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    0.75
  );

  // Synchronized Level 2 connections
  tl.to(
    [elLine2, elLine6],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.28,
      ease: "power2.out",
      stagger: 0.02,
    },
    0.80
  );

  tl.to(
    [elClipDot2, elClipDot4],
    {
      attr: { width: 110 },
      duration: 0.30,
      ease: "power2.out",
    },
    0.80
  );

  tl.to(
    [elDot2, elDot6],
    {
      opacity: 1,
      scale: 1,
      duration: 0.18,
      ease: "back.out(1.8)",
    },
    0.92
  );

  // --- LEVEL 3 (1.08s – 1.50s) ---
  // Bottom buildings enter smoothly
  tl.to(
    elNode3,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    1.08
  );

  tl.to(
    elNode7,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    1.11
  );

  tl.to(
    elNode4,
    {
      opacity: 1,
      scale: 1,
      duration: 0.30,
      ease: "power2.out",
    },
    1.14
  );

  // Synchronized Level 3 connections
  tl.to(
    [elLine3, elLine7],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.28,
      ease: "power2.out",
      stagger: 0.02,
    },
    1.18
  );

  tl.to(
    [elDot3, elDot7],
    {
      opacity: 1,
      scale: 1,
      duration: 0.18,
      ease: "back.out(1.8)",
    },
    1.30
  );

  // =========================================================================
  // Phase 3: Title Text Animation (1.42s – 1.85s)
  // Clean, subtle entrance without bouncing; locks permanently.
  // =========================================================================
  tl.to(
    elTitleECell,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.38,
      ease: "power3.out",
    },
    1.42
  );

  tl.to(
    elTitleMeet,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.38,
      ease: "power3.out",
    },
    1.52
  );

  // =========================================================================
  // Phase 4: Remaining Decorative Elements / Subtitle (1.75s – 2.05s)
  // =========================================================================
  tl.to(
    [elWordConnect, elDotSub1, elWordCollaborate, elDotSub2, elWordCreate],
    {
      opacity: 1,
      scale: 1,
      duration: 0.26,
      ease: "power2.out",
      stagger: 0.03,
    },
    1.75
  );

  tl.to(
    [elSubLineLeft, elSubLineRight],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.24,
      ease: "power2.out",
    },
    1.88
  );

  // =========================================================================
  // Phase 5: Final Triangles (Inner First, Then Outer) (2.05s – 2.50s)
  // =========================================================================
  // Inner triangles entrance
  tl.to(
    elTrianglesInner,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
      stagger: 0.03,
    },
    2.05
  );

  // Outer triangles entrance — strictly AFTER inner completes
  tl.to(
    elTrianglesOuter,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
      stagger: 0.04,
    },
    2.25
  );

  // =========================================================================
  // Phase 6: [2.55s] FINAL SETTLE & STATIC LOCK
  // Everything settles and remains COMPLETELY STATIC.
  // Zero secondary movement, zero bounce, zero drift.
  // =========================================================================
  tl.addLabel("settled", 2.55);

  if (!loop) {
    tl.addLabel("hold", 6.5);
    tl.addLabel("exit", 7.5);

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      "exit"
    );
  }

  return tl;
}

/**
 * Fast-forwards the timeline directly to exit on user skip / dismiss.
 */
export function skipECellMeetTimelineToExit(
  tl: gsap.core.Timeline | null
): void {
  if (!tl) return;
  const exitTime = tl.labels["exit"] ?? 6.0;
  if (tl.time() < exitTime) {
    tl.tweenTo(exitTime, {
      duration: 0.22,
      ease: "power2.in",
      overwrite: "auto",
    });
  } else {
    tl.progress(1);
  }
}
