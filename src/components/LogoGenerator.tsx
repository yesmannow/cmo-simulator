import { useMemo } from 'react';

interface LogoGeneratorProps {
  companyName: string;
  industry: string;
}

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

// Industry icons/symbols
const INDUSTRY_ICONS: Record<string, string> = {
  healthcare: '🏥',
  legal: '⚖️',
  ecommerce: '🛒',
  saas: '💻',
  fintech: '💰',
  education: '📚',
  'real-estate': '🏠',
  'food-delivery': '🍕',
  fitness: '💪',
  automotive: '🚗',
  travel: '✈️',
  gaming: '🎮',
  fashion: '👗',
  construction: '🏗️',
  energy: '⚡',
  agritech: '🌾',
  manufacturing: '🏭',
  nonprofit: '🤝',
  music: '🎵',
  sports: '⚽',
  'pet-care': '🐕',
  'home-services': '🔧',
  cannabis: '🌿',
  space: '🚀'
};

export function LogoGenerator({ companyName, industry }: LogoGeneratorProps) {
  const logoData = useMemo(() => {
    // Get initials
    const words = companyName.trim().split(/\s+/);
    const initials = words.map(word => word.charAt(0).toUpperCase()).slice(0, 3).join('');

    // Get colors
    const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.healthcare;
    const icon = INDUSTRY_ICONS[industry] || '🏢';

    // Generate a simple pattern based on company name
    const nameHash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern = nameHash % 4; // 0-3 different patterns

    return { initials, colors, icon, pattern };
  }, [companyName, industry]);

  const generateLogo = () => {
    const { initials, colors, icon, pattern } = logoData;
    const size = 120;

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#bg)" />

        <!-- Pattern overlay -->
        ${pattern === 1 ? `
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" fill="none" stroke="${colors.accent}" stroke-width="2" stroke-dasharray="5,5" opacity="0.3" />
        ` : ''}
        ${pattern === 2 ? `
          <rect x="15" y="15" width="${size-30}" height="${size-30}" fill="none" stroke="${colors.accent}" stroke-width="2" rx="10" opacity="0.3" />
        ` : ''}
        ${pattern === 3 ? `
          <polygon points="${size/2},15 ${size-15},${size-25} 15,${size-25}" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.3" />
        ` : ''}

        <!-- Industry icon -->
        <text x="${size/2}" y="${size/2 - 15}" font-size="24" text-anchor="middle" fill="white">${icon}</text>

        <!-- Company initials -->
        <text x="${size/2}" y="${size/2 + 15}" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${initials}</text>
      </svg>
    `;
  };

  if (!companyName.trim()) {
    return (
      <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <span className="text-gray-400 text-sm">Logo Preview</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="w-32 h-32 rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg"
        dangerouslySetInnerHTML={{ __html: generateLogo() }}
      />
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700">{companyName}</div>
        <div className="text-xs text-gray-500 capitalize">{industry.replace('-', ' ')}</div>
      </div>
    </div>
  );
}
