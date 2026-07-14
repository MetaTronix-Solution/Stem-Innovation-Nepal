"use client";

import { useEffect, useRef } from "react";

interface HeroCanvasProps {
  className?: string;
}

/**
 * IoT / robotics hero visual: small "chip" and "sensor" nodes drift slowly,
 * nearby nodes wire themselves together like a live sensor network, and
 * pulses of "data" travel along the wires toward a central gateway hub
 * that follows the cursor. Pure Canvas 2D — no matter-js / matter-attractors
 * / matter-wrap dependency needed, so those can be dropped from package.json.
 */
const PALETTE = {
  chipFill: "#4C1D95",
  chipStroke: "#C4B5FD",
  sensorFill: "#2E1065",
  sensorRing: "#5EEAD4",
  wire: "124, 58, 237", // rgb for rgba() wires between nodes
  gatewayWire: "94, 234, 212", // rgb for rgba() wires into the hub
  packet: "#5EEAD4",
  hub: "#5EEAD4",
  hubGlow: "rgba(94, 234, 212, 0.35)",
};

type NodeType = "chip" | "sensor";

interface NetNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: NodeType;
  phase: number;
}

interface Packet {
  from: NetNode;
  to: NetNode;
  t: number;
  speed: number;
}

export default function HeroCanvas({ className }: HeroCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = wrapper.clientWidth;
    let height = wrapper.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = wrapper!.clientWidth;
      height = wrapper!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    // --- Build the node network, scaled to the available area ---
    const NODE_COUNT = Math.max(24, Math.floor((width * height) / 26000));
    const MAX_LINK_DIST = Math.max(width, height) / 5.5;

    const nodes: NetNode[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size:
        Math.random() > 0.55 ? Math.random() * 6 + 10 : Math.random() * 3 + 5,
      type: Math.random() > 0.55 ? "chip" : "sensor",
      phase: Math.random() * Math.PI * 2,
    }));

    const packets: Packet[] = [];
    const mouse = { x: width / 2, y: height / 2, active: false };
    const hub = { x: width / 2, y: height / 2 };

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function handlePointerLeave() {
      mouse.active = false;
    }
    wrapper.addEventListener("pointermove", handlePointerMove);
    wrapper.addEventListener("pointerleave", handlePointerLeave);

    let raf = 0;
    let t = 0;

    function drawChip(n: NetNode) {
      const s = n.size;
      ctx!.save();
      ctx!.translate(n.x, n.y);
      ctx!.fillStyle = PALETTE.chipFill;
      ctx!.strokeStyle = PALETTE.chipStroke;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      const r = s * 0.22;
      ctx!.moveTo(-s / 2 + r, -s / 2);
      ctx!.arcTo(s / 2, -s / 2, s / 2, s / 2, r);
      ctx!.arcTo(s / 2, s / 2, -s / 2, s / 2, r);
      ctx!.arcTo(-s / 2, s / 2, -s / 2, -s / 2, r);
      ctx!.arcTo(-s / 2, -s / 2, s / 2, -s / 2, r);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();

      // little pins on each edge, like a microcontroller package
      ctx!.lineWidth = 1;
      const pins = 3;
      for (let i = 0; i < pins; i++) {
        const off = (i - (pins - 1) / 2) * (s / (pins + 0.5));
        ctx!.beginPath();
        ctx!.moveTo(off, -s / 2);
        ctx!.lineTo(off, -s / 2 - s * 0.22);
        ctx!.moveTo(off, s / 2);
        ctx!.lineTo(off, s / 2 + s * 0.22);
        ctx!.moveTo(-s / 2, off);
        ctx!.lineTo(-s / 2 - s * 0.22, off);
        ctx!.moveTo(s / 2, off);
        ctx!.lineTo(s / 2 + s * 0.22, off);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function drawSensor(n: NetNode, time: number) {
      const pulse = (Math.sin(time * 0.9 + n.phase) + 1) / 2; // 0..1
      ctx!.save();
      ctx!.translate(n.x, n.y);
      // expanding "ping" ring
      ctx!.beginPath();
      ctx!.arc(0, 0, n.size + pulse * 5, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(94, 234, 212, ${0.35 * (1 - pulse)})`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      // core
      ctx!.beginPath();
      ctx!.arc(0, 0, n.size, 0, Math.PI * 2);
      ctx!.fillStyle = PALETTE.sensorFill;
      ctx!.fill();
      ctx!.strokeStyle = PALETTE.sensorRing;
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
      ctx!.restore();
    }

    function step() {
      t += 0.016;
      ctx!.clearRect(0, 0, width, height);

      // hub eases toward the pointer, or drifts gently when idle
      const targetX = mouse.active
        ? mouse.x
        : width / 2 + Math.sin(t * 0.12) * width * 0.22;
      const targetY = mouse.active
        ? mouse.y
        : height / 2 + Math.cos(t * 0.09) * height * 0.22;
      hub.x += (targetX - hub.x) * 0.06;
      hub.y += (targetY - hub.y) * 0.06;

      // update nodes: gentle drift + light pull toward the hub, wrap at edges
      for (const n of nodes) {
        const dx = hub.x - n.x;
        const dy = hub.y - n.y;
        const dist = Math.max(Math.hypot(dx, dy), 1);

        if (dist < 70) {
          // too close to the hub — nudge back out so nodes keep circulating
          // instead of piling up into a frozen clump
          const push = (70 - dist) / 70;
          n.vx -= (dx / dist) * push * 0.06;
          n.vy -= (dy / dist) * push * 0.06;
        } else {
          const pull = Math.min(0.0009, 18 / (dist * dist));
          n.vx += dx * pull;
          n.vy += dy * pull;
        }

        n.vx *= 0.99;
        n.vy *= 0.99;
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // wires between nearby nodes, and from nodes into the gateway hub
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < MAX_LINK_DIST) {
            const alpha = (1 - dist / MAX_LINK_DIST) * 0.5;
            ctx!.strokeStyle = `rgba(${PALETTE.wire}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        const dh = Math.hypot(nodes[i].x - hub.x, nodes[i].y - hub.y);
        if (dh < MAX_LINK_DIST * 1.3) {
          const alpha = (1 - dh / (MAX_LINK_DIST * 1.3)) * 0.6;
          ctx!.strokeStyle = `rgba(${PALETTE.gatewayWire}, ${alpha})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(nodes[i].x, nodes[i].y);
          ctx!.lineTo(hub.x, hub.y);
          ctx!.stroke();
        }
      }

      // occasionally spawn a "data packet" traveling along a short edge
      if (
        !prefersReducedMotion &&
        Math.random() < 0.025 &&
        packets.length < 10
      ) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        let closest: NetNode | null = null;
        let closestDist = Infinity;
        for (const b of nodes) {
          if (b === a) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < MAX_LINK_DIST && d < closestDist) {
            closestDist = d;
            closest = b;
          }
        }
        if (closest) {
          packets.push({
            from: a,
            to: closest,
            t: 0,
            speed: 0.006 + Math.random() * 0.006,
          });
        }
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const px = p.from.x + (p.to.x - p.from.x) * p.t;
        const py = p.from.y + (p.to.y - p.from.y) * p.t;
        ctx!.beginPath();
        ctx!.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = PALETTE.packet;
        ctx!.shadowColor = PALETTE.packet;
        ctx!.shadowBlur = 8;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      for (const n of nodes) {
        if (n.type === "chip") drawChip(n);
        else drawSensor(n, t);
      }

      // gateway hub
      ctx!.beginPath();
      ctx!.arc(hub.x, hub.y, 14, 0, Math.PI * 2);
      ctx!.fillStyle = PALETTE.hubGlow;
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(hub.x, hub.y, 6, 0, Math.PI * 2);
      ctx!.fillStyle = PALETTE.hub;
      ctx!.shadowColor = PALETTE.hub;
      ctx!.shadowBlur = 12;
      ctx!.fill();
      ctx!.shadowBlur = 0;

      raf = requestAnimationFrame(step);
    }

    if (prefersReducedMotion) {
      // draw one static frame instead of animating continuously
      step();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      wrapper.removeEventListener("pointermove", handlePointerMove);
      wrapper.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        touchAction: "pan-y", // let vertical touch-scroll pass through on mobile
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
