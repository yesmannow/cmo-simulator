import { useMemo } from 'react';

interface LogoGeneratorProps {
  companyName: string;
  industry: string;
  style?: CompanyLogoStyle;
}

export type CompanyLogoStyle = 'orb' | 'badge' | 'monogram';

// Industry color schemes
const INDUSTRY_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  healthcare: { primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7' },
  legal: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' },
  ecommerce: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d' },
  saas: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd' },
  fintech: { primary: '#06b6d4', secondary: '#22d3ee', accent: '#67e8f9' },
  education: { primary: '#f97316', secondary: '#fb923c', accent: '#fdba74' },
  'real-estate': { primary: '#84cc16', secondary: '#a3e635', accent: '#bef264' },
  'food-delivery': { primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5' },
  fitness: { primary: '#ec4899', secondary: '#f973d4', accent: '#fbcfe8' },
  automotive: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1' },
  travel: { primary: '#14b8a6', secondary: '#5eead4', accent: '#a7f3d0' },
  gaming: { primary: '#7c3aed', secondary: '#a855f7', accent: '#c084fc' },
  fashion: { primary: '#db2777', secondary: '#e879b7', accent: '#f3a8d4' },
  construction: { primary: '#92400e', secondary: '#d97706', accent: '#f59e0b' },
  energy: { primary: '#059669', secondary: '#10b981', accent: '#34d399' },
  agritech: { primary: '#166534', secondary: '#22c55e', accent: '#4ade80' },
  manufacturing: { primary: '#374151', secondary: '#6b7280', accent: '#9ca3af' },
  nonprofit: { primary: '#dc2626', secondary: '#ef4444', accent: '#f87171' },
  music: { primary: '#7c2d12', secondary: '#ea580c', accent: '#fb923c' },
  sports: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
  'pet-care': { primary: '#a855f7', secondary: '#c084fc', accent: '#d8b4fe' },
  'home-services': { primary: '#0d9488', secondary: '#14b8a6', accent: '#5eead4' },
  cannabis: { primary: '#16a34a', secondary: '#22c55e', accent: '#4ade80' },
  space: { primary: '#1e1b4b', secondary: '#312e81', accent: '#6366f1' }
};

function getInitials(companyName: string) {
  const words = companyName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'CO';
  return words
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 3)
    .join('');
}

export function generateCompanyLogoSvg(options: {
  companyName: string;
  industry: string;
  size: number;
  style?: CompanyLogoStyle;
}) {
  const { companyName, industry, size } = options;
  const style: CompanyLogoStyle = options.style ?? 'orb';

  const initials = getInitials(companyName);
  const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.healthcare;

  const nameHash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pattern = nameHash % 4; // 0-3 patterns
  const idBase = `${companyName}-${industry}-${size}-${style}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const gradientId = `${idBase}-bg`;
  const filterId = `${idBase}-soft`;
  const secondaryGradientId = `${idBase}-accent`;

  const defs = `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
      <linearGradient id="${secondaryGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(255,255,255,0.32);stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.68" />
      </linearGradient>
      <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,0.18)" />
      </filter>
    </defs>
  `;

  const overlay =
    pattern === 1
      ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 10}" fill="none" stroke="url(#${secondaryGradientId})" stroke-width="2" stroke-dasharray="5,6" opacity="0.44" />`
      : pattern === 2
        ? `<rect x="14" y="14" width="${size - 28}" height="${size - 28}" fill="none" stroke="url(#${secondaryGradientId})" stroke-width="2" rx="14" opacity="0.4" />`
        : pattern === 3
          ? `<path d="M ${size / 2} 14 L ${size - 16} ${size - 26} L 16 ${size - 26} Z" fill="none" stroke="url(#${secondaryGradientId})" stroke-width="2" opacity="0.34" />`
          : '';

  const monogram = `
    <text x="${size / 2}" y="${size / 2 + 10}" font-size="${Math.round(size * 0.22)}" font-weight="700"
      letter-spacing="${Math.round(size * 0.01)}" text-anchor="middle" fill="white" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">
      ${initials}
    </text>
  `;

  if (style === 'monogram') {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${companyName}">
        ${defs}
        <rect x="8" y="8" width="${size - 16}" height="${size - 16}" rx="${Math.round(size * 0.14)}" fill="url(#${gradientId})" filter="url(#${filterId})" />
        <rect x="14" y="14" width="${size - 28}" height="${size - 28}" rx="${Math.round(size * 0.12)}" fill="rgba(15,23,42,0.12)" stroke="rgba(255,255,255,0.24)" />
        <path d="M ${size * 0.18} ${size * 0.32} H ${size * 0.82}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        <path d="M ${size * 0.18} ${size * 0.68} H ${size * 0.82}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        ${overlay}
        <text x="${size / 2}" y="${size / 2 + 11}" font-size="${Math.round(size * 0.24)}" font-weight="800"
          letter-spacing="${Math.round(size * 0.03)}" text-anchor="middle" fill="white" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">
          ${initials}
        </text>
      </svg>
    `;
  }

  if (style === 'badge') {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${companyName}">
        ${defs}
        <rect x="6" y="6" width="${size - 12}" height="${size - 12}" rx="${Math.round(size * 0.18)}" fill="url(#${gradientId})" filter="url(#${filterId})" />
        <rect x="10" y="10" width="${size - 20}" height="${size - 20}" rx="${Math.round(size * 0.16)}" fill="none" stroke="rgba(255,255,255,0.25)" />
        <path d="M 18 ${size * 0.28} H ${size - 18}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
        ${overlay}
        ${monogram}
      </svg>
    `;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${companyName}">
      ${defs}
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#${gradientId})" filter="url(#${filterId})" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" fill="none" stroke="rgba(255,255,255,0.22)" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 11}" fill="none" stroke="rgba(255,255,255,0.1)" />
      ${overlay}
      ${monogram}
    </svg>
  `;
}

export function LogoGenerator({ companyName, industry, style }: LogoGeneratorProps) {
  const svg = useMemo(() => {
    if (!companyName.trim()) return '';
    return generateCompanyLogoSvg({ companyName, industry, size: 120, style });
  }, [companyName, industry, style]);

  const styleLabel =
    style === 'badge' ? 'Ledger Badge' : style === 'monogram' ? 'Monogram Plate' : 'Executive Orb';

  if (!companyName.trim()) {
    return (
      <div className="flex h-36 w-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100/80 px-4 text-center">
        <span className="text-sm font-semibold text-slate-500">Identity Preview</span>
        <span className="mt-1 text-xs text-slate-400">Name the workspace to generate a professional mark.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div
        className="flex h-36 w-40 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{styleLabel}</div>
        <div className="mt-1 text-sm font-semibold text-slate-800">{companyName}</div>
        <div className="text-xs capitalize text-slate-500">{industry.replace('-', ' ')}</div>
      </div>
    </div>
  );
}
