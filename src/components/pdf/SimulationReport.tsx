import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { SimulationContext } from '@/lib/simMachine';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '40%',
    color: '#374151',
  },
  value: {
    fontSize: 12,
    width: '60%',
    color: '#1f2937',
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  grade: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#059669',
    marginRight: 15,
  },
  gradeText: {
    fontSize: 14,
    color: '#374151',
  },
  quarterlyTable: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #f3f4f6',
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#374151',
  },
  insightBox: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: '3 solid #0ea5e9',
  },
  insightText: {
    fontSize: 11,
    color: '#0c4a6e',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
});

interface SimulationReportProps {
  context: SimulationContext;
  generatedAt: Date;
}

export const SimulationReport: React.FC<SimulationReportProps> = ({ context, generatedAt }) => {
  // Calculate metrics
  const quarterlyData = [
    { quarter: 'Q1', ...context.quarters.Q1.results, budget: context.quarters.Q1.budgetSpent },
    { quarter: 'Q2', ...context.quarters.Q2.results, budget: context.quarters.Q2.budgetSpent },
    { quarter: 'Q3', ...context.quarters.Q3.results, budget: context.quarters.Q3.budgetSpent },
    { quarter: 'Q4', ...context.quarters.Q4.results, budget: context.quarters.Q4.budgetSpent },
  ];

  const totalRevenue = quarterlyData.reduce((sum, q) => sum + q.revenue, 0);
  const totalBudgetSpent = quarterlyData.reduce((sum, q) => sum + q.budget, 0);
  const roi = totalBudgetSpent > 0 ? ((totalRevenue - totalBudgetSpent) / totalBudgetSpent) * 100 : 0;
  const finalMarketShare = context.quarters.Q4.results.marketShare;
  const finalSatisfaction = context.quarters.Q4.results.customerSatisfaction;
  const finalAwareness = context.quarters.Q4.results.brandAwareness;

  const overallScore = Math.round((roi * 0.4 + finalMarketShare * 2 + finalSatisfaction * 0.8 + finalAwareness * 0.6) / 4);

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const grade = getGrade(overallScore);

  // Tactic analysis
  const allTactics = [
    ...context.quarters.Q1.tactics,
    ...context.quarters.Q2.tactics,
    ...context.quarters.Q3.tactics,
    ...context.quarters.Q4.tactics,
  ];

  return (
    <Document>
      {/* Page 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>CMO Simulation Report</Text>
          <Text style={styles.subtitle}>
            Marketing Campaign Performance Analysis
          </Text>
          <Text style={styles.subtitle}>
            Generated on {generatedAt.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.gradeContainer}>
          <Text style={styles.grade}>{grade}</Text>
          <View>
            <Text style={styles.gradeText}>Overall Grade</Text>
            <Text style={styles.gradeText}>Score: {overallScore}/100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>${totalRevenue.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Total Revenue Generated</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{roi.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Return on Investment</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{finalMarketShare.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Final Market Share</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{finalSatisfaction.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Customer Satisfaction</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Overview</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Target Audience:</Text>
            <Text style={styles.value}>{context.strategy.targetAudience || 'Not specified'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Brand Positioning:</Text>
            <Text style={styles.value}>{context.strategy.brandPositioning || 'Not specified'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Primary Channels:</Text>
            <Text style={styles.value}>
              {context.strategy.primaryChannels?.join(', ') || 'Not specified'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Budget:</Text>
            <Text style={styles.value}>${context.totalBudget.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Budget Utilized:</Text>
            <Text style={styles.value}>
              ${totalBudgetSpent.toLocaleString()} ({((totalBudgetSpent / context.totalBudget) * 100).toFixed(1)}%)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Achievements</Text>
          {roi > 200 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                🏆 Exceptional ROI Performance: Achieved {roi.toFixed(1)}% return on investment, demonstrating outstanding marketing efficiency.
              </Text>
            </View>
          )}
          {finalMarketShare > 25 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                🎯 Market Leadership: Captured {finalMarketShare.toFixed(1)}% market share, establishing strong competitive position.
              </Text>
            </View>
          )}
          {context.hiredTalent.length > 0 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                👥 Strategic Talent Investment: Successfully hired {context.hiredTalent.length} key team member(s) to enhance capabilities.
              </Text>
            </View>
          )}
          {context.selectedBigBet && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                ⚡ Bold Strategic Move: Executed big bet on "{context.selectedBigBet.name}" showing strategic courage.
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          CMO Simulator Report - Page 1 of 2
        </Text>
      </Page>

      {/* Page 2: Detailed Analytics */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quarterly Performance Analysis</Text>
          <View style={styles.quarterlyTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Quarter</Text>
              <Text style={styles.tableCellHeader}>Revenue</Text>
              <Text style={styles.tableCellHeader}>Investment</Text>
              <Text style={styles.tableCellHeader}>Market Share</Text>
              <Text style={styles.tableCellHeader}>Satisfaction</Text>
              <Text style={styles.tableCellHeader}>Awareness</Text>
            </View>
            {quarterlyData.map((quarter) => (
              <View key={quarter.quarter} style={styles.tableRow}>
                <Text style={styles.tableCell}>{quarter.quarter}</Text>
                <Text style={styles.tableCell}>${(quarter.revenue / 1000).toFixed(0)}K</Text>
                <Text style={styles.tableCell}>${(quarter.budget / 1000).toFixed(0)}K</Text>
                <Text style={styles.tableCell}>{quarter.marketShare.toFixed(1)}%</Text>
                <Text style={styles.tableCell}>{quarter.customerSatisfaction.toFixed(1)}%</Text>
                <Text style={styles.tableCell}>{quarter.brandAwareness.toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing Tactics Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Tactics Deployed:</Text>
            <Text style={styles.value}>{allTactics.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Average Cost per Tactic:</Text>
            <Text style={styles.value}>
              ${allTactics.length > 0 ? (totalBudgetSpent / allTactics.length).toLocaleString() : '0'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wildcard Events Handled:</Text>
            <Text style={styles.value}>{context.wildcards.length}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Recommendations</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              Based on your performance, consider focusing on high-ROI tactics and maintaining consistent investment in brand awareness initiatives.
            </Text>
          </View>
          {roi < 100 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                💡 Opportunity: ROI below 100% suggests room for optimization in tactic selection and budget allocation.
              </Text>
            </View>
          )}
          {finalMarketShare < 15 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                📈 Growth Potential: Market share below 15% indicates significant expansion opportunities.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decision Timeline</Text>
          {quarterlyData.map((quarter, idx) => {
            const quarterKey = `Q${idx + 1}` as keyof typeof context.quarters;
            const quarterData = context.quarters[quarterKey];
            const tacticsCount = quarterData?.tactics?.length || 0;
            const wildcardsCount = quarterData?.wildcardEvents?.length || 0;

            return (
              <View key={quarter.quarter} style={[styles.insightBox, { marginBottom: 8 }]}>
                <Text style={[styles.insightText, { fontWeight: 'bold', marginBottom: 4 }]}>
                  {quarter.quarter}: {tacticsCount} tactics deployed, {wildcardsCount} events handled
                </Text>
                <Text style={[styles.insightText, { fontSize: 9 }]}>
                  Budget: ${(quarter.budget / 1000).toFixed(0)}K |
                  Revenue: ${(quarter.revenue / 1000).toFixed(0)}K |
                  Market Share: {quarter.marketShare.toFixed(1)}%
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Methodology & Scoring</Text>
          <Text style={[styles.insightText, { fontSize: 10, lineHeight: 1.3 }]}>
            This simulation evaluates marketing performance across four key dimensions: ROI (40% weight),
            Market Share growth (30% weight), Customer Satisfaction (20% weight), and Brand Awareness (10% weight).
            Scores are calculated based on industry benchmarks and best practices in marketing performance measurement.
          </Text>
        </View>

        <Text style={styles.footer}>
          CMO Simulator Report - Page 2 of 3 | Generated by CMO Simulator Platform
        </Text>
      </Page>

      {/* Page 3: Competitive Analysis & Learning Outcomes */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competitive Analysis</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Market Landscape:</Text>
            <Text style={styles.value}>
              {context.strategy.marketLandscape ?
                context.strategy.marketLandscape.charAt(0).toUpperCase() +
                context.strategy.marketLandscape.slice(1).replace(/([A-Z])/g, ' $1') :
                'Not specified'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Final Market Position:</Text>
            <Text style={styles.value}>
              {finalMarketShare >= 30 ? 'Market Leader' :
               finalMarketShare >= 20 ? 'Strong Competitor' :
               finalMarketShare >= 10 ? 'Market Player' :
               'Emerging Player'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Market Share Growth:</Text>
            <Text style={styles.value}>
              {((finalMarketShare - context.quarters.Q1.results.marketShare) /
                context.quarters.Q1.results.marketShare * 100).toFixed(1)}%
              ({context.quarters.Q1.results.marketShare.toFixed(1)}% → {finalMarketShare.toFixed(1)}%)
            </Text>
          </View>

          {context.wildcards.length > 0 && (
            <View style={[styles.insightBox, { marginTop: 10 }]}>
              <Text style={[styles.insightText, { fontWeight: 'bold', marginBottom: 4 }]}>
                Competitive Events Handled: {context.wildcards.length}
              </Text>
              <Text style={[styles.insightText, { fontSize: 9 }]}>
                Successfully navigated {context.wildcards.filter(w => w.type === 'market_shift' || w.type === 'competitor_action').length} competitive
                events, demonstrating strategic agility and market responsiveness.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Outcomes</Text>

          <View style={[styles.insightBox, { backgroundColor: '#f0fdf4', borderLeft: '3 solid #22c55e' }]}>
            <Text style={[styles.insightText, { color: '#166534', fontWeight: 'bold', marginBottom: 4 }]}>
              ✅ Strengths Identified
            </Text>
            {roi > 150 && (
              <Text style={[styles.insightText, { color: '#166534', fontSize: 10 }]}>
                • Strong ROI performance demonstrates effective budget allocation and tactic selection
              </Text>
            )}
            {finalMarketShare > 20 && (
              <Text style={[styles.insightText, { color: '#166534', fontSize: 10 }]}>
                • Market share growth indicates successful competitive positioning
              </Text>
            )}
            {finalSatisfaction > 80 && (
              <Text style={[styles.insightText, { color: '#166534', fontSize: 10 }]}>
                • High customer satisfaction reflects strong brand and product alignment
              </Text>
            )}
            {context.hiredTalent.length > 0 && (
              <Text style={[styles.insightText, { color: '#166534', fontSize: 10 }]}>
                • Strategic talent investment shows long-term thinking
              </Text>
            )}
          </View>

          <View style={[styles.insightBox, { backgroundColor: '#fef3c7', borderLeft: '3 solid #f59e0b' }]}>
            <Text style={[styles.insightText, { color: '#92400e', fontWeight: 'bold', marginBottom: 4 }]}>
              📈 Growth Opportunities
            </Text>
            {roi < 100 && (
              <Text style={[styles.insightText, { color: '#92400e', fontSize: 10 }]}>
                • Focus on optimizing ROI through better tactic selection and budget efficiency
              </Text>
            )}
            {finalMarketShare < 15 && (
              <Text style={[styles.insightText, { color: '#92400e', fontSize: 10 }]}>
                • Increase market share through more aggressive competitive positioning
              </Text>
            )}
            {totalBudgetSpent < context.totalBudget * 0.8 && (
              <Text style={[styles.insightText, { color: '#92400e', fontSize: 10 }]}>
                • Utilize more of available budget to maximize growth potential
              </Text>
            )}
            {finalAwareness < 50 && (
              <Text style={[styles.insightText, { color: '#92400e', fontSize: 10 }]}>
                • Invest more in brand awareness initiatives for long-term value
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Marketing Concepts Demonstrated</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Share of Voice:</Text>
            <Text style={styles.value}>
              Your spending relative to competitors determined market share through the Share of Voice model
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Compounding Growth:</Text>
            <Text style={styles.value}>
              SEO and content investments showed exponential growth (15% per quarter)
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Diminishing Returns:</Text>
            <Text style={styles.value}>
              Paid advertising effectiveness decreased as market saturation increased
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Brand Equity Impact:</Text>
            <Text style={styles.value}>
              Hidden brand equity metric ({context.brandEquity.toFixed(0)}/100) affected conversion rates throughout
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Team Morale:</Text>
            <Text style={styles.value}>
              Team morale ({context.morale.toFixed(0)}/100) influenced all campaign effectiveness
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps & Recommendations</Text>

          <View style={[styles.insightBox, { backgroundColor: '#eff6ff', borderLeft: '3 solid #3b82f6' }]}>
            <Text style={[styles.insightText, { color: '#1e40af', fontWeight: 'bold', marginBottom: 6 }]}>
              Strategic Recommendations
            </Text>
            <Text style={[styles.insightText, { color: '#1e40af', fontSize: 10, marginBottom: 4 }]}>
              1. {roi < 150 ? 'Focus on high-ROI tactics and optimize budget allocation' :
                   'Maintain current ROI performance while exploring new channels'}
            </Text>
            <Text style={[styles.insightText, { color: '#1e40af', fontSize: 10, marginBottom: 4 }]}>
              2. {finalMarketShare < 20 ? 'Increase competitive spending to capture more market share' :
                   'Protect market position through consistent brand investment'}
            </Text>
            <Text style={[styles.insightText, { color: '#1e40af', fontSize: 10, marginBottom: 4 }]}>
              3. {finalAwareness < 60 ? 'Invest more in brand awareness for long-term growth' :
                   'Leverage strong brand awareness for conversion optimization'}
            </Text>
            <Text style={[styles.insightText, { color: '#1e40af', fontSize: 10 }]}>
              4. Continue strategic talent investment and maintain team morale above 70
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          CMO Simulator Report - Page 3 of 3 | Generated by CMO Simulator Platform
        </Text>
      </Page>
    </Document>
  );
};
