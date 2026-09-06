// chatbot/animations/eventAnimations.ts
// GSAP micro-animations for all 10 official Equinox sub-events

import gsap from "gsap";

/**
 * 1. Spotlight: Radial beam sweeps across from left to right with glow pulse
 */
export function playSpotlightAnimation(element: HTMLElement | null) {
  if (!element) return;
  const beam = element.querySelector(".spotlight-beam-shape");
  const glow = element.querySelector(".spotlight-glow-center");

  if (!beam) return;

  const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.8 });
  tl.fromTo(
    beam,
    { rotate: -32, opacity: 0.35, scaleY: 0.9 },
    { rotate: 32, opacity: 0.9, scaleY: 1.1, duration: 1.8, ease: "sine.inOut" }
  );

  if (glow) {
    tl.to(glow, { scale: 1.4, opacity: 1, duration: 0.9, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.4);
  }
}

/**
 * 2. Crossroads: Two intersecting paths crossing and flashing at the crossroads node
 */
export function playCrossroadsAnimation(element: HTMLElement | null) {
  if (!element) return;
  const lineH = element.querySelector(".cross-line-h");
  const lineV = element.querySelector(".cross-line-v");
  const node = element.querySelector(".cross-node");

  if (!lineH || !lineV) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  tl.fromTo(lineH, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, ease: "power2.out" })
    .fromTo(lineV, { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 0.7, ease: "power2.out" }, "-=0.4")
    .fromTo(node, { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.2")
    .to(node, { scale: 1, duration: 0.2 });
}

/**
 * 3. Startup Expo: Booth door unfolds with upward rocket launch spark
 */
export function playStartupExpoAnimation(element: HTMLElement | null) {
  if (!element) return;
  const rocket = element.querySelector(".expo-rocket-icon");
  const booth = element.querySelector(".expo-booth-door");
  const trail = element.querySelector(".expo-spark-trail");

  if (!rocket) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
  if (booth) {
    tl.fromTo(booth, { scaleY: 0, transformOrigin: "bottom center" }, { scaleY: 1, duration: 0.5, ease: "power2.out" });
  }
  tl.fromTo(
    rocket,
    { y: 15, opacity: 0, scale: 0.7 },
    { y: -18, opacity: 1, scale: 1.2, duration: 0.8, ease: "power3.out" }
  );
  if (trail) {
    tl.fromTo(trail, { scaleY: 0, opacity: 1 }, { scaleY: 1.5, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.6");
  }
}

/**
 * 4. Brand Battles: Opposing brand shields clash together with a spark impact
 */
export function playBrandBattlesAnimation(element: HTMLElement | null) {
  if (!element) return;
  const leftShield = element.querySelector(".brand-shield-left");
  const rightShield = element.querySelector(".brand-shield-right");
  const clashSpark = element.querySelector(".brand-clash-spark");

  if (!leftShield || !rightShield) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
  tl.fromTo(leftShield, { x: -28, opacity: 0.4 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" })
    .fromTo(rightShield, { x: 28, opacity: 0.4 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, 0);

  if (clashSpark) {
    tl.fromTo(clashSpark, { scale: 0, opacity: 1, rotate: 0 }, { scale: 1.8, opacity: 0, rotate: 90, duration: 0.4, ease: "power2.out" });
  }
}

/**
 * 5. IPL Auction: Rolling bid valuation counter and gavel strike bounce
 */
export function playIPLAuctionAnimation(element: HTMLElement | null) {
  if (!element) return;
  const gavel = element.querySelector(".ipl-gavel-icon");
  const counter = element.querySelector(".ipl-bid-val");

  if (!counter) return;

  const bids = ["₹ 20 L", "₹ 1.5 Cr", "₹ 5.25 Cr", "₹ 12.0 Cr!"];
  let bidIdx = 0;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
  bids.forEach((val) => {
    tl.call(() => {
      if (counter) counter.textContent = val;
    })
      .fromTo(counter, { scale: 0.8, opacity: 0.6 }, { scale: 1.15, opacity: 1, duration: 0.25, ease: "back.out(2)" })
      .to(counter, { scale: 1, duration: 0.15 });

    if (gavel) {
      tl.to(gavel, { rotate: -25, duration: 0.15, transformOrigin: "bottom right" })
        .to(gavel, { rotate: 0, duration: 0.1, ease: "bounce.out" });
    }
  });
}

/**
 * 6. Hustle Mania: Price tags and product cards shuffling & snapping into place
 */
export function playHustleManiaAnimation(element: HTMLElement | null) {
  if (!element) return;
  const card1 = element.querySelector(".hustle-card-1");
  const card2 = element.querySelector(".hustle-card-2");
  const card3 = element.querySelector(".hustle-card-3");

  if (!card1 || !card2 || !card3) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  tl.to(card1, { x: 14, rotate: 10, duration: 0.35, ease: "power2.inOut" })
    .to(card2, { x: -14, rotate: -10, duration: 0.35, ease: "power2.inOut" }, 0)
    .to(card3, { scale: 1.15, duration: 0.35, ease: "back.out(1.5)" }, 0.1)
    .to([card1, card2, card3], { x: 0, rotate: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }, "+=0.5");
}

/**
 * 7. Internship Drive: Candidate node linking to company node with connecting line tracer
 */
export function playInternshipDriveAnimation(element: HTMLElement | null) {
  if (!element) return;
  const line = element.querySelector(".intern-connect-line");
  const badge = element.querySelector(".intern-offer-badge");

  if (!line) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.3 });
  tl.fromTo(line, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" });

  if (badge) {
    tl.fromTo(badge, { scale: 0, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 0.3, ease: "back.out(2)" })
      .to(badge, { scale: 1, duration: 0.15 });
  }
}

/**
 * 8. Startup Poly: 3D Isometric dice rolling and landing on board square
 */
export function playStartupPolyAnimation(element: HTMLElement | null) {
  if (!element) return;
  const dice = element.querySelector(".poly-dice-icon");
  const tile = element.querySelector(".poly-board-tile");

  if (!dice) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
  tl.fromTo(
    dice,
    { y: -16, rotate: -70, scale: 0.8 },
    { y: 0, rotate: 0, scale: 1, duration: 0.65, ease: "bounce.out" }
  );

  if (tile) {
    tl.fromTo(tile, { scale: 0.9, opacity: 0.6 }, { scale: 1.1, opacity: 1, duration: 0.2, yoyo: true, repeat: 1 }, "-=0.2");
  }
}

/**
 * 9. E-Cell Meet: Network grid nodes sequentially lighting up around central hub
 */
export function playECellMeetAnimation(element: HTMLElement | null) {
  if (!element) return;
  const hub = element.querySelector(".ecell-hub");
  const nodes = element.querySelectorAll(".ecell-subnode");

  if (!hub || nodes.length === 0) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
  tl.fromTo(hub, { scale: 0.7, opacity: 0.5 }, { scale: 1.1, opacity: 1, duration: 0.4, ease: "back.out(2)" })
    .to(hub, { scale: 1, duration: 0.2 })
    .fromTo(
      nodes,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.12, duration: 0.35, ease: "back.out(1.8)" },
      "-=0.1"
    );
}

/**
 * 10. Pitch Deck: Pitch slide tilt & valuation graph bar surge
 */
export function playPitchDeckAnimation(element: HTMLElement | null) {
  if (!element) return;
  const bar1 = element.querySelector(".pitch-bar-1");
  const bar2 = element.querySelector(".pitch-bar-2");
  const bar3 = element.querySelector(".pitch-bar-3");
  const star = element.querySelector(".pitch-star");

  if (!bar1 || !bar2 || !bar3) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
  tl.fromTo([bar1, bar2, bar3], { scaleY: 0, transformOrigin: "bottom center" }, {
    scaleY: 1,
    stagger: 0.15,
    duration: 0.5,
    ease: "power3.out",
  });

  if (star) {
    tl.fromTo(star, { scale: 0, rotate: -45 }, { scale: 1.2, rotate: 0, duration: 0.3, ease: "back.out(2)" })
      .to(star, { scale: 1, duration: 0.15 });
  }
}

/**
 * Master dispatcher based on animationType
 */
export function triggerEventAnimation(type: string, container: HTMLElement | null) {
  if (!container) return;

  switch (type) {
    case "spotlight":
      playSpotlightAnimation(container);
      break;
    case "crossroads":
      playCrossroadsAnimation(container);
      break;
    case "startup-expo":
      playStartupExpoAnimation(container);
      break;
    case "brand-battles":
      playBrandBattlesAnimation(container);
      break;
    case "ipl-auction":
      playIPLAuctionAnimation(container);
      break;
    case "hustle-mania":
      playHustleManiaAnimation(container);
      break;
    case "internship-drive":
      playInternshipDriveAnimation(container);
      break;
    case "startup-poly":
      playStartupPolyAnimation(container);
      break;
    case "e-cell-meet":
      playECellMeetAnimation(container);
      break;
    case "pitch-deck":
      playPitchDeckAnimation(container);
      break;
    default:
      break;
  }
}
