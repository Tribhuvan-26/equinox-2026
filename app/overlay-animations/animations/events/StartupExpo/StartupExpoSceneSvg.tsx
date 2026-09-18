// app/overlay-animations/animations/events/StartupExpo/StartupExpoSceneSvg.tsx
import React from "react";

export interface StartupExpoSceneSvgProps {
  className?: string;
}

export const StartupExpoSceneSvg = React.forwardRef<SVGSVGElement, StartupExpoSceneSvgProps>(
  ({ className }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 1672 941"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="lampConeBeamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff2a8" stopOpacity="0.75" />
            <stop offset="25%" stopColor="#ffe580" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#ffec9e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FCF4E3" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lampCoreBeamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#fff4b8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FCF4E3" stopOpacity="0.0" />
          </linearGradient>
          <clipPath id="titleClip">
            <rect id="titleClipRect" x="280" y="180" width="0" height="260" />
          </clipPath>
          <filter id="bulbGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
        </defs>

        {/* BASE BACKGROUND */}
        <g id="background-base">
          <rect width="1672" height="941" fill="#FCF4E3" />
        </g>

        {/* SIDE BANNERS (Right Column banner asset matching left date-tag column) */}
        <g id="side-banners" className="side-banners">
          <g id="side-banner-right">
            <line x1="1470" y1="0" x2="1470" y2="40" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="1570" y1="0" x2="1570" y2="40" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />
            <g id="side-banner-right-body" style={{ transformOrigin: "1520px 40px" }}>
              <rect x="1445" y="40" width="150" height="235" rx="6" fill="#014efc" stroke="#0b0d0f" strokeWidth="2.5" strokeLinejoin="round" />
              <text x="1520" y="78" textAnchor="middle" fill="#ffffff" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="13.5" letterSpacing="2.5">
                <tspan x="1520" dy="0">DISCOVER</tspan>
                <tspan x="1520" dy="29">CONNECT</tspan>
                <tspan x="1520" dy="29">INVEST</tspan>
                <tspan x="1520" dy="29">COLLABORATE</tspan>
                <tspan x="1520" dy="29">GROW</tspan>
              </text>
            </g>
          </g>
        </g>

        {/* FLOOR TEXTURE SHADING (Subtle Warm Floor Accents) */}
        <g id="crack-debris">
          <ellipse cx="600" cy="855" rx="140" ry="12" fill="#F4ECE0" opacity="0.6" />
          <ellipse cx="800" cy="850" rx="90" ry="8" fill="#EFE5D6" opacity="0.5" />
          <ellipse cx="1100" cy="860" rx="180" ry="14" fill="#F4ECE0" opacity="0.6" />
        </g>

        {/* DECORATIVE POTTED PLANT LEFT - Refined Neo-Brutalist Vector (Uniform 2.5px stroke) */}
        <g id="plant-left">
          {/* Center Leaf */}
          <path
            d="M 85 845 C 62 790 58 740 75 715 C 96 745 106 795 85 845 Z"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 85 845 C 80 790 77 750 75 718" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Leaf */}
          <path
            d="M 85 845 C 50 820 28 780 38 735 C 56 768 76 800 85 845 Z"
            fill="#0558f7"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 85 845 C 64 804 49 773 40 738" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Leaf */}
          <path
            d="M 85 845 C 96 800 118 775 132 750 C 122 785 106 820 85 845 Z"
            fill="#0558f7"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 85 845 C 101 805 116 779 128 753" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Stem base joint */}
          <circle cx="85" cy="845" r="3.5" fill="#0b0d0f" />
        </g>

        {/* DECORATIVE POTTED PLANT RIGHT - Refined Neo-Brutalist Vector (Uniform 2.5px stroke) */}
        <g id="plant-right">
          {/* Center Leaf */}
          <path
            d="M 1585 845 C 1564 790 1560 740 1575 715 C 1596 745 1606 795 1585 845 Z"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 1585 845 C 1580 790 1577 750 1575 718" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Leaf */}
          <path
            d="M 1585 845 C 1550 820 1528 780 1538 735 C 1556 768 1576 800 1585 845 Z"
            fill="#0558f7"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 1585 845 C 1564 804 1549 773 1540 738" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Leaf */}
          <path
            d="M 1585 845 C 1596 800 1618 775 1632 750 C 1622 785 1606 820 1585 845 Z"
            fill="#0558f7"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 1585 845 C 1601 805 1616 779 1628 753" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Stem base joint */}
          <circle cx="1585" cy="845" r="3.5" fill="#0b0d0f" />
        </g>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* STAIRCASE BUILD LAYERS (5 Matched Isometric Steps)                  */}
        {/* Perspective: dx_step=+162, dy_step=-84; tread vector: (+140, -28)   */}
        {/* All outlines: 2.5px neo-brutalist black with round joins            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}

        {/* STEP 1: IDEAS */}
        <g id="step-1" className="stair-step" style={{ transformOrigin: "591px 840px" }}>
          {/* Black 3D Right Side Block */}
          <polygon
            points="726,756 866,728 866,812 726,840"
            fill="#0b0d0f"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Front Blue Riser Face */}
          <polygon
            points="456,756 726,756 726,840 456,840"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Top Cream Tread */}
          <polygon
            points="456,756 726,756 866,728 596,728"
            fill="#FAF4E3"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Step Tag Banner */}
          <g id="banner-1" className="step-banner" style={{ transformOrigin: "591px 774px" }}>
            <rect
              className="banner-plate"
              x="476"
              y="774"
              width="230"
              height="46"
              rx="4"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              id="banner-text-1"
              className="banner-text"
              x="591"
              y="797"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="900"
              fontSize="20"
              letterSpacing="2.5"
            >
              IDEAS
            </text>
          </g>
        </g>

        {/* STEP 2: PRODUCTS */}
        <g id="step-2" className="stair-step" style={{ transformOrigin: "753px 756px" }}>
          {/* Black 3D Right Side Block */}
          <polygon
            points="888,672 1028,644 1028,728 888,756"
            fill="#0b0d0f"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Front Blue Riser Face */}
          <polygon
            points="618,672 888,672 888,756 618,756"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Top Cream Tread */}
          <polygon
            points="618,672 888,672 1028,644 758,644"
            fill="#FAF4E3"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Step Tag Banner */}
          <g id="banner-2" className="step-banner" style={{ transformOrigin: "753px 690px" }}>
            <rect
              className="banner-plate"
              x="638"
              y="690"
              width="230"
              height="46"
              rx="4"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              id="banner-text-2"
              className="banner-text"
              x="753"
              y="713"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="900"
              fontSize="20"
              letterSpacing="2.5"
            >
              PRODUCTS
            </text>
          </g>
        </g>

        {/* STEP 3: PEOPLE */}
        <g id="step-3" className="stair-step" style={{ transformOrigin: "915px 672px" }}>
          {/* Black 3D Right Side Block */}
          <polygon
            points="1050,588 1190,560 1190,644 1050,672"
            fill="#0b0d0f"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Front Blue Riser Face */}
          <polygon
            points="780,588 1050,588 1050,672 780,672"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Top Cream Tread */}
          <polygon
            points="780,588 1050,588 1190,560 920,560"
            fill="#FAF4E3"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Step Tag Banner */}
          <g id="banner-3" className="step-banner" style={{ transformOrigin: "915px 606px" }}>
            <rect
              className="banner-plate"
              x="800"
              y="606"
              width="230"
              height="46"
              rx="4"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              id="banner-text-3"
              className="banner-text"
              x="915"
              y="629"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="900"
              fontSize="20"
              letterSpacing="2.5"
            >
              PEOPLE
            </text>
          </g>
        </g>

        {/* STEP 4: OPPORTUNITIES */}
        <g id="step-4" className="stair-step" style={{ transformOrigin: "1077px 588px" }}>
          {/* Black 3D Right Side Block */}
          <polygon
            points="1212,504 1352,476 1352,560 1212,588"
            fill="#0b0d0f"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Front Blue Riser Face */}
          <polygon
            points="942,504 1212,504 1212,588 942,588"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Top Cream Tread */}
          <polygon
            points="942,504 1212,504 1352,476 1082,476"
            fill="#FAF4E3"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Step Tag Banner */}
          <g id="banner-4" className="step-banner" style={{ transformOrigin: "1077px 522px" }}>
            <rect
              className="banner-plate"
              x="957"
              y="522"
              width="240"
              height="46"
              rx="4"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              id="banner-text-4"
              className="banner-text"
              x="1077"
              y="545"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="900"
              fontSize="18"
              letterSpacing="2.5"
            >
              OPPORTUNITIES
            </text>
          </g>
        </g>

        {/* STEP 5: GROWTH & SUMMIT LANDING (Top Step) */}
        <g id="step-5" className="stair-step" style={{ transformOrigin: "1239px 504px" }}>
          {/* Black 3D Right Side Block */}
          <polygon
            points="1374,420 1514,392 1514,476 1374,504"
            fill="#0b0d0f"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Front Blue Riser Face */}
          <polygon
            points="1104,420 1374,420 1374,504 1104,504"
            fill="#014efc"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Summit Top Cream Landing Tread (Where climber stands flush at y=420) */}
          <polygon
            points="1104,420 1374,420 1514,392 1244,392"
            fill="#FAF4E3"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Step Tag Banner */}
          <g id="banner-5" className="step-banner" style={{ transformOrigin: "1239px 438px" }}>
            <rect
              className="banner-plate"
              x="1124"
              y="438"
              width="230"
              height="46"
              rx="4"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              id="banner-text-5"
              className="banner-text"
              x="1239"
              y="461"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="900"
              fontSize="20"
              letterSpacing="2.5"
            >
              GROWTH
            </text>
          </g>
        </g>

        {/* LIGHT CONE */}
        <g id="light-cone" opacity="0">
        </g>

        {/* LAMP FIXTURE (Top-Left Hanging Wire, Shade, Bulb) */}
        <g id="lamp-fixture">
          <line x1="349" y1="0" x2="349" y2="70" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="345" y="68" width="8" height="10" rx="2" fill="#0b0d0f" stroke="#0b0d0f" strokeWidth="2.5" />
          <path
            d="M 314 126 C 314 88 384 88 384 126 Z"
            fill="#0b0d0f"
            stroke="#0b0d0f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="306" y="124" width="86" height="8" rx="3" fill="#0b0d0f" stroke="#0b0d0f" strokeWidth="2.5" />
          <ellipse cx="349" cy="138" rx="14" ry="12" fill="#FAF4E3" stroke="#0b0d0f" strokeWidth="2.5" />
          <circle id="lamp-bulb-glow" cx="349" cy="138" r="32" fill="#FFE885" opacity="0" filter="url(#bulbGlowFilter)" />
          <circle id="lamp-bulb-core" cx="349" cy="138" r="14" fill="#ffffff" opacity="0" />
        </g>

        {/* PERSON + FLAG GROUP (Comic Adventurer Anchored Flush on Step 5 Tread at y=420) */}
        <g id="person-flag-group" opacity="0" style={{ transformOrigin: "1250px 420px" }}>
          <g transform="translate(162, 68)">
            {/* Flag Banner */}
            <path
              d="M1117.85 156.94C1119.5 136.63 1121.16 116.32 1122.81 96.01C1125.59 97.05 1130.44 94.76 1133.53 94.14C1140.83 92.67 1148.43 91.78 1155.88 92.53C1161.57 93.11 1167.28 94.33 1172.28 97.23C1179.55 101.45 1184.4 107.29 1192.88 109.55C1200.32 111.53 1207.93 111.07 1215.45 109.75C1219.62 109.02 1223.4 107.79 1227.5 108.47C1226.51 115.57 1223.23 123.5 1220.62 130.19C1219.6 132.82 1217.66 135.86 1217.26 138.65C1216.43 144.43 1220.04 157.11 1219.97 164.5C1209.62 171.1 1186.58 170.84 1175.66 165.83C1168.64 162.6 1163.83 156.69 1156.36 154.22C1143.36 149.91 1130.51 153.3 1117.85 156.94Z"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Flag Pole (Anchored flush to landing at y=352, which maps to y=420) */}
            <path
              d="M 1122.81 96.01 C 1121.16 116.32 1119.50 136.63 1117.85 156.94 C 1116.80 168.46 1115.75 179.98 1114.70 191.50 C 1118.62 195.37 1120.10 201.24 1116.95 206.39 C 1115.95 208.01 1113.80 208.85 1113.19 210.62 C 1111.67 215.00 1112.09 223.68 1111.76 228.50 C 1109.97 255.19 1107.57 281.81 1105.74 308.50 C 1105.03 318.76 1101.74 335.06 1104.66 344.50 L 1100.00 352.00 L 1094.00 352.00 L 1097.50 338.48 C 1100.59 297.68 1103.68 256.88 1106.77 216.08 C 1106.56 214.07 1106.35 212.06 1106.14 210.06 C 1113.79 205.95 1118.15 206.57 1115.50 195.29 C 1112.38 195.36 1109.27 195.43 1106.15 195.50 C 1104.76 198.69 1103.36 201.87 1101.97 205.06 C 1101.50 204.64 1101.03 204.23 1100.56 203.81 C 1103.89 197.60 1102.05 195.31 1109.07 191.50 C 1111.57 164.20 1113.47 136.82 1115.80 109.50 C 1116.15 105.45 1117.19 100.57 1116.78 96.52 C 1116.57 94.43 1114.71 93.34 1114.34 91.29 C 1113.53 86.92 1116.89 84.64 1120.50 83.67 C 1127.61 86.30 1127.10 90.89 1122.81 96.01 Z"
              fill="#0b0d0f"
            />
            {/* Legs with BOTH shoes resting flush on the surface at y=352 */}
            <path
              d="M 1090.85 277.64 C 1094.01 293.50 1092.64 308.16 1092.12 315.50 C 1091.82 319.62 1092.33 325.55 1090.97 329.46 C 1090.29 331.41 1088.48 331.87 1087.53 334.50 C 1089.50 338.00 1093.00 343.00 1097.00 346.00 C 1101.00 348.00 1103.00 350.50 1102.00 352.00 L 1068.00 352.00 C 1066.00 352.00 1065.50 348.00 1067.00 344.00 C 1069.00 339.00 1071.50 335.00 1073.61 330.00 C 1073.60 320.50 1073.58 312.37 1073.50 296.11 L 1044.50 296.83 C 1039.83 307.69 1038.39 319.99 1034.63 331.21 C 1032.00 339.00 1029.00 346.80 1025.97 352.00 L 998.00 352.00 C 994.00 350.00 995.00 344.00 998.00 338.00 C 1004.00 326.00 1010.00 310.00 1011.34 335.74 C 1012.27 332.23 1013.96 328.86 1014.73 325.33 C 1017.64 311.88 1018.64 297.72 1019.10 284.07 C 1028.22 285.38 1038.26 283.25 1046.38 278.90 C 1050.40 276.75 1053.86 273.09 1058.04 271.58 C 1065.60 272.63 1073.20 273.45 1080.76 274.58 C 1084.25 275.10 1088.03 275.23 1090.85 277.64 Z"
              fill="#0b0d0f"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Crisp white shoe soles grounded flush at y=352 (which maps to landing surface y=420) */}
            <line x1="1069" y1="351" x2="1101" y2="351" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="999" y1="351" x2="1025" y2="351" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

            {/* Torso / Jacket */}
            <path
              d="M1100.56 203.81C1101.03 204.23 1101.5 204.64 1101.97 205.06C1103.36 206.72 1104.75 208.39 1106.14 210.06C1106.35 212.06 1106.56 214.07 1106.77 216.08C1099.51 221.76 1092.67 236.16 1084.3 239.78C1078.46 242.31 1067.96 241.12 1061.48 241.5C1059.02 248.25 1058.87 256.34 1058.04 263.5C1057.74 266.13 1056.79 269.19 1058.04 271.58C1053.86 273.09 1050.4 276.75 1046.38 278.9C1038.26 283.25 1028.22 285.38 1019.1 284.07C1018.72 283.66 1018.35 283.24 1017.98 282.83C1020.09 279.22 1019.91 273.26 1021.97 270.52C1023.91 267.94 1028.19 266.27 1030.69 264.16C1038.14 257.9 1046.38 250.4 1050.63 241.5C1048.29 241.5 1045.96 241.5 1043.62 241.5C1044.3 241.85 1045.21 241.64 1045.56 242.51C1045.86 243.27 1041.81 247.91 1041.15 248.67C1036.23 254.27 1029.89 261.18 1023.19 264.5C1022.88 260.08 1024.05 255.85 1024.85 251.47C1026.74 241.11 1027.61 225.26 1037.51 218.99C1041.95 216.17 1046.69 218.67 1050.92 216.93C1051.96 217.21 1053 217.48 1054.03 217.76C1055.7 218.05 1057.37 218.34 1059.04 218.64C1063.69 219.41 1074.52 221.99 1078.7 220.24C1086.97 216.79 1091.62 205.87 1100.56 203.81Z"
              fill="#014efc"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Backpack */}
            <path
              d="M1059.04 218.64C1057.37 218.34 1055.7 218.05 1054.03 217.76C1054.1 215.34 1054.17 212.92 1054.24 210.5C1066.75 208.26 1066.48 201.52 1062.5 190.9C1059.83 191.37 1057.17 191.83 1054.5 192.29C1053.83 193.99 1053.17 195.68 1052.5 197.38C1050.83 196.9 1049.17 196.41 1047.5 195.93C1046.52 199.24 1047.26 200.35 1049.93 202.5C1048.23 208.34 1044.68 206.65 1045.27 213.5C1047.16 214.64 1049.04 215.79 1050.92 216.93C1046.69 218.67 1041.95 216.17 1037.51 218.99C1027.61 225.26 1026.74 241.11 1024.85 251.47C1024.05 255.85 1022.88 260.08 1023.19 264.5C1029.89 261.18 1036.23 254.27 1041.15 248.67C1041.81 247.91 1045.86 243.27 1045.56 242.51C1045.21 241.64 1044.3 241.85 1043.62 241.5C1045.96 241.5 1048.29 241.5 1050.63 241.5C1046.38 250.4 1038.14 257.9 1030.69 264.16C1028.19 266.27 1023.91 267.94 1021.97 270.52C1019.91 273.26 1020.09 279.22 1017.98 282.83C1012.3 283.6 1005.57 283.72 1001.25 279.26C996.42 274.27 996 259.21 1000.46 253.96C1001.56 252.67 1002.95 252.18 1004.44 251.5C1002.43 248.43 1003.62 245.95 1004.75 242.37C1008.13 231.72 1013.96 225.76 1025.5 225.95C1031.75 217.94 1032.94 216.33 1042.5 212.4C1043.51 206.31 1039.83 206.81 1037.59 201.91C1034.57 195.29 1034.3 190.23 1037.16 183.5C1038.32 183.19 1039.97 183.06 1041.02 182.48C1043.18 181.27 1043.86 178.93 1046.65 178.23C1050.61 177.24 1054.37 179.16 1058.2 178.55C1060.07 178.25 1061.81 176.96 1063.5 176.19C1070.61 179.59 1068.37 185.38 1064.98 190.5C1066.38 197.03 1069.36 204.52 1063.33 209.86C1061.2 211.75 1058.33 211.7 1056.3 213.5C1057.22 215.21 1058.13 216.92 1059.04 218.64Z"
              fill="#0b0d0f"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Arm & Hand */}
            <path
              d="M1054.03 217.76C1053 217.48 1051.96 217.21 1050.92 216.93C1049.04 215.79 1047.16 214.64 1045.27 213.5C1044.68 206.65 1048.23 208.34 1049.93 202.5C1047.26 200.35 1046.52 199.24 1047.5 195.93C1049.17 196.41 1050.83 196.9 1052.5 197.38C1053.17 195.68 1053.83 193.99 1054.5 192.29C1057.17 191.83 1059.83 191.37 1062.5 190.9C1066.48 201.52 1066.75 208.26 1054.24 210.5C1054.17 212.92 1054.1 215.34 1054.03 217.76Z"
              fill="#FCF4E3"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Hand clasping pole */}
            <path
              d="M1106.14 210.06C1104.75 208.39 1103.36 206.72 1101.97 205.06C1103.36 201.87 1104.76 198.69 1106.15 195.5C1109.27 195.43 1112.38 195.36 1115.5 195.29C1118.15 206.57 1113.79 205.95 1106.14 210.06Z"
              fill="#FCF4E3"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Head and Hair */}
            <path
              d="M1027.5 163.53C1028.21 159.19 1020.31 149.77 1017.66 145.79C1016.2 143.59 1015.28 141.55 1012.48 141.5C1011.9 142.38 1011.33 142.34 1011.17 143.51C1010.97 145.01 1012.75 146.82 1013.54 147.95C1016 151.49 1018.52 155 1020.98 158.55C1021.84 159.8 1023.33 163.15 1024.82 163.68C1026.05 164.12 1026.32 163.59 1027.5 163.53Z"
              fill="#FCF4E3"
              stroke="#0b0d0f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M1014.5 181.71C1013.75 182.05 1013.59 182.46 1012.72 182.5C1011.06 182.59 995.81 177.49 994 176.47C992.41 175.58 992.51 174.75 992.5 173.2C996.64 170.9 1004.14 175.29 1008.67 176.75C1010.18 177.24 1012.61 177.58 1013.83 178.66C1015.03 179.71 1014.63 180.36 1014.5 181.71Z"
              fill="#0b0d0f"
            />
          </g>
        </g>

        {/* LOGO BADGE (Top Left) */}
        <g id="logo-badge">
          <rect x="90" y="44" width="180" height="68" rx="6" fill="#0b0d0f" stroke="#0b0d0f" strokeWidth="2.5" strokeLinejoin="round" />
          <text x="180" y="72" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="15" letterSpacing="2.5">
            THE EQUINOX
          </text>
          <rect x="145" y="83" width="70" height="22" rx="4" fill="#FF4D79" />
          <text x="180" y="94" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="13" letterSpacing="2">
            2.0
          </text>
        </g>

        {/* DATE TAG / EDITORIAL SIDE BANNER */}
        <g id="date-tag">
          <rect x="90" y="132" width="180" height="510" rx="6" fill="#014efc" stroke="#0b0d0f" strokeWidth="2.5" strokeLinejoin="round" />
          <g fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="15" fill="#ffffff" letterSpacing="2.5" textAnchor="middle" dominantBaseline="central">
            <text x="180" y="195">IDEAS</text>
            <text x="180" y="250">PEOPLE</text>
            <text x="180" y="305">PRODUCTS</text>
            <text x="180" y="360">INVESTORS</text>
            <text x="180" y="415">A BRIGHTER</text>
            <text x="180" y="448">TOMORROW</text>
            <line x1="135" y1="485" x2="225" y2="485" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* 30 - 31 OCT Date Badge with Consistent Inner Padding and Exact Centering */}
          <rect x="108" y="560" width="144" height="44" rx="6" fill="#F7CA50" stroke="#0b0d0f" strokeWidth="2.5" strokeLinejoin="round" />
          <text x="180" y="582" textAnchor="middle" dominantBaseline="central" fill="#0b0d0f" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="15" letterSpacing="2">
            30 - 31 OCT
          </text>
        </g>

        {/* TITLE TEXT (STARTUP EXPO - ClipPath Wipe Reveal) */}
        <g id="title-text">
          <g clipPath="url(#titleClip)">
            <text x="310" y="315" fontFamily="'Space Grotesk', 'Impact', sans-serif" fontWeight="900" fontSize="100" letterSpacing="2">
              <tspan fill="#0b0d0f">STARTUP</tspan>
              <tspan fill="#014efc" dx="5">EXPO</tspan>
            </text>
          </g>
        </g>

        {/* TAGLINE TEXT */}
        <g id="tagline-text" opacity="0">
          <text x="315" y="375" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="24" letterSpacing="4" fill="#0b0d0f">SHOWCASE TODAY</text>
          <text x="315" y="410" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="24" letterSpacing="4" fill="#0b0d0f">BUILD TOMORROW</text>
          <line x1="315" y1="430" x2="495" y2="430" stroke="#0b0d0f" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }
);

StartupExpoSceneSvg.displayName = "StartupExpoSceneSvg";
