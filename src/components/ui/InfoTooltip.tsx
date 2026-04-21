"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  iconOnly?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

type TooltipMotionPosition = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  x?: string | number;
  y?: string | number;
};

export function InfoTooltip({ 
  content, 
  children, 
  iconOnly = false, 
  position = "top",
  className = "",
  delay = 0.2
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions: Record<"top" | "bottom" | "left" | "right", TooltipMotionPosition> = {
    top: { bottom: "100%", left: "50%", x: "-50%", y: -8 },
    bottom: { top: "100%", left: "50%", x: "-50%", y: 8 },
    left: { right: "100%", top: "50%", y: "-50%", x: -8 },
    right: { left: "100%", top: "50%", y: "-50%", x: 8 },
  };

  const currentPosition = positions[position];

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {iconOnly ? (
        <div className="text-slate-400 hover:text-blue-400 cursor-help transition-colors p-1">
          <Info className="w-4 h-4" />
        </div>
      ) : (
        children
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, ...currentPosition }}
            animate={{ opacity: 1, scale: 1, ...currentPosition }}
            exit={{ opacity: 0, scale: 0.95, ...currentPosition }}
            transition={{ duration: 0.2, delay: delay }}
            className={`absolute z-50 w-64 p-3 pointer-events-none text-left
                       bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
            style={{
              top: currentPosition.top,
              bottom: currentPosition.bottom,
              left: currentPosition.left,
              right: currentPosition.right,
            }}
          >
            <div className="text-sm text-slate-200 font-medium leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
