"use client";

import {
    animate,
    cubicBezier,
    motion,
    useMotionValue,
} from "motion/react";
import type { Variants } from "motion/react";
import {
    memo,
    useEffect,
    useRef,
    useState,
} from "react";
import { cn } from "@/lib/utils";

// Smooth immediate appearance
const rowVariants: Variants = {
    initial: { opacity: 0, scale: 0.96 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: "easeOut" as const,
        },
    },
};

export const DraggableContainer = ({
    className,
    wrapperClassName,
    children,
    containerHeight = "h-dvh",
}: {
    className?: string;
    wrapperClassName?: string;
    children: React.ReactNode;
    containerHeight?: string;
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const [isDragging, setIsDragging] = useState(false);
    const handleIsDragging = () => setIsDragging(true);
    const handleIsNotDragging = () => setIsDragging(false);

    useEffect(() => {
        const getDims = () => {
            const el = ref.current;
            if (!el) return { width: 0, height: 0 };
            return {
                width: el.scrollWidth || el.offsetWidth,
                height: el.scrollHeight || el.offsetHeight,
            };
        };

        let dims = getDims();

        const observer = new ResizeObserver(() => {
            const d = getDims();
            if (d.width > 0 && d.height > 0) {
                dims = d;
            }
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        // Seamless continuous wrap without sudden jumps at 0:
        // The 4-quadrant layout is 2 quadrants wide and 2 quadrants high.
        // Each quadrant is exactly (dims.width / 2) wide and (dims.height / 2) high.
        const xDrag = x.on("change", (latest) => {
            if (dims.width <= 0) return;
            const halfW = dims.width / 2;
            if (latest < -halfW) {
                x.set(latest + Math.ceil((-latest - halfW) / halfW) * halfW);
            } else if (latest > 0) {
                x.set(latest - Math.ceil(latest / halfW) * halfW);
            }
        });

        const yDrag = y.on("change", (latest) => {
            if (dims.height <= 0) return;
            const halfH = dims.height / 2;
            if (latest < -halfH) {
                y.set(latest + Math.ceil((-latest - halfH) / halfH) * halfH);
            } else if (latest > 0) {
                y.set(latest - Math.ceil(latest / halfH) * halfH);
            }
        });

        const wrapperEl = wrapperRef.current;
        const handleWheelScroll = (event: WheelEvent) => {
            if (isDragging) return;
            event.preventDefault();

            // Check if trackpad gesture (continuous small deltas) vs stepped mouse wheel
            const isContinuousTrackpad =
                Math.abs(event.deltaY) < 50 && (Math.abs(event.deltaX) < 50 || event.deltaX !== 0);

            if (isContinuousTrackpad) {
                // High-precision trackpad 360-degree swipe in any direction (horizontal, vertical, diagonal)
                if (event.deltaX !== 0) {
                    x.set(x.get() - event.deltaX * 1.15);
                }
                if (event.deltaY !== 0) {
                    y.set(y.get() - event.deltaY * 1.15);
                }
            } else {
                // Stepped mouse wheel: smooth kinetic tween in any scrolled axis
                if (event.deltaX !== 0) {
                    animate(x, x.get() - event.deltaX * 1.4, {
                        type: "tween",
                        duration: 0.45,
                        ease: cubicBezier(0.18, 0.71, 0.11, 1),
                    });
                }
                if (event.deltaY !== 0) {
                    animate(y, y.get() - event.deltaY * 1.4, {
                        type: "tween",
                        duration: 0.45,
                        ease: cubicBezier(0.18, 0.71, 0.11, 1),
                    });
                }
            }
        };

        if (wrapperEl) {
            wrapperEl.addEventListener("wheel", handleWheelScroll, { passive: false });
        }

        return () => {
            observer.disconnect();
            xDrag();
            yDrag();
            if (wrapperEl) {
                wrapperEl.removeEventListener("wheel", handleWheelScroll);
            }
        };
    }, [x, y, isDragging]);

    return (
        <div
            ref={wrapperRef}
            className={cn(containerHeight, "overflow-hidden select-none touch-none", wrapperClassName)}
            style={{ touchAction: "none" }}
        >
            <motion.div
                className={cn(containerHeight, "overflow-hidden touch-none")}
                style={{ touchAction: "none" }}
            >
                <motion.div
                    className={cn(
                        "grid h-fit w-fit cursor-grab grid-cols-[repeat(2,max-content)] bg-[#141414] active:cursor-grabbing will-change-transform touch-none select-none",
                        className,
                    )}
                    style={{ x, y, touchAction: "none" }}
                    drag
                    dragMomentum={true}
                    dragElastic={0.06}
                    dragTransition={{
                        timeConstant: 220,
                        power: 0.35,
                        restDelta: 0,
                        bounceStiffness: 0,
                    }}
                    onPointerDown={handleIsDragging}
                    onPointerUp={handleIsNotDragging}
                    onPointerCancel={handleIsNotDragging}
                    ref={ref}
                >
                    {children}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const GridItem = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            className={cn("hover:cursor-pointer will-change-transform block shrink-0 select-none rounded-2xl", className)}
            variants={rowVariants}
            initial="initial"
            animate="animate"
        >
            {children}
        </motion.div>
    );
};

export const GridBody = memo(
    ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className?: string;
    }) => {
        // 8 columns x 4 rows = 32 items per quadrant, leaving zero empty slots!
        return (
            <>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "grid grid-cols-[repeat(8,max-content)] gap-6 p-6 sm:gap-8 sm:p-8 h-fit w-fit",
                            className,
                        )}
                    >
                        {children}
                    </div>
                ))}
            </>
        );
    },
);

GridBody.displayName = "GridBody";
