import { useState, useLayoutEffect, useEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useResponsiveViewBox(baseWidth: number, baseHeight: number) {
  const [viewBox, setViewBox] = useState(`0 0 ${baseWidth} ${baseHeight}`);

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const screenAspect = containerWidth / containerHeight;
      const baseAspect = baseWidth / baseHeight;

      if (screenAspect < baseAspect) {
        // Screen is narrower/taller than SVG (e.g. Mobile)
        // Keep width = baseWidth, expand height to match screen aspect ratio
        const newHeight = baseWidth / screenAspect;
        const yOffset = (baseHeight - newHeight) / 2;
        setViewBox(`0 ${yOffset} ${baseWidth} ${newHeight}`);
      } else {
        // Screen is wider than SVG (e.g. Ultrawide Desktop)
        // Keep height = baseHeight, expand width to match screen aspect ratio
        const newWidth = baseHeight * screenAspect;
        const xOffset = (baseWidth - newWidth) / 2;
        setViewBox(`${xOffset} 0 ${newWidth} ${baseHeight}`);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [baseWidth, baseHeight]);

  return viewBox;
}
