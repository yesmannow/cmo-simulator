'use client';

import { generateCompanyLogoSvg, type CompanyLogoStyle } from '@/components/LogoGenerator';
import { cn } from '@/lib/utils';

export function CompanyMark({
  companyName,
  industry,
  size = 36,
  style = 'orb',
  className,
}: {
  companyName: string;
  industry: string;
  size?: number;
  style?: CompanyLogoStyle;
  className?: string;
}) {
  const safeName = companyName?.trim() ? companyName.trim() : 'New Workspace';
  const safeIndustry = industry || 'saas';
  const svg = generateCompanyLogoSvg({ companyName: safeName, industry: safeIndustry, size, style });

  return (
    <div
      className={cn('shrink-0', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

