import React, { useRef, useEffect, useState } from 'react';
import { Calculator, MessageCircle, ArrowDown, Sun, Zap, Shield, Factory } from 'lucide-react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current!;
      const canvas = canvasRef.current!;
      const headline = headlineRef.current!;
      const subheadline = subheadlineRef.current!;
      const cta = ctaRef.current!;
      const callouts = calloutsRef.current!;
      const calloutEls = calloutRefs.current.filter(Boolean) as HTMLDivElement[];

      const canvasCtx = canvas.getContext('2d')!;
      const dpr = window.devicePixelRatio || 1;

      function resizeCanvas() {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
        canvasCtx.scale(dpr, dpr);
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Pre-generate stars
      const stars: Star[] = Array.from({ length: 100 }, () => ({
        x: Math.random(),
        y: Math.random() * 0.55,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      // Pre-generate hill silhouette points
      const hillPoints = Array.from({ length: 40 }, (_, i) => ({
        x: i / 39,
        y: 0.04 * Math.sin(i * 0.4) + 0.03 * Math.sin(i * 0.8 + 1) + 0.02 * Math.sin(i * 1.5),
      }));

      let currentProgress = 0;
      let rafId = 0;

      function drawScene(progress: number) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const time = Date.now() / 1000;
        canvasCtx.clearRect(0, 0, w, h);

        // === SKY ===
        // dayness: 0 at dawn/dusk, 1 at noon
        const dayness = Math.sin(Math.PI * progress);

        const skyGrad = canvasCtx.createLinearGradient(0, 0, 0, h * 0.75);
        const warmth = 1 - dayness; // warm at dawn/dusk
        skyGrad.addColorStop(0, `rgb(${8 + warmth * 15}, ${12 + warmth * 8}, ${28 + warmth * 5})`);
        skyGrad.addColorStop(0.5, `rgb(${15 + warmth * 35}, ${20 + warmth * 18}, ${45 + warmth * 10})`);
        skyGrad.addColorStop(1, `rgb(${25 + warmth * 60}, ${30 + warmth * 30}, ${55 + warmth * 8})`);
        canvasCtx.fillStyle = skyGrad;
        canvasCtx.fillRect(0, 0, w, h * 0.75);

        // === STARS ===
        const starOpacity = Math.max(0, 1 - dayness * 2.5);
        if (starOpacity > 0.01) {
          stars.forEach((star) => {
            const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
            canvasCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity * starOpacity * twinkle})`;
            canvasCtx.beginPath();
            canvasCtx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
            canvasCtx.fill();
          });
        }

        // === SUN POSITION (arcs across sky) ===
        const sunAngle = Math.PI * progress; // 0 → PI
        const arcRadius = Math.min(w, h) * 0.42;
        const arcCenterX = w / 2;
        const arcCenterY = h * 0.75;
        const sunX = arcCenterX - arcRadius * Math.cos(sunAngle);
        const sunY = arcCenterY - arcRadius * Math.sin(sunAngle);
        const sunR = Math.max(28, Math.min(w, h) * 0.045);

        // === SUN GLOW (large halo) ===
        const haloGrad = canvasCtx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 6);
        haloGrad.addColorStop(0, `rgba(255, 220, 100, ${0.25 * dayness + 0.08})`);
        haloGrad.addColorStop(0.25, `rgba(255, 180, 50, ${0.12 * dayness + 0.03})`);
        haloGrad.addColorStop(0.6, `rgba(255, 140, 30, ${0.04 * dayness})`);
        haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
        canvasCtx.fillStyle = haloGrad;
        canvasCtx.fillRect(0, 0, w, h);

        // === SUN RAYS / CORONA ===
        canvasCtx.save();
        canvasCtx.translate(sunX, sunY);
        const rayCount = 16;
        for (let r = 0; r < rayCount; r++) {
          const angle = (r / rayCount) * Math.PI * 2 + time * 0.15;
          const rayLen = sunR * (1.3 + Math.sin(angle * 3 + time * 2) * 0.25);
          const grad = canvasCtx.createLinearGradient(
            Math.cos(angle) * sunR, Math.sin(angle) * sunR,
            Math.cos(angle) * (sunR + rayLen), Math.sin(angle) * (sunR + rayLen)
          );
          grad.addColorStop(0, `rgba(255, 210, 90, ${0.35 * dayness + 0.05})`);
          grad.addColorStop(1, `rgba(255, 180, 50, 0)`);
          canvasCtx.strokeStyle = grad;
          canvasCtx.lineWidth = 2;
          canvasCtx.beginPath();
          canvasCtx.moveTo(Math.cos(angle) * sunR, Math.sin(angle) * sunR);
          canvasCtx.lineTo(Math.cos(angle) * (sunR + rayLen), Math.sin(angle) * (sunR + rayLen));
          canvasCtx.stroke();
        }
        canvasCtx.restore();

        // === SUN BODY ===
        const sunGrad = canvasCtx.createRadialGradient(sunX - sunR * 0.2, sunY - sunR * 0.2, 0, sunX, sunY, sunR);
        sunGrad.addColorStop(0, `rgba(255, 245, 200, ${0.95 * dayness + 0.4})`);
        sunGrad.addColorStop(0.5, `rgba(255, 210, 90, ${0.9 * dayness + 0.25})`);
        sunGrad.addColorStop(1, `rgba(255, 160, 40, ${0.6 * dayness + 0.1})`);
        canvasCtx.fillStyle = sunGrad;
        canvasCtx.beginPath();
        canvasCtx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        canvasCtx.fill();

        // === GROUND ===
        const groundY = h * 0.74;
        const groundGrad = canvasCtx.createLinearGradient(0, groundY, 0, h);
        groundGrad.addColorStop(0, `rgb(${18 + warmth * 15}, ${22 + warmth * 8}, ${38})`);
        groundGrad.addColorStop(1, `rgb(${5 + warmth * 5}, ${8}, ${18})`);
        canvasCtx.fillStyle = groundGrad;
        canvasCtx.fillRect(0, groundY, w, h - groundY);

        // Ground reflection of sun
        const reflectGrad = canvasCtx.createRadialGradient(sunX, groundY, 0, sunX, groundY, 250);
        reflectGrad.addColorStop(0, `rgba(255, 180, 50, ${0.18 * dayness})`);
        reflectGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        canvasCtx.fillStyle = reflectGrad;
        canvasCtx.fillRect(0, groundY - 10, w, 120);

        // === HILL SILHOUETTE ===
        canvasCtx.fillStyle = `rgb(${10 + warmth * 8}, ${14 + warmth * 5}, ${28})`;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, groundY);
        hillPoints.forEach((pt) => {
          canvasCtx.lineTo(pt.x * w, groundY - pt.y * h);
        });
        canvasCtx.lineTo(w, groundY);
        canvasCtx.closePath();
        canvasCtx.fill();

        // === HORIZON LINE ===
        canvasCtx.strokeStyle = `rgba(${60 + warmth * 40}, ${80 + warmth * 30}, ${120}, 0.25)`;
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, groundY);
        canvasCtx.lineTo(w, groundY);
        canvasCtx.stroke();

        // === SOLAR PANEL ARRAY ===
        const numPanels = 5;
        const panelAreaW = Math.min(w * 0.72, 900);
        const panelAreaStart = (w - panelAreaW) / 2;
        const panelSpacing = panelAreaW / numPanels;
        const poleHeight = Math.max(45, h * 0.07);
        const panelPivotY = groundY - poleHeight;
        const panelW = Math.min(panelSpacing * 0.72, 135);
        const panelH = Math.max(55, Math.min(h * 0.085, 85));

        for (let i = 0; i < numPanels; i++) {
          // Add slight perspective: middle panels are slightly larger/closer
          const perspectiveFactor = 1 - Math.abs(i - (numPanels - 1) / 2) * 0.04;
          const pW = panelW * perspectiveFactor;
          const pH = panelH * perspectiveFactor;
          const panelX = panelAreaStart + (i + 0.5) * panelSpacing;

          // Direction from panel to sun
          const dx = sunX - panelX;
          const dy = panelPivotY - sunY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const tiltAngle = Math.atan2(dx, Math.max(dy, 1)); // tilt from horizontal

          // How directly panel faces sun (1 = perfect, 0 = edge-on)
          const facingFactor = Math.max(0, Math.sin(Math.abs(tiltAngle)) * 0.5 + 0.5);

          // === LIGHT RAYS from sun to panel ===
          if (dayness > 0.03) {
            const rayAlpha = 0.08 * dayness;
            const rayGrad = canvasCtx.createLinearGradient(sunX, sunY, panelX, panelPivotY - pH / 2);
            rayGrad.addColorStop(0, `rgba(255, 220, 100, ${rayAlpha * 1.5})`);
            rayGrad.addColorStop(0.7, `rgba(255, 200, 80, ${rayAlpha * 0.5})`);
            rayGrad.addColorStop(1, `rgba(255, 180, 50, 0)`);
            canvasCtx.strokeStyle = rayGrad;
            canvasCtx.lineWidth = 1.5;
            canvasCtx.beginPath();
            canvasCtx.moveTo(sunX, sunY);
            canvasCtx.lineTo(panelX, panelPivotY - pH / 2);
            canvasCtx.stroke();
          }

          // === POLE / MOUNT ===
          canvasCtx.strokeStyle = 'rgba(50, 60, 80, 0.85)';
          canvasCtx.lineWidth = 3;
          canvasCtx.beginPath();
          canvasCtx.moveTo(panelX, groundY);
          canvasCtx.lineTo(panelX, panelPivotY);
          canvasCtx.stroke();

          // Base plate
          canvasCtx.fillStyle = 'rgba(35, 42, 58, 0.9)';
          canvasCtx.beginPath();
          canvasCtx.ellipse(panelX, groundY, 14 * perspectiveFactor, 4, 0, 0, Math.PI * 2);
          canvasCtx.fill();

          // Pivot joint
          canvasCtx.fillStyle = 'rgba(70, 80, 100, 0.9)';
          canvasCtx.beginPath();
          canvasCtx.arc(panelX, panelPivotY, 4, 0, Math.PI * 2);
          canvasCtx.fill();

          // === PANEL (rotated to face sun) ===
          canvasCtx.save();
          canvasCtx.translate(panelX, panelPivotY);
          canvasCtx.rotate(tiltAngle);

          // Aluminum frame
          const frameThick = 3;
          canvasCtx.fillStyle = `rgba(85, 95, 115, 0.9)`;
          canvasCtx.fillRect(-pW / 2 - frameThick, -pH / 2 - frameThick, pW + frameThick * 2, pH + frameThick * 2);

          // Panel face gradient (dark blue, typical solar panel)
          const faceAlpha = 0.88;
          const faceGrad = canvasCtx.createLinearGradient(-pW / 2, -pH / 2, pW / 2, pH / 2);
          faceGrad.addColorStop(0, `rgba(18, 35, 72, ${faceAlpha})`);
          faceGrad.addColorStop(0.3, `rgba(25, 48, 95, ${faceAlpha})`);
          faceGrad.addColorStop(0.6, `rgba(22, 42, 88, ${faceAlpha})`);
          faceGrad.addColorStop(1, `rgba(15, 30, 65, ${faceAlpha})`);
          canvasCtx.fillStyle = faceGrad;
          canvasCtx.fillRect(-pW / 2, -pH / 2, pW, pH);

          // Cell grid
          const cols = 6;
          const rows = 4;
          const cellW = pW / cols;
          const cellH = pH / rows;
          canvasCtx.strokeStyle = `rgba(90, 130, 210, 0.25)`;
          canvasCtx.lineWidth = 0.5;
          for (let c = 0; c <= cols; c++) {
            const x = -pW / 2 + c * cellW;
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, -pH / 2);
            canvasCtx.lineTo(x, pH / 2);
            canvasCtx.stroke();
          }
          for (let r = 0; r <= rows; r++) {
            const y = -pH / 2 + r * cellH;
            canvasCtx.beginPath();
            canvasCtx.moveTo(-pW / 2, y);
            canvasCtx.lineTo(pW / 2, y);
            canvasCtx.stroke();
          }

          // Busbars (silver horizontal lines)
          canvasCtx.strokeStyle = `rgba(180, 200, 240, 0.15)`;
          canvasCtx.lineWidth = 0.8;
          for (let b = 1; b <= 2; b++) {
            const y = -pH / 2 + (pH / 3) * b;
            canvasCtx.beginPath();
            canvasCtx.moveTo(-pW / 2 + 3, y);
            canvasCtx.lineTo(pW / 2 - 3, y);
            canvasCtx.stroke();
          }

          // Subtle inner cell highlights
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              const cx = -pW / 2 + c * cellW + cellW / 2;
              const cy = -pH / 2 + r * cellH + cellH / 2;
              const cellGlow = canvasCtx.createRadialGradient(cx, cy, 0, cx, cy, cellW * 0.4);
              cellGlow.addColorStop(0, `rgba(40, 65, 120, 0.12)`);
              cellGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
              canvasCtx.fillStyle = cellGlow;
              canvasCtx.fillRect(cx - cellW / 2, cy - cellH / 2, cellW, cellH);
            }
          }

          // Golden glow on face when receiving sunlight
          if (dayness > 0.05) {
            const glowAlpha = 0.12 * dayness * facingFactor;
            const glowGrad = canvasCtx.createLinearGradient(0, -pH / 2, 0, pH / 2);
            glowGrad.addColorStop(0, `rgba(255, 210, 90, ${glowAlpha})`);
            glowGrad.addColorStop(0.5, `rgba(255, 190, 60, ${glowAlpha * 0.4})`);
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            canvasCtx.fillStyle = glowGrad;
            canvasCtx.fillRect(-pW / 2, -pH / 2, pW, pH);
          }

          // Edge highlight (top edge glowing)
          if (dayness > 0.05) {
            canvasCtx.strokeStyle = `rgba(120, 170, 255, ${0.25 + dayness * 0.35})`;
            canvasCtx.lineWidth = 1.5;
            canvasCtx.strokeRect(-pW / 2, -pH / 2, pW, pH);
          }

          canvasCtx.restore();

          // === ENERGY PARTICLES (flowing from sun toward panels) ===
          if (dayness > 0.12) {
            const particleCount = 4;
            // Target: top-center of the panel face (account for tilt)
            const targetBaseX = panelX;
            const targetBaseY = panelPivotY - pH / 2;
            const sunEdgeX = sunX;
            const sunEdgeY = sunY;

            for (let p = 0; p < particleCount; p++) {
              const pProgress = ((time * 0.45 + p * 0.25 + i * 0.08) % 1);
              // Interpolate from sun toward panel
              const baseX = sunEdgeX + (targetBaseX - sunEdgeX) * pProgress;
              const baseY = sunEdgeY + (targetBaseY - sunEdgeY) * pProgress;
              // Slight perpendicular wobble so particles drift naturally along the ray
              const perpAngle = Math.atan2(targetBaseX - sunEdgeX, sunEdgeY - targetBaseY);
              const wobble = Math.sin(pProgress * Math.PI * 2 + i + time) * 8 * (1 - pProgress);
              const pX = baseX + Math.cos(perpAngle) * wobble;
              const pY = baseY - Math.sin(perpAngle) * wobble;

              // Fade in at start (near sun), fade out at end (reaching panel)
              const pAlpha = Math.sin(pProgress * Math.PI) * dayness * 0.7;
              const pSize = 1.2 + Math.sin(pProgress * Math.PI) * 1.8;

              // Particle glow
              const pGrad = canvasCtx.createRadialGradient(pX, pY, 0, pX, pY, pSize * 3);
              pGrad.addColorStop(0, `rgba(255, 230, 120, ${pAlpha})`);
              pGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');
              canvasCtx.fillStyle = pGrad;
              canvasCtx.beginPath();
              canvasCtx.arc(pX, pY, pSize * 3, 0, Math.PI * 2);
              canvasCtx.fill();

              // Particle core
              canvasCtx.fillStyle = `rgba(255, 245, 180, ${pAlpha * 1.2})`;
              canvasCtx.beginPath();
              canvasCtx.arc(pX, pY, pSize, 0, Math.PI * 2);
              canvasCtx.fill();
            }
          }
        }

        // === TRACKING ARROW (shows panels tracking the sun) ===
        if (progress > 0.05 && progress < 0.95 && dayness > 0.15) {
          const arrowAlpha = 0.15 * dayness;
          canvasCtx.strokeStyle = `rgba(255, 200, 80, ${arrowAlpha})`;
          canvasCtx.lineWidth = 1;
          canvasCtx.setLineDash([4, 6]);
          canvasCtx.beginPath();
          canvasCtx.arc(arcCenterX, arcCenterY, arcRadius, Math.PI - sunAngle, Math.PI, false);
          canvasCtx.stroke();
          canvasCtx.setLineDash([]);
        }
      }

      // Continuous animation loop (for particles, sun rays, star twinkle)
      function animate() {
        drawScene(currentProgress);
        rafId = requestAnimationFrame(animate);
      }
      animate();

      // Main scroll-triggered timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            currentProgress = self.progress;
            setScrollProgress(self.progress);
          },
        },
      });

      // Headline morphs and fades
      tl.to(headline, {
        opacity: 0,
        scale: 1.15,
        filter: 'blur(8px)',
        ease: 'power2.in',
        duration: 0.25,
      }, 0)
        .to(subheadline, {
          opacity: 0,
          y: -30,
          duration: 0.2,
        }, 0)
        .to(cta, {
          opacity: 0,
          y: -20,
          duration: 0.15,
        }, 0)
        // Stagger floating callouts — each appears one-by-one as you scroll
        calloutEls.forEach((el, idx) => {
          const startT = 0.34 + idx * 0.1;
          tl.fromTo(el,
            { opacity: 0, scale: 0.6, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: 'back.out(1.4)' },
            startT
          );
        });

      ctx = gsap.context(() => {}, container);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resizeCanvas);
        tl.scrollTrigger?.kill();
        tl.kill();
        ScrollTrigger.killAll();
      };
    })();

    return () => {
      cleanup?.();
      ctx?.revert();
    };
  }, []);

  const scrollToSubsidy = () => {
    document.querySelector('#subsidy')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} id="hero" className="relative h-screen overflow-hidden bg-night">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid-bg opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-solar/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-ocean/10 blur-[100px] animate-pulse-glow" />

      {/* Canvas for sun-tracking panel animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Badges */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in" style={{ opacity: 1 - scrollProgress * 3 }}>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Factory className="w-4 h-4 text-solar" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">Make in India</span>
          </div>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Shield className="w-4 h-4 text-solar" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">Aatmanirbhar Bharat</span>
          </div>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 hidden sm:flex">
            <Zap className="w-4 h-4 text-solar" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">ALMM · DCR Certified</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-display-2xl text-white max-w-5xl"
        >
          ENGINEERED FOR THE SUN.<br />
          <span className="text-gradient-solar">CRAFTED FOR INDIA.</span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl font-light"
        >
          Premium N-Type TOPCon bifacial solar systems designed for Tamil Nadu's climate —
          proudly serving Karur and all of Tamil Nadu. Maximize your PM Surya Ghar subsidy
          with TANGEDCO net-metering experts.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={scrollToSubsidy}
            className="group relative px-8 py-4 bg-gradient-to-r from-solar to-solar-dark text-white font-semibold rounded-xl shadow-2xl shadow-solar/30 hover:shadow-solar/50 hover:scale-105 transition-all duration-300 flex items-center gap-2.5"
          >
            <Calculator className="w-5 h-5" />
            Calculate Subsidy
            <span className="absolute inset-0 rounded-xl animate-shimmer pointer-events-none" />
          </button>
          <a
            href="https://wa.me/918667872774?text=I%20want%20a%20quick%20quote%20for%20solar%20installation"
            target="_blank"
            rel="noopener noreferrer"
            className="glass px-8 py-4 text-white font-semibold rounded-xl hover:bg-white/15 hover:scale-105 transition-all duration-300 flex items-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5 text-green-400" />
            WhatsApp Quick Quote
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Floating callouts (appear one-by-one on scroll) */}
        <div
          ref={calloutsRef}
          className="absolute inset-0 pointer-events-none"
        >
          <div ref={(el) => { calloutRefs.current[0] = el; }} className="absolute top-[20%] left-[10%] glass p-4 rounded-xl max-w-[200px] animate-float" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-solar" />
              <span className="text-white text-sm font-semibold">22.8% Efficiency</span>
            </div>
            <p className="text-white/60 text-xs">Industry-leading N-Type TOPCon cell technology</p>
          </div>
          <div ref={(el) => { calloutRefs.current[1] = el; }} className="absolute top-[30%] right-[12%] glass p-4 rounded-xl max-w-[200px] animate-float" style={{ opacity: 0, animationDelay: '1.5s' }}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-solar" />
              <span className="text-white text-sm font-semibold">25-Year Warranty</span>
            </div>
            <p className="text-white/60 text-xs">Performance guaranteed with DCR-compliant modules</p>
          </div>
          <div ref={(el) => { calloutRefs.current[2] = el; }} className="absolute bottom-[25%] left-[15%] glass p-4 rounded-xl max-w-[200px] animate-float" style={{ opacity: 0, animationDelay: '3s' }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-solar" />
              <span className="text-white text-sm font-semibold">Bifacial Gain +15%</span>
            </div>   
            <p className="text-white/60 text-xs">Energy from both sides of the panel</p>
          </div>   
          <div ref={(el) => { calloutRefs.current[3] = el; }} className="absolute bottom-[30%] right-[10%] glass p-4 rounded-xl max-w-[200px] animate-float" style={{ opacity: 0, animationDelay: '2s' }}>
            <div className="flex items-center gap-2 mb-1">
              <Factory className="w-4 h-4 text-solar" />
              <span className="text-white text-sm font-semibold">Made in India</span>
            </div>
            <p className="text-white/60 text-xs">Tier-1 ALMM listed domestic manufacturing</p>
          </div>
        </div>
      </div>
    </section>
  );
}
