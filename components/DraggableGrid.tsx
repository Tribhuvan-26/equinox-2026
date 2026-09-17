// Draggable Grid — Originkit (Enhanced for Equinox 2026)

"use client"

import { motion, useMotionValue, animate } from "framer-motion"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"

export type GridItem = {
    image?: { src?: string; srcSet?: string; alt?: string }
    alt?: string
    title?: string
    category?: string
    year?: string
    description?: string
}

export interface DraggableGridProps {
    items?: GridItem[]
    columns?: number
    imageWidth?: number
    imageHeight?: number
    rounded?: number
    gap?: number
    enableWheel?: boolean
    placeholderColor?: string
    onItemClick?: (item: GridItem, index: number) => void
    style?: React.CSSProperties
    className?: string
}

export const defaultItems: GridItem[] = [
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/612d1402-0ad9-4135-3bbc-a30a6a252b00/w=800",
        },
        alt: "Equinox 1.0 Pitch Deck Finals",
        title: "Pitch Deck Grand Finals",
        category: "Pitch Deck",
        year: "2025",
        description: "Student founders presenting high-impact venture concepts before veteran venture capitalists and angel investors.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/6d2ad64a-102d-4eab-0efe-31479e34b500/w=800",
        },
        alt: "MetaLoop 36-Hour Hackathon",
        title: "MetaLoop AR/VR Hackathon",
        category: "Hackathon",
        year: "2025",
        description: "36 hours of non-stop adrenaline, rapid prototyping, and immersive technology engineering at MLRIT CIE.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/be854dd1-37aa-4fc7-f569-fdb948109300/w=800",
        },
        alt: "IPL Auction Bidding Arena",
        title: "IPL Auction War Room",
        category: "Competition",
        year: "2025",
        description: "High-voltage bidding, statistical valuation models, and strategic team formation in a simulated live auction room.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/51984031-9176-484b-f5e0-4af9a8e9ed00/w=800",
        },
        alt: "CIE Startup Expo",
        title: "Startup Demo Floor & Expo",
        category: "Expo",
        year: "2025",
        description: "Over 20+ incubated and early-stage student startups displaying live prototypes, traction decks, and user demos.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/34ce1842-4b7a-4d52-0302-38582c341700/w=800",
        },
        alt: "Crossroads Corporate Crisis Strategy",
        title: "Crossroads Case Challenge",
        category: "Strategy",
        year: "2025",
        description: "Delegates dissecting high-stakes corporate dilemmas, market disruptions, and ethical enterprise turnarounds.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/88369c6d-00cc-4ac9-74ca-0f0965e06300/w=800",
        },
        alt: "Brand Battles Championship",
        title: "Brand Battles PR Face-Off",
        category: "Competition",
        year: "2025",
        description: "Ad-hoc corporate debate defending controversial marketing pivots and tackling hostile takeovers.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/aeaa0756-9647-4f6c-d900-204bd25e4a00/w=800",
        },
        alt: "E-Cell Leaders Conclave",
        title: "E-Cell Conclave & Summit",
        category: "Networking",
        year: "2025",
        description: "25+ collegiate Entrepreneurship Cells converging to build cross-campus incubation initiatives and venture networks.",
    },
    {
        image: {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/316d1761-fd79-4ca9-b8d4-f2bb20521a00/w=800",
        },
        alt: "Inventron Grand Awards Ceremony",
        title: "Inventron Gala & Felicitation",
        category: "Awards",
        year: "2025",
        description: "Honoring national winners, presenting grand cash prizes, and celebrating the perseverance of young builders.",
    },
]

function getItemColor(index: number) {
    const hue = (index * 137.508) % 360
    return `hsl(${hue}, 45%, 30%)`
}

function mulberry32(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) >>> 0
        let t = a
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function fillAndShuffle<T>(items: T[], target: number, seed: number): T[] {
    if (items.length === 0) return []
    const rand = mulberry32(seed)
    const out: T[] = []

    const refill = () => {
        const pool = items.slice()
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1))
            ;[pool[i], pool[j]] = [pool[j], pool[i]]
        }
        return pool
    }
    let pool = refill()
    while (out.length < target) {
        if (pool.length === 0) pool = refill()
        const next = pool.pop()!

        if (out.length > 0 && next === out[out.length - 1] && pool.length > 0) {
            const swap = pool.pop()!
            out.push(swap)
            pool.push(next)
        } else {
            out.push(next)
        }
    }
    return out
}

