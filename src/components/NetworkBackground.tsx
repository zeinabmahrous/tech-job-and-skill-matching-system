import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulsePhase: number;
}

interface PulsePacket {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  color: string;
}

export const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle interactivity
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Palette of refined, elegant tech blues and cyans
    const colorPalette = [
      { fill: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' }, // Sky Blue
      { fill: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },  // Vibrant Cyan
      { fill: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)' },  // Soft Blue
      { fill: '#818cf8', glow: 'rgba(129, 140, 248, 0.35)' }, // Electric Indigo
      { fill: '#bae6fd', glow: 'rgba(186, 230, 253, 0.5)' }, // Bright Glint Cyan
    ];

    let particles: Particle[] = [];
    let pulsePackets: PulsePacket[] = [];

    const initParticles = () => {
      // Density based on screen area
      const particleCount = Math.floor((width * height) / 14000);
      particles = [];
      for (let i = 0; i < Math.max(50, Math.min(130, particleCount)); i++) {
        const pal = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const r = Math.random() * 2 + 1.5;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: r,
          baseRadius: r,
          color: pal.fill,
          glowColor: pal.glow,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    // Spawn packets traveling along edges
    let lastPacketTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Periodically spawn signal packets between connected nodes
      if (time - lastPacketTime > 400 && particles.length > 1) {
        lastPacketTime = time;
        const p1 = particles[Math.floor(Math.random() * particles.length)];
        // Find a nearby neighbor
        for (let j = 0; j < particles.length; j++) {
          const p2 = particles[j];
          if (p1 !== p2) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              pulsePackets.push({
                fromX: p1.x,
                fromY: p1.y,
                toX: p2.x,
                toY: p2.y,
                progress: 0,
                speed: 0.015 + Math.random() * 0.02,
                color: p1.color,
              });
              break;
            }
          }
        }
      }

      // Draw connections
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw mouse interaction connections
      if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Signal Packets
      for (let i = pulsePackets.length - 1; i >= 0; i--) {
        const packet = pulsePackets[i];
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          pulsePackets.splice(i, 1);
          continue;
        }

        const currX = packet.fromX + (packet.toX - packet.fromX) * packet.progress;
        const currY = packet.fromY + (packet.toY - packet.fromY) * packet.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse size
        p.pulsePhase += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulsePhase) * 0.8;

        // Glow circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-sky-600/12 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] bg-blue-700/15 rounded-full blur-3xl" />

      {/* Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85"
      />
    </div>
  );
};

