// app/overlay-animations/animations/events/IplAuction/iplAuctionTimeline.ts
import gsap from "gsap";

export interface IplAuctionTimelineTargets {
  container: HTMLElement | null;
  skipButton: HTMLElement | null;
  tag: HTMLElement | null;
  headlineBlack: HTMLElement | null;
  headlineWhite: HTMLElement | null;
  badge: HTMLElement | null;
  divider: HTMLElement | null;
  bidBlock: HTMLElement | null;
  bidValue: HTMLElement | null;
  paddles: HTMLElement[];
}

export interface IplAuctionTimelineOptions {
  onComplete?: () => void;
}

/**
 * Master GSAP timeline for the IPL Auction overlay, built from the same
 * page building blocks used on /events/ipl-auction itself
 * (category tag, black/white word-pair headline, official badge card,
 * blueprint divider) so the animation reads as the real page waking up
 * rather than a separate generic "auction house" scene.
 */
export function createIplAuctionTimeline(
  targets: IplAuctionTimelineTargets,
  options: IplAuctionTimelineOptions = {}
): gsap.core.Timeline {
  const { onComplete } = options;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  const {
    container,
    skipButton,
    tag,
    headlineBlack,
    headlineWhite,
    badge,
    divider,
    bidBlock,
    bidValue,
    paddles,
  } = targets;

  // Initial state
  if (container) gsap.set(container, { opacity: 0 });
  if (skipButton) gsap.set(skipButton, { opacity: 0, pointerEvents: "none" });
  if (tag) gsap.set(tag, { opacity: 0, y: -12, scale: 0.94 });
  if (headlineBlack) gsap.set(headlineBlack, { opacity: 0, scale: 0.85 });
  if (headlineWhite) gsap.set(headlineWhite, { opacity: 0, y: 24 });
  if (badge) gsap.set(badge, { opacity: 0, scale: 0.85 });
  if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
  if (bidBlock) gsap.set(bidBlock, { opacity: 0, y: 20 });
  if (paddles.length > 0) gsap.set(paddles, { opacity: 0, y: 24 });

  // ENTRANCE
  tl.addLabel("entrance", 0);
  if (container) {
    tl.to(container, { opacity: 1, duration: 0.28, ease: "power1.out" }, "entrance");
  }
  if (skipButton) {
    tl.to(
      skipButton,
      { opacity: 1, pointerEvents: "auto", duration: 0.2, ease: "power1.out" },
      "entrance+=0.15"
    );
  }
  if (tag) {
    tl.to(tag, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.7)" }, "entrance+=0.1");
  }

  // HEADLINE
  tl.addLabel("headline", 0.45);
  if (headlineBlack) {
    tl.to(headlineBlack, { opacity: 1, scale: 1, duration: 0.36, ease: "back.out(1.8)" }, "headline");
  }
  if (headlineWhite) {
    tl.to(headlineWhite, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "headline+=0.12");
  }

  // BADGE + DIVIDER
  tl.addLabel("badge", 0.95);
  if (badge) {
    tl.to(badge, { opacity: 1, scale: 1, duration: 0.34, ease: "back.out(1.7)" }, "badge");
  }
  if (divider) {
    tl.to(divider, { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, "badge+=0.1");
  }

  // BID COUNTER
  tl.addLabel("bid", 1.5);
  if (bidBlock) {
    tl.to(bidBlock, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "bid");
  }
  if (bidValue) {
    const counter = { value: 20 };
    tl.to(
      counter,
      {
        value: 850,
        duration: 0.9,
        ease: "power1.out",
        onUpdate: () => {
          const lakhs = Math.round(counter.value);
          bidValue.textContent =
            lakhs >= 100 ? `₹ ${(lakhs / 100).toFixed(2)} CR` : `₹ ${lakhs} L`;
        },
      },
      "bid+=0.1"
    );
  }

  // PADDLES
  tl.addLabel("paddles", 2.3);
  if (paddles.length > 0) {
    tl.to(
      paddles,
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "back.out(1.6)" },
      "paddles"
    );
  }

  // HOLD
  tl.addLabel("hold", 2.9);
  if (badge) {
    tl.to(badge, { y: -4, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, "hold");
  }

  // EXIT
  tl.addLabel("exit", 3.5);
  const fadeOutTargets: HTMLElement[] = [];
  if (tag) fadeOutTargets.push(tag);
  if (headlineBlack) fadeOutTargets.push(headlineBlack);
  if (headlineWhite) fadeOutTargets.push(headlineWhite);
  if (badge) fadeOutTargets.push(badge);
  if (divider) fadeOutTargets.push(divider);
  if (bidBlock) fadeOutTargets.push(bidBlock);
  paddles.forEach((p) => fadeOutTargets.push(p));

  if (fadeOutTargets.length > 0) {
    tl.to(fadeOutTargets, { opacity: 0, duration: 0.22, ease: "power2.in" }, "exit");
  }
  if (container) {
    tl.to(container, { opacity: 0, duration: 0.3, ease: "power2.in" }, "exit+=0.28");
  }

  return tl;
}

/**
 * Fast-forward timeline to the exit phase on user skip / dismiss.
 */
export function skipIplAuctionTimelineToExit(tl: gsap.core.Timeline | null): void {
  if (!tl) return;
  const exitTime = tl.labels["exit"];
  if (exitTime !== undefined) {
    if (tl.time() < exitTime) {
      tl.tweenTo("exit", { duration: 0.35, ease: "power2.in", overwrite: "auto" });
    }
  } else {
    tl.progress(1);
  }
}