function GridCell({
    item,
    index,
    safeImageWidth,
    safeImageHeight,
    radius,
    placeholderColor,
    isDragging,
    handlePointerDown,
    handlePointerUp,
}: {
    item: GridItem
    index: number
    safeImageWidth: number
    safeImageHeight: number
    radius: number
    placeholderColor?: string
    isDragging: boolean
    handlePointerDown: (e: React.PointerEvent) => void
    handlePointerUp: (e: React.PointerEvent, item: GridItem, index: number) => void
}) {
    const rawSrc = item?.image?.src
    const alt = item?.alt ?? item?.image?.alt ?? item?.title ?? `Event Photo ${index + 1}`
    const [currentSrc, setCurrentSrc] = useState<string | undefined>(rawSrc)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setCurrentSrc(item?.image?.src)
        setHasError(false)
    }, [item?.image?.src])

    const handleImageError = () => {
        // Fallback sequence: .jpg -> .svg -> placeholder tile
        if (currentSrc && currentSrc.endsWith(".jpg")) {
            setCurrentSrc(currentSrc.replace(".jpg", ".svg"))
        } else if (currentSrc && !currentSrc.endsWith(".svg")) {
            setCurrentSrc(`/gallery/photo-${(index % 12) + 1}.svg`)
        } else {
            setHasError(true)
        }
    }

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerUp={(e) => handlePointerUp(e, item, index)}
            role="button"
            tabIndex={0}
            aria-label={`View photo: ${item?.title || alt || `Image ${index + 1}`}`}
            style={{
                position: "relative",
                width: safeImageWidth,
                height: safeImageHeight,
                overflow: "hidden",
                borderRadius: radius,
                backgroundColor: placeholderColor || getItemColor(index),
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                cursor: isDragging ? "grabbing" : "pointer",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.5)",
            }}
            className="group transition-transform duration-300 hover:scale-[1.02] hover:border-[#7484FE]/60"
        >
            {currentSrc && !hasError ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentSrc}
                        alt={alt}
                        draggable={false}
                        onError={handleImageError}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                            userSelect: "none",
                            display: "block",
                            zIndex: 1,
                        }}
                        className="transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Subtle hover gradient and title pill */}
                    <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 pointer-events-none">
                        {item.category && (
                            <span className="font-mono text-[10px] font-bold text-[#33FF67] uppercase tracking-wider">
                                {item.category}
                            </span>
                        )}
                        <p className="text-xs font-bold text-[#F7F2F6] truncate mt-0.5">
                            {item.title || alt}
                        </p>
                    </div>
                </>
            ) : (
                <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center p-3 text-center select-none bg-gradient-to-br from-[#1b1c24] via-[#141418] to-[#0d0e11] border border-white/5 group-hover:border-[#7484FE]/40 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#7484FE] group-hover:text-[#33FF67] group-hover:scale-110 transition-transform">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span className="mt-2 font-mono text-xs font-bold text-[#F7F2F6]/90">
                        {item?.title || `Photo #${index + 1}`}
                    </span>
                    <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#33FF67]">
                        {item?.category || "Upload Photo"}
                    </span>
                    <span className="mt-1 font-mono text-[9px] text-white/30 truncate max-w-[150px]">
                        public/gallery
                    </span>
                </div>
            )}
        </div>
    )
}

