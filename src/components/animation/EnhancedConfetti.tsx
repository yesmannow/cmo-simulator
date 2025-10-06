'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  life: number;
  maxLife: number;
}

interface EnhancedConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
  achievement?: 'grade-a' | 'high-roi' | 'market-leader' | 'big-bet-success' | 'perfect-score';
}

export function EnhancedConfetti({ 
  trigger, 
  duration = 3000, 
  particleCount = 150,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
  onComplete,
  achievement
}: EnhancedConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  const getAchievementConfig = (achievement?: string) => {
    switch (achievement) {
      case 'grade-a':
        return {
          colors: ['#ffd700', '#ffed4e', '#fbbf24', '#f59e0b'],
          shapes: ['star', 'circle'] as const,
          message: '🏆 Grade A Performance!'
        };
      case 'high-roi':
        return {
          colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
          shapes: ['circle', 'square'] as const,
          message: '💰 Exceptional ROI!'
        };
      case 'market-leader':
        return {
          colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
          shapes: ['triangle', 'star'] as const,
          message: '🎯 Market Leadership!'
        };
      case 'big-bet-success':
        return {
          colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff'],
          shapes: ['star', 'circle'] as const,
          message: '⚡ Big Bet Success!'
        };
      case 'perfect-score':
        return {
          colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3'],
          shapes: ['star', 'triangle'] as const,
          message: '🌟 Perfect Score!'
        };
      default:
        return {
          colors,
          shapes: ['circle', 'square', 'triangle', 'star'] as const,
          message: '🎉 Congratulations!'
        };
    }
  };

  const createParticle = (x: number, y: number, config: ReturnType<typeof getAchievementConfig>): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 8 + 4;
    const shapes = config.shapes;
    
    return {
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - Math.random() * 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: Math.random() * 6 + 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 1,
      maxLife: Math.random() * 2 + 1,
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;

    const size = particle.size;

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'square':
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
      
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5;
          const x = Math.cos(angle) * size / 2;
          const y = Math.sin(angle) * size / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(particle => {
      // Update particle physics
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.3; // gravity
      particle.vx *= 0.99; // air resistance
      particle.rotation += particle.rotationSpeed;
      particle.life -= 1 / (particle.maxLife * 60); // fade out over time

      // Draw particle
      if (particle.life > 0) {
        drawParticle(ctx, particle);
        return true;
      }
      return false;
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = getAchievementConfig(achievement);

    // Create particles from multiple points for better spread
    const sources = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.2 },
      { x: canvas.width * 0.8, y: canvas.height * 0.3 },
    ];

    particlesRef.current = [];
    
    sources.forEach(source => {
      for (let i = 0; i < particleCount / sources.length; i++) {
        particlesRef.current.push(createParticle(source.x, source.y, config));
      }
    });

    animate();

    const timeoutId = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
      if (onComplete) onComplete();
    }, duration);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [trigger, duration, particleCount, achievement, onComplete]);

  if (!trigger) return null;

  const config = getAchievementConfig(achievement);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Achievement Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -50 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border-2 border-primary/20">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              {config.message}
            </div>
            <div className="text-sm text-muted-foreground">
              Outstanding performance!
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
