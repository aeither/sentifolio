'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarketSignal {
  agentName: string;
  sentimentScore: number;
  marketTrend: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  liquidityAction: string;
  confidence: number;
}

interface AnalysisResponse {
  signals: MarketSignal[];
  aiAdvice: string;
  timestamp: string;
}

export default function DeFiAIPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResponse | null>(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analyze');
      if (!response.ok) throw new Error('Failed to fetch analysis');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getTrendColor = (trend: MarketSignal['marketTrend']) => {
    switch (trend) {
      case 'STRONG_BUY': return 'text-green-600 font-bold';
      case 'BUY': return 'text-green-500';
      case 'STRONG_SELL': return 'text-red-600 font-bold';
      case 'SELL': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6 bg-red-50">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-4xl font-bold mb-8">AI Agent Analysis Dashboard</h1>
      
      {/* AI Advice Section */}
      <Card className="p-6 bg-blue-50">
        <h2 className="text-xl font-bold mb-4">AI Trading Advice</h2>
        <div className="whitespace-pre-line">
          {data?.aiAdvice}
        </div>
      </Card>

      {/* Market Signals Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Market Signals</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Sentiment Score</TableHead>
              <TableHead>Market Trend</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.signals.map((signal) => (
              <TableRow key={signal.agentName}>
                <TableCell className="font-medium">{signal.agentName}</TableCell>
                <TableCell>{signal.sentimentScore.toFixed(2)}</TableCell>
                <TableCell className={getTrendColor(signal.marketTrend)}>
                  {signal.marketTrend}
                </TableCell>
                <TableCell>{signal.liquidityAction}</TableCell>
                <TableCell>{signal.confidence.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Last Updated */}
      <div className="text-sm text-gray-500 text-right">
        Last updated: {new Date(data?.timestamp || '').toLocaleString()}
      </div>
    </div>
  );
}