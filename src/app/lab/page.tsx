'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TerminalBlock } from '@/components/ui/TerminalBlock';
import { labApps, labTools, LabItem } from '@/data/labItems';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Blueprint,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  Sparkles,
  Terminal,
  Laptop,
  Wrench,
  Braces
} from 'lucide-react';

// Status indicator component
function StatusIndicator({ status }: { status?: 'operational' | 'beta' | 'offline' }) {
  const statusConfig = {
    operational: { color: 'bg-green-500', pulse: true, label: 'Operational' },
    beta: { color: 'bg-yellow-500', pulse: true, label: 'Beta' },
    offline: { color: 'bg-red-500', pulse: false, label: 'Offline' },
  };
  
  const config = statusConfig[status || 'operational'];
  
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.color)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", config.color)} />
      </span>
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}

// Tech stack badge icon mapping
function getTechIcon(tech: string) {
  const lowerTech = tech.toLowerCase();
  if (lowerTech.includes('react') || lowerTech.includes('next')) return '⚛️';
  if (lowerTech.includes('node')) return '🟢';
  if (lowerTech.includes('postgres')) return '🐘';
  if (lowerTech.includes('cloudflare')) return '☁️';
  if (lowerTech.includes('zod')) return '✓';
  if (lowerTech.includes('framer')) return '🎨';
  if (lowerTech.includes('sharp')) return '🖼️';
  if (lowerTech.includes('cheerio')) return '🔍';
  if (lowerTech.includes('axios')) return '📡';
  if (lowerTech.includes('ai') || lowerTech.includes('gemini')) return '🤖';
  if (lowerTech.includes('recharts')) return '📊';
  if (lowerTech.includes('pdf')) return '📄';
  if (lowerTech.includes('commander')) return '⌨️';
  return '🔧';
}

// Schema viewer modal (JSON display)
function SchemaViewer({ item, onClose }: { item: LabItem; onClose: () => void }) {
  const schemaJson = JSON.stringify(item, null, 2);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Braces className="h-5 w-5 text-teal-400" />
            <span className="font-mono text-sm text-slate-200">Schema: {item.title}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-slate-200 overflow-x-auto">
          <code>{schemaJson}</code>
        </pre>
      </motion.div>
    </motion.div>
  );
}

// InfoCard component with expandable deep dive
function InfoCard({ item, index }: { item: LabItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  
  const isApp = item.type === 'app';
  const accentColor = isApp ? 'teal' : 'orange';
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className={cn(
          "group relative rounded-xl border bg-card overflow-hidden transition-all duration-300",
          isExpanded ? "shadow-lg" : "hover:shadow-md",
          isApp 
            ? "border-teal-500/20 hover:border-teal-500/40" 
            : "border-orange-500/20 hover:border-orange-500/40"
        )}
      >
        {/* Card Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isApp ? "bg-teal-500/10" : "bg-orange-500/10"
              )}>
                {isApp ? (
                  <Laptop className={cn("h-5 w-5", isApp ? "text-teal-500" : "text-orange-500")} />
                ) : (
                  <Wrench className={cn("h-5 w-5", isApp ? "text-teal-500" : "text-orange-500")} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <Badge variant="secondary" className="text-xs mt-1">
                  {item.category}
                </Badge>
              </div>
            </div>
            <StatusIndicator status={item.status} />
          </div>
          
          <p className="text-muted-foreground text-sm mb-4">{item.tagline}</p>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.techStack.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                  isApp 
                    ? "bg-teal-500/10 text-teal-700 dark:text-teal-300" 
                    : "bg-orange-500/10 text-orange-700 dark:text-orange-300"
                )}
              >
                <span>{getTechIcon(tech)}</span>
                {tech}
              </span>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex-1",
                isApp 
                  ? "hover:bg-teal-500/10 hover:text-teal-600 hover:border-teal-500/50" 
                  : "hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/50"
              )}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Examine System
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSchema(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Code2 className="h-4 w-4" />
            </Button>
            
            {item.link && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        
        {/* Expandable Deep Dive Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={cn(
                "px-6 pb-6 pt-2 space-y-4 border-t",
                isApp ? "border-teal-500/20" : "border-orange-500/20"
              )}>
                {/* Problem */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Problem</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{item.context.problem}</p>
                </div>
                
                {/* Solution */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Blueprint className="h-4 w-4" />
                    <span className="text-sm font-semibold">Solution</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{item.context.solution}</p>
                </div>
                
                {/* Impact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{item.context.impact}</p>
                </div>
                
                {/* Target & Usage */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-semibold">Target Audience</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{item.context.target}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-semibold">Usage Context</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{item.context.usage}</p>
                  </div>
                </div>
                
                {/* Terminal Block for Tools */}
                {item.command && (
                  <div className="pt-2">
                    <TerminalBlock command={item.command} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Schema Modal */}
      <AnimatePresence>
        {showSchema && (
          <SchemaViewer item={item} onClose={() => setShowSchema(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function LabPage() {
  const [activeTab, setActiveTab] = useState('apps');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Educational Lab</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            The Dual-Threat Portfolio
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Systems I&apos;ve architected that bridge <span className="text-teal-500 font-semibold">Strategic Marketing</span> and <span className="text-orange-500 font-semibold">Technical Engineering</span>. 
            Each showcases the thinking, architecture, and impact behind the solution.
          </p>
          
          <p className="text-sm text-muted-foreground mt-4 italic">
            &quot;I don&apos;t just run campaigns; I architect the engines that power them.&quot;
          </p>
        </motion.div>
        
        {/* Tabs */}
        <Tabs defaultValue="apps" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger 
                value="apps" 
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400"
              >
                <Laptop className="h-4 w-4 mr-2" />
                Applications ({labApps.length})
              </TabsTrigger>
              <TabsTrigger 
                value="tools"
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400"
              >
                <Terminal className="h-4 w-4 mr-2" />
                Engineering ({labTools.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Apps Tab */}
          <TabsContent value="apps">
            <motion.div
              key="apps"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {labApps.map((item, index) => (
                <InfoCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools">
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {labTools.map((item, index) => (
                <InfoCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-sm text-muted-foreground">Revenue Apps</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">Engineering Tools</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
