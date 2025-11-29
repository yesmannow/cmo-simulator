import { LabItem } from '@/types';

export const labItems: LabItem[] = [
  // --------------------------
  // CLIENT APPS (Marketing/Revenue)
  // --------------------------

  {
    id: "growth-engine",
    title: "Growth Engine",
    type: "app",
    category: "Revenue Ops",
    tagline: "Interactive ROI Modeler & CPQ System",
    techStack: ["React", "Recharts", "Zod", "PDF-Lib"],
    status: "operational",
    context: {
      problem:
        "Sales teams were relying on inconsistent, error-prone spreadsheets for pricing proposals. No visualization, no guardrails, and no clear ROI narrative led to stalled deals.",
      solution:
        "A structured CPQ system powered by a React state machine, validated inputs using Zod, and dynamic ROI visualizations built with Recharts. The system eliminated manual calculations and ensured compliant pricing every time.",
      impact:
        "Cut proposal generation time by ~90% and boosted close rates by providing prospects with an interactive model that clarified financial value instantly.",
      target: "Sales Directors, CFOs, Revenue Leaders",
      usage:
        "Used live during sales calls or sent as a pre-meeting pre-read for executives who require ROI justification."
    },
    link: "/apps/growth-engine"
  },

  {
    id: "license-hub",
    title: "License Hub",
    type: "app",
    category: "Compliance",
    tagline: "50-state CEU Intelligence Engine",
    techStack: ["Next.js", "PostgreSQL", "GeoIP", "React Map GL"],
    status: "operational",
    context: {
      problem:
        "Clinicians were routinely missing CEU and renewal requirements because licensing rules vary drastically between states and professions.",
      solution:
        "A relational database mapping 50 states to 14+ healthcare license types, dynamically filtered via GeoIP detection. The app provides instant, location-aware CEU instructions.",
      impact:
        "Became the #1 lead magnet for the brand—driving 40% of all new users and reinforcing authority in the compliance space.",
      target: "PT/OT/RN Clinicians, Compliance Officers",
      usage:
        "Used 1–2 times a year during renewal cycles and shared across multi-state clinical teams."
    },
    link: "/apps/license-hub"
  },

  {
    id: "seo-scanner",
    title: "SEO Scanner",
    type: "app",
    category: "Marketing Tech",
    tagline: "Edge-Based HTML Audit Tool",
    techStack: ["Cloudflare Workers", "HTMLRewriter", "Cheerio"],
    status: "beta",
    context: {
      problem:
        "Marketing teams were publishing content with broken meta tags, missing OG images, and inconsistent page titles—hurting share performance and SEO.",
      solution:
        "A serverless scanner deployed at the Edge using Cloudflare Workers. It fetches HTML instantly and parses metadata using HTMLRewriter without heavy crawlers.",
      impact:
        "Eliminated broken social cards, improved sharing CTR, and empowered non-technical editors to self-audit pages before launch.",
      target: "SEOs, Content Managers, Social Media Teams",
      usage:
        "Run as a pre-flight audit before promoting new pages or publishing seasonal campaigns."
    },
    link: "/apps/seo-scanner"
  },

  {
    id: "clinical-compass",
    title: "Clinical Compass",
    type: "app",
    category: "Clinical Ops",
    tagline: "Multi-step Protocol Wizard",
    techStack: ["React Context", "Framer Motion", "Decision Trees"],
    status: "operational",
    context: {
      problem:
        "Clinicians, especially new hires, were skipping protocol steps because printed reference sheets were clunky and outdated.",
      solution:
        "A decision-tree-driven protocol wizard that progressively reveals guidance, reducing cognitive load. Animated transitions keep users oriented in multi-step processes.",
      impact:
        "Standardized care across 50+ clinic locations and significantly cut down training ramp-up time for junior clinicians.",
      target: "Medical Directors, Junior Clinicians",
      usage:
        "Used at point-of-care during complex assessments or as a training aide during onboarding."
    },
    link: "/apps/clinical-compass"
  },

  // --------------------------
  // INTERNAL TOOLS (DevOps/Automation)
  // --------------------------

  {
    id: "mcp-cli",
    title: "MCP CLI Wrapper",
    type: "tool",
    category: "DevOps",
    tagline: "Unified Command Interface",
    techStack: ["Node.js", "Commander.js", "Child Process"],
    status: "operational",
    context: {
      problem:
        "Running and validating multiple MCP servers required memorizing inconsistent, scattered terminal commands—leading to onboarding friction.",
      solution:
        "A unified CLI wrapper abstracting all operations into simple verbs like `start`, `probe`, and `smoke`, with a built-in dry-run mode for safety.",
      impact:
        "Reduced onboarding time, prevented environment drift, and standardized internal DevOps workflows.",
      target: "Full-Stack Engineers, AI Toolchain Developers",
      usage:
        "Used daily in local development or before pushing new MCP configurations."
    },
    command: "node scripts/mcp-cli.js start"
  },

  {
    id: "image-pipeline",
    title: "Image Build Pipeline",
    type: "tool",
    category: "Automation",
    tagline: "Automated Asset Optimization Factory",
    techStack: ["Sharp", "Node.js", "WebP"],
    status: "operational",
    context: {
      problem:
        "Large uncompressed marketing images were bloating the repo, slowing LCP, and tanking Lighthouse scores.",
      solution:
        "A Node-driven pipeline that watches for new assets, generates optimized WebP/AVIF versions, and produces manifests for responsive loading.",
      impact:
        "Reduced build size by 60%, improved Lighthouse Performance to 98+, and ensured consistent image hygiene.",
      target: "Performance Engineers, Marketing Ops",
      usage:
        "Triggered automatically during builds and integrated into CI/CD."
    },
    command: "npm run build:images"
  },

  {
    id: "content-scraper",
    title: "Scrape & Generate CLI",
    type: "tool",
    category: "Content Gen",
    tagline: "AI-Powered Inspiration Fetcher",
    techStack: ["Cheerio", "Axios", "Gemini AI"],
    status: "beta",
    context: {
      problem:
        "Creative teams wasted hours manually collecting inspiration and summarizing trends for design direction.",
      solution:
        "A scraper that gathers visuals from gallery sites, uses AI to summarize aesthetic patterns, and outputs structured Markdown frontmatter.",
      impact:
        "Saved ~5 hours weekly and created a reusable inspiration dataset for UX and brand design.",
      target: "Creative Directors, Designers",
      usage:
        "Run during creative sprints or weekly inspiration refresh cycles."
    },
    command: "node scripts/scrape-generate.js --source=dribbble"
  }
];

// Helper function to filter lab items by type
export const getLabItemsByType = (type: 'app' | 'tool'): LabItem[] => {
  return labItems.filter(item => item.type === type);
};

// Get all apps
export const labApps = labItems.filter(item => item.type === 'app');

// Get all tools
export const labTools = labItems.filter(item => item.type === 'tool');
