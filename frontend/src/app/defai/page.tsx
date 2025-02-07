'use client';

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from 'react';

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
  warnings?: string[];
  error?: string;
  details?: string;
}

export default function DeFiAIPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analyze');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch analysis');
      }
      
      if (result.error) {
        throw new Error(`${result.error}: ${result.details || ''}`);
      }

      setData(result);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const timeout = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchAnalysis();
        }, timeout);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getTrendColor = (trend: MarketSignal['marketTrend']) => {
    switch (trend) {
      case 'STRONG_BUY': return 'text-emerald-400 font-bold';
      case 'BUY': return 'text-emerald-500';
      case 'STRONG_SELL': return 'text-rose-400 font-bold';
      case 'SELL': return 'text-rose-500';
      default: return 'text-gray-400';
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8">AI Agent Analysis Dashboard</h1>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <p className="text-gray-600">Loading market signals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8">AI Agent Analysis Dashboard</h1>
          <Card className="p-6 bg-red-50">
            <h2 className="text-xl font-bold text-red-700">Error</h2>
            <p className="text-red-600 mt-2">{error}</p>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={() => {
                setRetryCount(0);
                fetchAnalysis();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
              AI Agent Analysis Dashboard
            </span>
          </h1>
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-b-2 border-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Updating...</span>
            </div>
          )}
        </div>
        
        {/* AI Advice Section */}
        <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
            AI Trading Advice
          </h2>
          <div className="whitespace-pre-line text-gray-300">
            {data?.aiAdvice}
          </div>
        </Card>

        {/* Warnings Section */}
        {data?.warnings && data.warnings.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-yellow-950/30 border border-yellow-500/20">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Warnings</h2>
            <ul className="list-disc list-inside space-y-2">
              {data.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-300/80">{warning}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Market Signals Table */}
        <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
            Market Signals
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400">Agent</TableHead>
                  <TableHead className="text-gray-400">Sentiment Score</TableHead>
                  <TableHead className="text-gray-400">Market Trend</TableHead>
                  <TableHead className="text-gray-400">Action</TableHead>
                  <TableHead className="text-gray-400">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.signals.map((signal) => (
                  <TableRow key={signal.agentName} className="border-white/10">
                    <TableCell className="font-medium text-gray-300">{signal.agentName}</TableCell>
                    <TableCell className="text-gray-300">{signal.sentimentScore.toFixed(2)}</TableCell>
                    <TableCell className={getTrendColor(signal.marketTrend)}>
                      {signal.marketTrend}
                    </TableCell>
                    <TableCell className="text-gray-300">{signal.liquidityAction}</TableCell>
                    <TableCell className="text-gray-300">{signal.confidence.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Last Updated */}
        <div className="text-sm text-gray-500 text-right">
          Last updated: {new Date(data?.timestamp || '').toLocaleString()}
        </div>
      </div>
    </div>
  );
}