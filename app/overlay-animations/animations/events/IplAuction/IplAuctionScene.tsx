// app/overlay-animations/animations/events/IplAuction/IplAuctionScene.tsx
"use client";

import React, { forwardRef } from "react";
import styles from "./IplAuctionAnimation.module.css";

export interface IplAuctionSceneProps {
  className?: string;
}

export const IplAuctionScene = forwardRef<SVGSVGElement, IplAuctionSceneProps>(
  ({ className = "" }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 900"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className={`${styles.sceneSvg} ${className}`}
        aria-hidden="true"
      >
        {/* =========================================================
             GLOBAL ANIMATION STYLES
             ========================================================= */}
        <style>{`
          .fade-in {
            opacity: 0;
            animation: iplFadeIn 0.7s ease-out forwards;
          }

          .slide-left {
            opacity: 0;
            transform: translateX(-80px);
            animation: iplSlideLeft 0.8s cubic-bezier(.2,.8,.2,1) forwards;
          }

          .slide-right {
            opacity: 0;
            transform: translateX(80px);
            animation: iplSlideRight 0.8s cubic-bezier(.2,.8,.2,1) forwards;
          }

          .slide-up {
            opacity: 0;
            transform: translateY(50px);
            animation: iplSlideUp 0.8s cubic-bezier(.2,.8,.2,1) forwards;
          }

          .pop {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            transform: scale(.7);
            animation: iplPopIn 0.65s cubic-bezier(.17,.89,.32,1.28) forwards;
          }

          .float {
            animation: iplFloating 3.5s ease-in-out infinite;
          }

          .swoosh {
            stroke-dasharray: 700;
            stroke-dashoffset: 700;
            animation: iplDrawLine 0.9s ease-out forwards;
          }

          .gavel-motion {
            transform-box: fill-box;
            transform-origin: 85% 80%;
            animation:
              iplGavelEnter .7s ease-out forwards,
              iplGavelTap 2.8s ease-in-out 1.8s infinite;
          }

          .paddle-motion {
            transform-box: fill-box;
            transform-origin: center;
            animation:
              iplPaddleEnter .7s cubic-bezier(.17,.89,.32,1.28) forwards,
              iplPaddleFloat 2.8s ease-in-out 1.5s infinite;
          }

          .pulse {
            transform-box: fill-box;
            transform-origin: center;
            animation: iplPulse 2s ease-in-out 2s infinite;
          }

          .wave1 {
            animation: iplWaveMove1 7s ease-in-out infinite alternate;
          }

          .wave2 {
            animation: iplWaveMove2 9s ease-in-out infinite alternate;
          }

          .audience-person {
            opacity: 0;
            animation: iplAudienceIn .6s ease-out forwards;
          }

          @keyframes iplFadeIn {
            to {
              opacity: 1;
            }
          }

          @keyframes iplSlideLeft {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes iplSlideRight {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes iplSlideUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes iplPopIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes iplDrawLine {
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes iplFloating {
            0%,100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes iplGavelEnter {
            from {
              opacity: 0;
              transform: rotate(-20deg) translateY(-30px);
            }
            to {
              opacity: 1;
              transform: rotate(0deg) translateY(0);
            }
          }

          @keyframes iplGavelTap {
            0%,65%,100% {
              transform: rotate(0deg);
            }
            72% {
              transform: rotate(13deg);
            }
            80% {
              transform: rotate(-4deg);
            }
          }

          @keyframes iplPaddleEnter {
            from {
              opacity: 0;
              transform: translateY(35px) scale(.75);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes iplPaddleFloat {
            0%,100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes iplPulse {
            0%,100% {
              opacity: .3;
              transform: scale(.85);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
          }

          @keyframes iplWaveMove1 {
            from {
              transform: translateX(-30px);
            }
            to {
              transform: translateX(30px);
            }
          }

          @keyframes iplWaveMove2 {
            from {
              transform: translateX(30px);
            }
            to {
              transform: translateX(-30px);
            }
          }

          @keyframes iplAudienceIn {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* =========================================================
             BACKGROUND
             ========================================================= */}
        <rect id="background" width="1600" height="900" fill="none" />

        {/* Soft gold background waves */}
        <path
          id="gold-wave-1"
          className="wave1"
          d="
            M-100 570
            C250 470 400 650 650 690
            C900 730 1080 560 1300 520
            C1450 490 1550 500 1700 550
            L1700 690
            C1500 630 1400 630 1260 660
            C1030 710 880 850 610 790
            C330 730 170 590 -100 710
            Z
          "
          fill="#F5C863"
          opacity=".45"
        />

        <path
          id="gold-wave-2"
          className="wave2"
          d="
            M-100 700
            C180 600 350 770 580 800
            C830 830 1000 700 1200 650
            C1420 595 1550 640 1700 690
            L1700 760
            C1500 710 1390 690 1210 735
            C980 795 820 900 560 865
            C300 830 150 700 -100 790
            Z
          "
          fill="#F5C863"
          opacity=".18"
        />

        {/* =========================================================
             LEFT PENNANT
             ========================================================= */}
        <g
          id="left-pennant"
          className="slide-left"
          style={{ animationDelay: "0.15s" }}
        >
          {/* pole */}
          <rect x="70" y="105" width="7" height="360" rx="3" fill="#123B78" />
          <circle cx="73" cy="98" r="16" fill="#1A5FE0" />

          {/* banner */}
          <path
            d="
              M78 125
              L360 125
              L360 430
              L219 365
              L78 430
              Z
            "
            fill="#123B78"
          />

          {/* top edge */}
          <rect
            x="78"
            y="112"
            width="282"
            height="12"
            rx="6"
            fill="#1A5FE0"
          />

          {/* divider */}
          <rect
            x="115"
            y="245"
            width="205"
            height="3"
            fill="#FFFFFF"
            opacity=".9"
          />

          {/* number */}
          <text
            x="219"
            y="215"
            textAnchor="middle"
            fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
            fontSize="70"
            fontWeight="900"
            fill="#FFFFFF"
          >
            10
          </text>

          {/* label */}
          <text
            x="219"
            y="305"
            textAnchor="middle"
            fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
            fontSize="46"
            fontWeight="900"
            fill="#FFFFFF"
            letterSpacing="1"
          >
            TEAMS
          </text>
        </g>

        {/* =========================================================
             RIGHT PENNANT
             ========================================================= */}
        <g
          id="right-pennant"
          className="slide-right"
          style={{ animationDelay: "0.25s" }}
        >
          {/* pole */}
          <rect
            x="1523"
            y="105"
            width="7"
            height="360"
            rx="3"
            fill="#123B78"
          />
          <circle cx="1527" cy="98" r="16" fill="#1A5FE0" />

          {/* banner */}
          <path
            d="
              M1240 125
              L1523 125
              L1523 430
              L1381 365
              L1240 430
              Z
            "
            fill="#123B78"
          />

          {/* top edge */}
          <rect
            x="1240"
            y="112"
            width="283"
            height="12"
            rx="6"
            fill="#1A5FE0"
          />

          {/* divider */}
          <rect
            x="1278"
            y="245"
            width="205"
            height="3"
            fill="#FFFFFF"
            opacity=".9"
          />

          {/* number */}
          <text
            x="1381"
            y="215"
            textAnchor="middle"
            fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
            fontSize="70"
            fontWeight="900"
            fill="#FFFFFF"
          >
            1
          </text>

          {/* label */}
          <text
            x="1381"
            y="305"
            textAnchor="middle"
            fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
            fontSize="42"
            fontWeight="900"
            fill="#FFFFFF"
          >
            CHAMPION
          </text>
        </g>

        {/* =========================================================
             MAIN TITLE
             ========================================================= */}
        <g
          id="main-title"
          className="slide-up"
          style={{ animationDelay: "0.35s" }}
        >
          <text
            x="800"
            y="185"
            textAnchor="middle"
            fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
            fontSize="116"
            fontWeight="900"
            letterSpacing="-5"
            fill="#FFFFFF"
          >
            IPL AUCTION
          </text>
        </g>

        {/* =========================================================
             GOLD SWOOSH
             ========================================================= */}
        <path
          id="title-swoosh"
          className="swoosh"
          style={{ animationDelay: "0.7s" }}
          d="M505 210 C680 180 930 180 1100 210"
          fill="none"
          stroke="#F5C863"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* =========================================================
             BUDGET BADGE
             ========================================================= */}
        <g
          id="budget-badge"
          className="pop"
          style={{ animationDelay: "0.85s" }}
        >
          <rect
            x="480"
            y="245"
            width="640"
            height="72"
            rx="36"
            fill="#1A5FE0"
          />
          <text
            x="800"
            y="292"
            textAnchor="middle"
            fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
            fontSize="34"
            fontWeight="800"
            fill="#FFFFFF"
          >
            BUDGET
            <tspan fill="#F5C863"> ₹120 CR </tspan>
            <tspan fill="#FFFFFF">PER TEAM</tspan>
          </text>
        </g>

        {/* =========================================================
             AUCTIONEER
             ========================================================= */}
        <g
          id="auctioneer"
          className="slide-left"
          style={{ animationDelay: "1.05s" }}
        >
          {/* head */}
          <circle cx="550" cy="465" r="42" fill="#111827" />

          {/* hair */}
          <path
            d="
              M510 455
              C515 410 585 410 592 450
              C575 435 535 435 510 455
              Z
            "
            fill="#111827"
          />

          {/* neck */}
          <rect x="535" y="495" width="30" height="35" rx="8" fill="#F2B58D" />

          {/* shirt */}
          <path
            d="
              M515 520
              L585 520
              L625 675
              L475 675
              Z
            "
            fill="#FFFFFF"
          />

          {/* navy suit body */}
          <path
            d="
              M510 520
              L535 515
              L550 560
              L565 515
              L590 520
              L635 675
              L470 675
              Z
            "
            fill="#123B78"
          />

          {/* lapels */}
          <path d="M525 525 L550 560 L535 580 L510 530 Z" fill="#1A5FE0" />
          <path d="M575 525 L550 560 L565 580 L590 530 Z" fill="#1A5FE0" />

          {/* red tie */}
          <path
            d="
              M542 548
              L558 548
              L565 635
              L550 650
              L535 635
              Z
            "
            fill="#E8477A"
          />

          {/* left arm */}
          <path
            d="
              M505 535
              C470 550 450 590 430 625
              L455 645
              C485 615 515 590 530 565
              Z
            "
            fill="#123B78"
          />

          {/* raised arm */}
          <path
            d="
              M590 535
              C625 520 650 490 665 455
              L690 465
              C680 510 650 555 610 580
              Z
            "
            fill="#1A5FE0"
          />

          {/* raised hand */}
          <circle cx="677" cy="452" r="16" fill="#F2B58D" />

          {/* =====================================================
               GAVEL
               ===================================================== */}
          <g
            id="auctioneer-gavel"
            className="gavel-motion"
            style={{ animationDelay: "1.3s" }}
          >
            {/* handle */}
            <rect
              x="675"
              y="395"
              width="14"
              height="65"
              rx="7"
              transform="rotate(-18 682 430)"
              fill="#8B5A2B"
            />

            {/* head */}
            <rect
              x="650"
              y="380"
              width="70"
              height="25"
              rx="10"
              transform="rotate(-18 685 392)"
              fill="#111827"
            />

            <rect
              x="664"
              y="373"
              width="42"
              height="12"
              rx="6"
              transform="rotate(-18 685 379)"
              fill="#1A5FE0"
            />
          </g>

          {/* =====================================================
               PODIUM
               ===================================================== */}
          <g id="auctioneer-podium">
            <rect
              x="405"
              y="645"
              width="280"
              height="150"
              rx="8"
              fill="#123B78"
            />

            <rect
              x="385"
              y="625"
              width="320"
              height="35"
              rx="6"
              fill="#1A5FE0"
            />

            {/* podium front */}
            <rect
              x="475"
              y="690"
              width="140"
              height="105"
              rx="5"
              fill="#1A5FE0"
              opacity=".75"
            />

            {/* microphone */}
            <path
              d="
                M620 625
                C630 590 650 585 660 600
              "
              fill="none"
              stroke="#111827"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <circle cx="660" cy="598" r="9" fill="#111827" />
          </g>
        </g>

        {/* =========================================================
             BIDDER
             ========================================================= */}
        <g
          id="bidder"
          className="slide-right"
          style={{ animationDelay: "1.15s" }}
        >
          {/* head */}
          <circle cx="1045" cy="470" r="42" fill="#111827" />

          {/* hair */}
          <path
            d="
              M1005 460
              C1010 415 1080 415 1088 455
              C1070 435 1030 435 1005 460
              Z
            "
            fill="#111827"
          />

          {/* neck */}
          <rect x="1030" y="500" width="30" height="35" rx="8" fill="#F2B58D" />

          {/* white shirt */}
          <path
            d="
              M1010 525
              L1080 525
              L1110 690
              L980 690
              Z
            "
            fill="#FFFFFF"
          />

          {/* suit */}
          <path
            d="
              M1005 520
              L1030 515
              L1045 555
              L1060 515
              L1085 520
              L1130 705
              L960 705
              Z
            "
            fill="#111827"
          />

          {/* lapels */}
          <path d="M1020 525 L1045 555 L1030 580 L1005 530 Z" fill="#123B78" />
          <path d="M1070 525 L1045 555 L1060 580 L1085 530 Z" fill="#123B78" />

          {/* blue tie */}
          <path
            d="
              M1037 548
              L1053 548
              L1060 640
              L1045 655
              L1030 640
              Z
            "
            fill="#1A5FE0"
          />

          {/* arm holding paddle */}
          <path
            d="
              M1005 535
              C970 530 940 500 925 465
              L950 455
              C975 485 1005 505 1030 510
              Z
            "
            fill="#111827"
          />

          {/* hand */}
          <circle cx="938" cy="458" r="15" fill="#F2B58D" />

          {/* =====================================================
               BID PADDLE
               ===================================================== */}
          <g
            id="bid-paddle"
            className="paddle-motion"
            style={{ animationDelay: "1.45s" }}
          >
            {/* stick */}
            <rect
              x="932"
              y="345"
              width="12"
              height="115"
              rx="6"
              fill="#E8477A"
            />

            {/* paddle */}
            <circle cx="938" cy="330" r="55" fill="#E8477A" />

            <circle
              cx="938"
              cy="330"
              r="44"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              opacity=".25"
            />

            <text
              x="938"
              y="342"
              textAnchor="middle"
              fontFamily="'Space Grotesk', Arial, Helvetica, sans-serif"
              fontSize="31"
              fontWeight="900"
              fill="#FFFFFF"
            >
              BID
            </text>
          </g>
        </g>

        {/* =========================================================
             CENTER INTERACTION ACCENT
             ========================================================= */}
        <g id="interaction-accent" className="pulse">
          <circle cx="800" cy="590" r="8" fill="#F5C863" />

          <circle
            cx="800"
            cy="590"
            r="30"
            fill="none"
            stroke="#F5C863"
            strokeWidth="4"
            opacity=".4"
          />

          <circle
            cx="800"
            cy="590"
            r="52"
            fill="none"
            stroke="#1A5FE0"
            strokeWidth="3"
            strokeDasharray="8 12"
            opacity=".35"
          />
        </g>

        {/* =========================================================
             SIMPLE AUCTION ACTION LINES
             ========================================================= */}
        <g
          id="action-lines"
          className="fade-in"
          style={{ animationDelay: "1.7s" }}
          stroke="#1A5FE0"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <line x1="755" y1="555" x2="735" y2="530" />
          <line x1="770" y1="540" x2="760" y2="510" />
          <line x1="800" y1="535" x2="800" y2="500" />

          <line x1="845" y1="555" x2="865" y2="530" />
          <line x1="830" y1="540" x2="840" y2="510" />
        </g>

        {/* =========================================================
             AUDIENCE
             ========================================================= */}
        <g id="audience">
          {/* PERSON 1 */}
          <g
            className="audience-person"
            style={{ animationDelay: "1.8s" }}
          >
            <circle cx="100" cy="755" r="35" fill="#111827" />
            <path
              d="
                M45 850
                C45 800 65 785 100 785
                C135 785 155 800 155 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M40 850
                L160 850
                L150 900
                L50 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 2 */}
          <g
            className="audience-person"
            style={{ animationDelay: "1.9s" }}
          >
            <circle cx="300" cy="760" r="35" fill="#111827" />
            <path
              d="
                M245 850
                C245 800 265 785 300 785
                C335 785 355 800 355 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M240 850
                L360 850
                L350 900
                L250 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 3 */}
          <g
            className="audience-person"
            style={{ animationDelay: "2s" }}
          >
            <circle cx="500" cy="750" r="36" fill="#111827" />
            <path
              d="
                M445 850
                C445 795 465 780 500 780
                C535 780 555 795 555 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M440 850
                L560 850
                L550 900
                L450 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 4 */}
          <g
            className="audience-person"
            style={{ animationDelay: "2.1s" }}
          >
            <circle cx="700" cy="760" r="35" fill="#111827" />
            <path
              d="
                M645 850
                C645 800 665 785 700 785
                C735 785 755 800 755 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M640 850
                L760 850
                L750 900
                L650 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 5 */}
          <g
            className="audience-person"
            style={{ animationDelay: "2.2s" }}
          >
            <circle cx="900" cy="755" r="35" fill="#111827" />
            <path
              d="
                M845 850
                C845 800 865 785 900 785
                C935 785 955 800 955 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M840 850
                L960 850
                L950 900
                L850 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 6 */}
          <g
            className="audience-person"
            style={{ animationDelay: "2.3s" }}
          >
            <circle cx="1100" cy="760" r="35" fill="#111827" />
            <path
              d="
                M1045 850
                C1045 800 1065 785 1100 785
                C1135 785 1155 800 1155 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M1040 850
                L1160 850
                L1150 900
                L1050 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 7 */}
          <g
            className="audience-person"
            style={{ animationDelay: "2.4s" }}
          >
            <circle cx="1300" cy="755" r="35" fill="#111827" />
            <path
              d="
                M1245 850
                C1245 800 1265 785 1300 785
                C1335 785 1355 800 1355 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M1240 850
                L1360 850
                L1350 900
                L1250 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>

          {/* PERSON 8 */}
          <g
            className="audience-person"
            style={{ animationDelay: "2.5s" }}
          >
            <circle cx="1500" cy="760" r="35" fill="#111827" />
            <path
              d="
                M1445 850
                C1445 800 1465 785 1500 785
                C1535 785 1555 800 1555 850
                Z
              "
              fill="#111827"
            />
            <path
              d="
                M1440 850
                L1560 850
                L1550 900
                L1450 900
                Z
              "
              fill="#1A5FE0"
            />
          </g>
        </g>

        {/* =========================================================
             SUBTLE FOREGROUND LINE
             ========================================================= */}
        <rect
          x="0"
          y="895"
          width="1600"
          height="5"
          fill="#123B78"
          opacity=".25"
        />
      </svg>
    );
  }
);

IplAuctionScene.displayName = "IplAuctionScene";
