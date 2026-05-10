import { QuarterDebriefClient } from './QuarterDebriefClient';

export default async function QuarterDebriefPage({
  params,
}: {
  params: Promise<{ quarter: string }>;
}) {
  const { quarter } = await params;

  return <QuarterDebriefClient quarterSlug={quarter} />;
}
