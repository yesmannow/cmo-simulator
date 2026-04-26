import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { SimulationDebriefReport } from '@/lib/simulationReport';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: '1 solid #cbd5e1',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#475569',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    textTransform: 'uppercase',
    color: '#334155',
  },
  summaryGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 700,
  },
  block: {
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  blockLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 4,
  },
  blockText: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  cellQuarter: {
    width: '12%',
    fontWeight: 700,
  },
  cellMetric: {
    width: '20%',
  },
  cellTactics: {
    width: '28%',
  },
  tableHeader: {
    color: '#475569',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  listItem: {
    marginBottom: 6,
    lineHeight: 1.4,
  },
});

interface SimulationDebriefPdfProps {
  report: SimulationDebriefReport;
}

export function SimulationDebriefPdf({ report }: SimulationDebriefPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>CMO Simulator Quarterly Report</Text>
          <Text style={styles.subtitle}>
            Generated {report.generatedAt}
            {report.user?.email ? ` | ${report.user.name ? `${report.user.name} · ` : ''}${report.user.email}` : ''}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Strategic Score</Text>
            <Text style={styles.statValue}>{report.score}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Grade</Text>
            <Text style={styles.statValue}>{report.grade}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>{formatCurrency(report.finalKpis.revenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Profit</Text>
            <Text style={styles.statValue}>{formatCurrency(report.finalKpis.profit)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Market Share</Text>
            <Text style={styles.statValue}>{report.finalKpis.marketShare.toFixed(1)}%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Customer Satisfaction</Text>
            <Text style={styles.statValue}>{report.finalKpis.customerSatisfaction.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Outcome</Text>
            <Text style={styles.blockText}>{report.summary.outcome}</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Why</Text>
            <Text style={styles.blockText}>{report.summary.why}</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Tradeoff</Text>
            <Text style={styles.blockText}>{report.primaryTradeoff}</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>Recommended Next Move</Text>
            <Text style={styles.blockText}>{report.nextMove}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quarterly Table</Text>
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={styles.cellQuarter}>Quarter</Text>
            <Text style={styles.cellMetric}>Revenue</Text>
            <Text style={styles.cellMetric}>Profit</Text>
            <Text style={styles.cellMetric}>Share</Text>
            <Text style={styles.cellTactics}>Tactics</Text>
          </View>
          {report.quarterRows.map((row) => (
            <View key={row.quarter} style={styles.row}>
              <Text style={styles.cellQuarter}>{row.quarter}</Text>
              <Text style={styles.cellMetric}>{formatCurrency(row.revenue)}</Text>
              <Text style={styles.cellMetric}>{formatCurrency(row.profit)}</Text>
              <Text style={styles.cellMetric}>{row.marketShare.toFixed(1)}%</Text>
              <Text style={styles.cellTactics}>{row.tactics.length > 0 ? row.tactics.join(', ') : 'No tactics committed'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Decisions</Text>
          {report.topDecisions.map((decision) => (
            <Text key={`${decision.quarter}-${decision.name}`} style={styles.listItem}>
              {decision.quarter}: {decision.name} ({decision.category}, {formatCurrency(decision.cost)})
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biggest Risk</Text>
          <View style={styles.block}>
            <Text style={styles.blockText}>{report.topRisk}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}
