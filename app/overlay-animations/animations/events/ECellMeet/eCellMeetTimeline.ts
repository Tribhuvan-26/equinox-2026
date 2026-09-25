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
 * Synchronized ~3-Second Master Sequence:
 * 0.00 – 0.25: Initial branding, ambient dots, clouds, and corner chevrons.
 * 0.24 – 0.98: NETWORK CONNECTIONS & INSTITUTION NODES (Level 1 → Level 2 → Level 3).
 * 0.94 – 1.25: "E-CELL" & "MEET" title reveals and settles permanently.
 * 1.18 – 1.42: Subtitle words ("CONNECT • COLLABORATE • CREATE") and decorative lines.
 * 1.38 – 1.68: Final geometric triangles (Inner then Outer).
 * 1.70: Complete static settle.
 * 2.70 – 3.05: Clean fade-out exit.
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

    tl.to(container, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0);
    tl.addLabel("settled", 0.3);
    tl.addLabel("exit", 2.2);
    tl.to(container, { opacity: 0, duration: 0.3, ease: "power1.in" }, "exit");
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
  const elLine7Link = q("#net-link-7");
  const allSolidLines = [
    elLine1,
    elLine5,
    elLine2,
    elLine6,
    elLine3,
    elLine7,
    elLine7Link,
  ];

  allSolidLines.forEach((line) => {
    if (!line || line.length === 0) return;
    const l = line[0] as unknown as SVGGeometryElement;
    const len =
      typeof l.getTotalLength === "function"
        ? l.getTotalLength()
        : Math.hypot(
            parseFloat(l.getAttribute("x2") || "0") - parseFloat(l.getAttribute("x1") || "0"),
            parseFloat(l.getAttribute("y2") || "0") - parseFloat(l.getAttribute("y1") || "0")
          ) || 120;
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
  // MASTER TIMELINE: CONTINUOUS, POLISHED & FAST (~1.70s Settle + Clean Exit)
  // Flow:
  // 1. Bottom/side elements (Blue outer chevron, then Green inner chevron)
  // 2. Buildings + Connections (Level 1 → Level 2 → Level 3, locking on arrival)
  // 3. Title (E-CELL and MEET smooth entrance, followed by subtitle)
  // 4. Remaining decorative elements
  // 5. Final Triangles (Inner then Outer)
  // 6. Settle immediately into completely static state, brief hold, then exit
  // =========================================================================

  // [0.00 – 0.30s] Phase 1: Context & Bottom/Side Elements
  tl.to(
    [elBrandingLeft, elBrandingRight],
    {
      opacity: 1,
      y: 0,
      duration: 0.22,
      ease: "power2.out",
      stagger: 0.04,
    },
    0.00
  );

  if (skipButton) {
    tl.to(
      skipButton,
      {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: "power2.out",
      },
      0.03
    );
  }

  tl.to(
    elAmbientDots,
    {
      opacity: (idx) => [0.65, 0.75, 0.6, 0.8, 0.65, 0.55][idx % 6],
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.26,
      ease: "power2.out",
      stagger: 0.015,
    },
    0.03
  );

  tl.to(
    [elCloudLeft, elCloudRight],
    {
      x: 0,
      opacity: 0.95,
      duration: 0.26,
      ease: "power2.out",
    },
    0.05
  );

  // 1) Bottom Corner Chevrons: Blue outer triangle enters first
  tl.to(
    [elChevronBLBlue, elChevronBRBlue],
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.26,
      ease: "power2.out",
    },
    0.04
  );

  // 2) Green inner triangle enters immediately after it
  tl.to(
    [elChevronBLGreen, elChevronBRGreen],
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.24,
      ease: "power2.out",
    },
    0.14
  );

  // =========================================================================
  // Phase 2: Buildings + Connections (Level 1 → Level 2 → Level 3)
  // Continuous, sequential entrances with matching lines, then locked.
  // =========================================================================

  // --- LEVEL 1 (0.24s – 0.54s) ---
  // Top buildings enter smoothly
  tl.to(
    elNode1,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.24
  );

  tl.to(
    elNode5,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.26
  );

  // Synchronized Level 1 connections
  tl.to(
    [elLine1, elLine5],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.20,
      ease: "power2.out",
      stagger: 0.02,
    },
    0.30
  );

  tl.to(
    [elClipDot1, elClipDot3],
    {
      attr: { width: 140 },
      duration: 0.22,
      ease: "power2.out",
    },
    0.30
  );

  tl.to(
    elUpperArc,
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.24,
      ease: "power2.inOut",
    },
    0.32
  );

  tl.to(
    [elDot1, elDot5, elArcDotLeft, elArcDotRight, elArcDotMidLeft, elArcDotMidRight, elArcDotTop],
    {
      opacity: 1,
      scale: 1,
      duration: 0.14,
      ease: "back.out(1.5)",
      stagger: 0.015,
    },
    0.40
  );

  // --- LEVEL 2 (0.48s – 0.74s) ---
  // Mid buildings enter smoothly
  tl.to(
    elNode2,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.48
  );

  tl.to(
    elNode6,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.50
  );

  // Synchronized Level 2 connections
  tl.to(
    [elLine2, elLine6],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.20,
      ease: "power2.out",
      stagger: 0.02,
    },
    0.54
  );

  tl.to(
    [elClipDot2, elClipDot4],
    {
      attr: { width: 140 },
      duration: 0.22,
      ease: "power2.out",
    },
    0.54
  );

  tl.to(
    [elDot2, elDot6],
    {
      opacity: 1,
      scale: 1,
      duration: 0.14,
      ease: "back.out(1.5)",
    },
    0.62
  );

  // --- LEVEL 3 (0.70s – 0.98s) ---
  // Bottom buildings enter smoothly
  tl.to(
    elNode3,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.70
  );

  tl.to(
    elNode7,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.72
  );

  tl.to(
    elNode4,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.74
  );

  // Synchronized Level 3 connections
  tl.to(
    [elLine3, elLine7, elLine7Link],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.20,
      ease: "power2.out",
      stagger: 0.02,
    },
    0.78
  );

  tl.to(
    [elDot3, elDot7],
    {
      opacity: 1,
      scale: 1,
      duration: 0.14,
      ease: "back.out(1.5)",
    },
    0.86
  );

  // =========================================================================
  // Phase 3: Title Text Animation (0.94s – 1.25s)
  // Clean, subtle entrance without bouncing; locks permanently.
  // =========================================================================
  tl.to(
    elTitleECell,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.28,
      ease: "power3.out",
    },
    0.94
  );

  tl.to(
    elTitleMeet,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.28,
      ease: "power3.out",
    },
    1.02
  );

  // =========================================================================
  // Phase 4: Remaining Decorative Elements / Subtitle (1.18s – 1.42s)
  // =========================================================================
  tl.to(
    [elWordConnect, elDotSub1, elWordCollaborate, elDotSub2, elWordCreate],
    {
      opacity: 1,
      scale: 1,
      duration: 0.20,
      ease: "power2.out",
      stagger: 0.02,
    },
    1.18
  );

  tl.to(
    [elSubLineLeft, elSubLineRight],
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.18,
      ease: "power2.out",
    },
    1.28
  );

  // =========================================================================
  // Phase 5: Final Triangles (Inner First, Then Outer) (1.38s – 1.68s)
  // =========================================================================
  // Inner triangles entrance
  tl.to(
    elTrianglesInner,
    {
      opacity: 1,
      scale: 1,
      duration: 0.16,
      ease: "power2.out",
      stagger: 0.02,
    },
    1.38
  );

  // Outer triangles entrance — strictly AFTER inner completes
  tl.to(
    elTrianglesOuter,
    {
      opacity: 1,
      scale: 1,
      duration: 0.16,
      ease: "power2.out",
      stagger: 0.02,
    },
    1.50
  );

  // =========================================================================
  // Phase 6: [1.70s] FINAL SETTLE & STATIC LOCK
  // Everything settles and remains COMPLETELY STATIC.
  // Minimal delay after last element appears before clean exit.
  // =========================================================================
  tl.addLabel("settled", 1.70);

  if (!loop) {
    tl.addLabel("hold", 2.70);
    tl.addLabel("exit", 2.70);

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.35,
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
  const exitTime = tl.labels["exit"] ?? 2.70;
  if (tl.time() < exitTime) {
    tl.tweenTo(exitTime, {
      duration: 0.20,
      ease: "power2.in",
      overwrite: "auto",
    });
  } else {
    tl.progress(1);
  }
}
