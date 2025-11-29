'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalBlockProps {
  command: string;
  className?: string;
}

export function TerminalBlock({ command, className }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative group rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Terminal className="h-3 w-3 text-slate-400 mr-1.5" />
          <span className="text-xs text-slate-400 font-mono">terminal</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>
      
      {/* Terminal content */}
      <div className="bg-slate-900 p-4 font-mono text-sm">
        <div className="flex items-start gap-2">
          <span className="text-green-400 select-none">$</span>
          <code className="text-slate-100 break-all">{command}</code>
        </div>
      </div>
      
      {/* Copied feedback */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium"
        >
          Copied!
        </motion.div>
      )}
    </motion.div>
  );
}
