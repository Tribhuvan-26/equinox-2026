// app/overlay-animations/animations/events/IplAuction/iplAuctionTimeline.ts
"use client";

import gsap from "gsap";

export interface IplAuctionTimelineTargets {
  container: HTMLElement | null;
  stageFrame: HTMLElement | null;
  skipButton: HTMLElement | null;
}

export interface IplAuctionTimelineOptions {
  onComplete?: () => void;
}

export function createIplAuctionTimeline(
  targets: IplAuctionTimelineTargets,
  options?: IplAuctionTimelineOptions
): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: {
      overwrite: "auto",
    },
    onComplete: () => {
      options?.onComplete?.();
    },
  });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const q = targets.container ? gsap.utils.selector(targets.container) : null;
  const elTopBrandingLeft = q ? q("#ipl-top-branding-left") : null;
  const elTopBrandingRight = q ? q("#ipl-top-branding-right") : null;
  const elTopBrandVersion = q ? q("#ipl-top-branding-left [class*='brandVersion']") : null;
  const elTopDateDot = q ? q("#ipl-top-branding-right [class*='dateDot']") : null;

  if (prefersReducedMotion) {
    if (targets.container) gsap.set(targets.container, { opacity: 1 });
    if (targets.stageFrame) gsap.set(targets.stageFrame, { opacity: 1 });
    if (elTopBrandingLeft && elTopBrandingRight) {
      gsap.set([elTopBrandingLeft, elTopBrandingRight], { opacity: 1, y: 0 });
    }

    tl.to({}, { duration: 5.5 });

    return tl;
  }

  // ---------------------------------------------------------
  // SVG elements
  // ---------------------------------------------------------

  const title = "#layer-title";
  const swoosh = "#layer-swoosh";
  const leftFlag = "#flag-left";
  const rightFlag = "#flag-right";
  const budget = "#budget-bar-group";

  const teams = Array.from(
    { length: 10 },
    (_, i) => `#team-unit-${i + 1}`
  );

  // ---------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------

  if (targets.container) {
    gsap.set(targets.container, { opacity: 0 });
  }

  if (targets.stageFrame) {
    gsap.set(targets.stageFrame, { opacity: 0 });
  }

  if (elTopBrandingLeft && elTopBrandingRight) {
    gsap.set([elTopBrandingLeft, elTopBrandingRight], { opacity: 0, y: -16 });
  }

  if (targets.skipButton) {
    gsap.set(targets.skipButton, {
      opacity: 0,
      y: -8,
    });
  }

  // Hide SVG elements before their entrances
  gsap.set(title, {
    opacity: 0,
    y: 35,
    scale: 0.94,
    transformOrigin: "center center",
  });

  gsap.set(swoosh, {
    opacity: 0,
    scale: 0.96,
    transformOrigin: "center center",
  });

  gsap.set(budget, {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transformOrigin: "center center",
  });

  gsap.set([leftFlag, rightFlag], {
    transformOrigin: "top center",
  });

  gsap.set(teams, {
    opacity: 0,
    y: 35,
    scale: 0.85,
    transformOrigin: "center center",
  });

  // ---------------------------------------------------------
  // 0.00s — Overlay entrance
  // ---------------------------------------------------------

  if (targets.container) {
    tl.to(
      targets.container,
      {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      },
      0
    );
  }

  if (targets.stageFrame) {
    tl.to(
      targets.stageFrame,
      {
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      },
      0
    );
  }

  // Top branding reveal (Equinox 2.0 on top-left, Oct 30-31 MLRIT on top-right)
  if (elTopBrandingLeft && elTopBrandingRight) {
    tl.to(
      [elTopBrandingLeft, elTopBrandingRight],
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.1,
        ease: "power2.out",
      },
      0.10
    );
  }

  // Living loop for top branding accents
  if (elTopBrandVersion && elTopBrandVersion.length > 0) {
    gsap.to(elTopBrandVersion, {
      scale: 1.06,
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
  }
  if (elTopDateDot && elTopDateDot.length > 0) {
    gsap.to(elTopDateDot, {
      scale: 1.35,
      opacity: 0.6,
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  if (targets.skipButton) {
    tl.to(
      targets.skipButton,
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      0.15
    );
  }

  // ---------------------------------------------------------
  // 0.20s — Background swoosh
  // ---------------------------------------------------------

  tl.to(
    swoosh,
    {
      opacity: 1,
      scale: 1,
      duration: 0.65,
      ease: "power2.out",
    },
    0.2
  );

  // ---------------------------------------------------------
  // 0.35s — Title entrance
  // ---------------------------------------------------------

  tl.to(
    title,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "back.out(1.4)",
    },
    0.35
  );

  // ---------------------------------------------------------
  // 0.60s — Budget badge
  // ---------------------------------------------------------

  tl.to(
    budget,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "back.out(1.3)",
    },
    0.6
  );

  // ---------------------------------------------------------
  // 0.80s — Flags subtle movement
  // ---------------------------------------------------------

  tl.to(
    leftFlag,
    {
      rotation: 2.5,
      duration: 0.45,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 3,
    },
    0.8
  );

  tl.to(
    rightFlag,
    {
      rotation: -2.5,
      duration: 0.45,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 3,
    },
    0.9
  );

  // ---------------------------------------------------------
  // 0.90s → 2.80s — Teams enter sequentially
  // ---------------------------------------------------------

  teams.forEach((team, index) => {
    const start = 0.9 + index * 0.16;

    tl.to(
      team,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.5)",
      },
      start
    );
  });

  // ---------------------------------------------------------
  // 2.75s — Small emphasis pulse across completed teams
  // ---------------------------------------------------------

  tl.to(
    teams,
    {
      scale: 1.025,
      duration: 0.18,
      ease: "power1.out",
      yoyo: true,
      repeat: 1,
      stagger: 0.035,
    },
    2.75
  );

  // ---------------------------------------------------------
  // 3.20s — Hold completed poster
  // ---------------------------------------------------------

  tl.to({}, { duration: 1.5 }, 3.2);

  // ---------------------------------------------------------
  // 4.70s — Outro
  // ---------------------------------------------------------

  if (targets.stageFrame) {
    tl.to(
      targets.stageFrame,
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      },
      4.7
    );
  }

  if (targets.container) {
    tl.to(
      targets.container,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      5.05
    );
  }

  tl.set({}, {}, 5.3);

  return tl;
}