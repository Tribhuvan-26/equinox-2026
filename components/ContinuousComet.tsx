"use client";

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const MAX_POINTS = 64;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

#define MAX_POINTS 64

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uNormalBlend;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float filmGrain(vec2 p, float time) {
  float frame = time * 18.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  vec3 additiveColor = color * luminance;
  float normalAlpha = clamp(strongest * uBrightness * uOpacity * uFade, 0.0, 1.0);
  vec3 normalColor = mix(color, vec3(1.0), smoothstep(0.45, 1.0, strongestCore) * uHotspot * 0.35);
  gl_FragColor = vec4(mix(additiveColor, normalColor, uNormalBlend), mix(alpha, normalAlpha, uNormalBlend));
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  let value = (hex || '').replace('#', '').trim();
  if (value.length === 3)
    value = value.split('').map((char) => char + char).join('');
  const parsed = Number.parseInt(value || '000000', 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function ContinuousComet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Subtler, thinner trail configuration matching request
    const config = {
      color: '#22D3EE',           // Cyan head
      secondaryColor: '#10B981',  // Teal/Green tail
      trailLength: 50,
      trailWidth: 4,              // Thinner trail
      trailTaper: 0.9,
      followSpeed: 0.2,           // Slightly faster follow for tighter tail
      glowIntensity: 1.5,
      glowSpread: 0.8,
      hotspot: 0.8,
      brightness: 1.2,
      opacity: 0.8,
      pulseSpeed: 0.8,
      noiseStrength: 0.05,
      blendMode: 'screen',
      maxDevicePixelRatio: 1.5
    };

    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, config.maxDevicePixelRatio)
    });
    
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const pointData = Array(MAX_POINTS * 2).fill(0);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: config.trailLength },
        uColor: { value: hexToRgb(config.color) },
        uSecondaryColor: { value: hexToRgb(config.secondaryColor) },
        uTrailWidth: { value: config.trailWidth },
        uTaper: { value: config.trailTaper },
        uGlowIntensity: { value: config.glowIntensity },
        uGlowSpread: { value: config.glowSpread },
        uHotspot: { value: config.hotspot },
        uBrightness: { value: config.brightness },
        uOpacity: { value: config.opacity },
        uPulseSpeed: { value: config.pulseSpeed },
        uNoiseStrength: { value: config.noiseStrength },
        uNormalBlend: { value: 0 },
        uTime: { value: 0 },
        uFade: { value: 0 }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let width = 1;
    let height = 1;
    let raf = 0;
    let destroyed = false;
    
    let startTime = performance.now();
    let duration = 6000;
    
    let startX = 0, startY = 0;
    let ctrl1X = 0, ctrl1Y = 0;
    let ctrl2X = 0, ctrl2Y = 0;
    let endX = 0, endY = 0;
    let isInitialized = false;

    const resize = () => {
      width = Math.max(container.clientWidth, 1);
      height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const generateNewPath = () => {
      duration = 5000 + Math.random() * 4000;
      
      const edge = Math.random();
      if (edge < 0.5) {
        // Start Left, go Right
        startX = -200;
        startY = Math.random() * height;
        endX = width + 200;
        endY = Math.random() * height;
      } else {
        // Start Right, go Left
        startX = width + 200;
        startY = Math.random() * height;
        endX = -200;
        endY = Math.random() * height;
      }

      ctrl1X = width * 0.33 + (Math.random() - 0.5) * 400;
      ctrl1Y = height * 0.33 + (Math.random() - 0.5) * 400;
      ctrl2X = width * 0.66 + (Math.random() - 0.5) * 400;
      ctrl2Y = height * 0.66 + (Math.random() - 0.5) * 400;
    };

    let lastFrameTime = performance.now();

    const render = (now: number) => {
      if (destroyed) return;
      const delta = Math.min((now - lastFrameTime) / 16.667, 3);
      lastFrameTime = now;
      
      if (width > 1 && !isInitialized) {
        generateNewPath();
        startTime = now;
        isInitialized = true;
      }

      // Calculate path progress
      let t = (now - startTime) / duration;
      
      if (t > 1.2) {
        generateNewPath();
        startTime = now;
        t = 0;
        // Snap tail points off screen
        for (const point of points) {
          point.x = startX;
          point.y = startY;
        }
        head.x = startX;
        head.y = startY;
      }

      const clampedT = clamp(t, 0, 1);

      // Bezier curve evaluation
      const invT = 1 - clampedT;
      target.x = invT * invT * invT * startX +
                 3 * invT * invT * clampedT * ctrl1X +
                 3 * invT * clampedT * clampedT * ctrl2X +
                 clampedT * clampedT * clampedT * endX;

      target.y = invT * invT * invT * startY +
                 3 * invT * invT * clampedT * ctrl1Y +
                 3 * invT * clampedT * clampedT * ctrl2Y +
                 clampedT * clampedT * clampedT * endY;

      // Handle Fade In/Out at the edges
      let fade = 1.0;
      if (t < 0.1) fade = t / 0.1;
      else if (t > 0.9 && t <= 1.0) fade = (1.0 - t) / 0.1;
      else if (t > 1.0) fade = 0;

      // Smooth following logic (like original cursor, makes the tail flow naturally)
      const headEase = 1 - Math.pow(1 - clamp(config.followSpeed, 0.01, 0.99), delta);
      const chainBase = clamp(0.28 + config.followSpeed * 0.35, 0.08, 0.92);
      const chainEase = 1 - Math.pow(1 - chainBase, delta);
      
      head.x += (target.x - head.x) * headEase;
      head.y += (target.y - head.y) * headEase;
      
      // Initialize points if all at origin (first frame)
      if (points[0].x === 0 && points[0].y === 0) {
        for (const point of points) {
          point.x = target.x;
          point.y = target.y;
        }
        head.x = target.x;
        head.y = target.y;
      }

      points[0].x = head.x;
      points[0].y = head.y;

      for (let i = 1; i < MAX_POINTS; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * chainEase;
        points[i].y += (points[i - 1].y - points[i].y) * chainEase;
      }

      for (let i = 0; i < MAX_POINTS; i++) {
        pointData[i * 2] = points[i].x;
        pointData[i * 2 + 1] = points[i].y;
      }

      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uFade.value = fade;

      renderer.render({ scene: mesh });
      if (!destroyed) raf = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    raf = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mesh.geometry.remove();
      program.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[-5] overflow-hidden mix-blend-screen opacity-80">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