function __OriginkitBase_DraggableGrid(props: DraggableGridProps) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        items,
        columns,
        imageWidth,
        imageHeight,
        rounded,
        gap,
        enableWheel,
        placeholderColor,
        onItemClick,
        style,
        className,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const [containerSize, setContainerSize] = useState({ w: 800, h: 600 })
    const [isDragging, setIsDragging] = useState(false)
    const initializedRef = useRef(false)

    const pointerDownPos = useRef<{ x: number; y: number; t: number } | null>(
        null
    )
    const wheelAnimX = useRef<ReturnType<typeof animate> | null>(null)
    const wheelAnimY = useRef<ReturnType<typeof animate> | null>(null)

    const safeItems =
        Array.isArray(items) && items.length > 0 ? items : defaultItems
    const safeColumns = Math.max(1, Math.min(20, Math.floor(columns || 5)))

    const safeImageWidth = Math.max(20, Math.min(4000, imageWidth ?? 220))
    const safeImageHeight = Math.max(20, Math.min(4000, imageHeight ?? 220))

    const safeGap = Math.max(0, Math.min(100, gap ?? 4)) * 4

    const r = Math.max(0, Math.min(20, rounded ?? 4))
    const radius = (r / 20) * (Math.min(safeImageWidth, safeImageHeight) / 2)

    const rows = safeColumns
    const totalCells = safeColumns * rows
    const displayItems = useMemo(
        () => fillAndShuffle(safeItems, totalCells, 0xc0ffee),
        [safeItems, totalCells]
    )

    const gridW = safeColumns * safeImageWidth + (safeColumns - 1) * safeGap
    const gridH = rows * safeImageHeight + (rows - 1) * safeGap

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const measure = () => {
            const rect = el.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
                setContainerSize({ w: rect.width, h: rect.height })
            }
        }
        measure()

        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const maxX = safeGap
    const minX = Math.min(maxX, containerSize.w - gridW - safeGap)
    const maxY = safeGap
    const minY = Math.min(maxY, containerSize.h - gridH - safeGap)

    const dragConstraints = {
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY,
    }

    useEffect(() => {
        if (initializedRef.current) return
        if (containerSize.w === 0 || containerSize.h === 0) return

        // Center grid initially so users see plenty of tiles all around
        const startX = Math.max(minX, Math.min(maxX, (containerSize.w - gridW) / 2))
        const startY = Math.max(minY, Math.min(maxY, (containerSize.h - gridH) / 2))
        x.set(startX)
        y.set(startY)
        initializedRef.current = true
    }, [containerSize.w, containerSize.h, gridW, gridH, minX, maxX, minY, maxY, x, y])

    useEffect(() => {
        if (!enableWheel) return
        const el = containerRef.current
        if (!el) return

        const clamp = (v: number, mn: number, mx: number) =>
            Math.min(Math.max(v, mn), mx)

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const curX = x.get()
            const curY = y.get()
            const targetX = clamp(curX - e.deltaX, minX, maxX)
            const targetY = clamp(curY - e.deltaY, minY, maxY)
            if (wheelAnimX.current) wheelAnimX.current.stop()
            if (wheelAnimY.current) wheelAnimY.current.stop()
            wheelAnimX.current = animate(x, targetX, {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            })
            wheelAnimY.current = animate(y, targetY, {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            })
        }

        el.addEventListener("wheel", onWheel, { passive: false })
        return () => {
            el.removeEventListener("wheel", onWheel)
            if (wheelAnimX.current) wheelAnimX.current.stop()
            if (wheelAnimY.current) wheelAnimY.current.stop()
        }
    }, [enableWheel, minX, maxX, minY, maxY, x, y])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    }, [])

    const handlePointerUp = useCallback(
        (e: React.PointerEvent, item: GridItem, index: number) => {
            const start = pointerDownPos.current
            pointerDownPos.current = null
            if (!start) return
            const dx = e.clientX - start.x
            const dy = e.clientY - start.y
            const moved = Math.hypot(dx, dy)
            if (moved < 5) {
                onItemClick?.(item, index)
            }
        },
        [onItemClick]
    )

    const wrapperStyle: React.CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        margin: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
        ...style,
    }

    const gridStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: gridW,
        height: gridH,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: `repeat(${safeColumns}, ${safeImageWidth}px)`,
        gridAutoRows: `${safeImageHeight}px`,
        gap: `${safeGap}px`,
        willChange: "transform",
    }

    return (
        <div ref={containerRef} style={wrapperStyle} className={className}>
            <motion.div
                style={{ ...gridStyle, x, y }}
                drag
                dragConstraints={dragConstraints}
                dragElastic={0.08}
                dragMomentum={true}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
            >
                {displayItems.map((item, index) => (
                    <GridCell
                        key={index}
                        item={item}
                        index={index}
                        safeImageWidth={safeImageWidth}
                        safeImageHeight={safeImageHeight}
                        radius={radius}
                        placeholderColor={placeholderColor}
                        isDragging={isDragging}
                        handlePointerDown={handlePointerDown}
                        handlePointerUp={handlePointerUp}
                    />
                ))}
            </motion.div>
        </div>
    )
}

const COMPONENT_DEFAULTS = {
    items: defaultItems,
    columns: 6,
    imageWidth: 220,
    imageHeight: 220,
    rounded: 4,
    gap: 4,
    enableWheel: false,
    placeholderColor: "#161618",
}

const __originkitPresetProps = {
  columns: 6,
  imageWidth: 220,
  imageHeight: 220,
};

export default function DraggableGrid(props: DraggableGridProps) {
  return <__OriginkitBase_DraggableGrid {...__originkitPresetProps} {...props} />;
}
