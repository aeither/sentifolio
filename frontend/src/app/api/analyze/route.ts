import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.COOKIE_FUN_API_KEY;
const BASE_URL = "https://api.cookie.fun/v2";

interface MarketSignal {
  agentName: string;
  sentimentScore: number;
  marketTrend: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  liquidityAction: string;
  confidence: number;
}

async function fetchAgentData(username: string) {
  const endpoint = `${BASE_URL}/agents/twitterUsername/${username}?interval=_7Days`;
  try {
    const response = await fetch(endpoint, { headers: { "x-api-key": API_KEY! } });
    if (!response.ok) {
      console.error(`Failed to fetch data for ${username}: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data for ${username}:`, error);
    return null;
  }
}

function calculateSentimentScore(agent: any): number {
  const weights = {
    mindshare: 0.25,
    marketCap: 0.20,
    price: 0.15,
    volume: 0.15,
    holders: 0.15,
    engagement: 0.10
  };

  return (
    agent.mindshareDeltaPercent * weights.mindshare +
    agent.marketCapDeltaPercent * weights.marketCap +
    agent.priceDeltaPercent * weights.price +
    agent.volume24HoursDeltaPercent * weights.volume +
    agent.holdersCountDeltaPercent * weights.holders +
    agent.averageEngagementsCountDeltaPercent * weights.engagement
  );
}

function determineMarketTrend(score: number): MarketSignal['marketTrend'] {
  if (score > 30) return 'STRONG_BUY';
  if (score > 15) return 'BUY';
  if (score < -30) return 'STRONG_SELL';
  if (score < -15) return 'SELL';
  return 'NEUTRAL';
}

function calculateConfidence(agent: any): number {
  const engagementScore = (agent.averageEngagementsCount / agent.followersCount) * 100;
  const liquidityScore = agent.liquidity > 0 ? 
    (agent.volume24Hours / agent.liquidity) * 100 : 0;
  return Math.min((engagementScore + liquidityScore) / 2, 100);
}

async function generateAIAdvice(signals: MarketSignal[]) {
  const signalsText = signals.map(s => 
    `${s.agentName}: Score ${s.sentimentScore.toFixed(2)}, ${s.marketTrend}, Confidence ${s.confidence.toFixed(2)}%`
  ).join('\n');

  const { text } = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: [{
      role: "user",
      content: `Analyze these AI agent market signals and provide 3-5 clear, actionable bullet points for a DeFi trader. Focus on the highest confidence signals and potential risks:\n\n${signalsText}`
    }]
  });

  return text;
}

export async function GET() {
  const aiAgents = [
    "NRNAgents",
    "ArbDoge_AI",
    "AiAgentLima",
    "OverlordBot_",
    "Gameboiai",
    "vitaieth"
  ];

  const signals: MarketSignal[] = [];

  for (const username of aiAgents) {
    const response = await fetchAgentData(username);
    if (!response?.ok) continue;

    const agent = response.ok;
    const sentimentScore = calculateSentimentScore(agent);
    const marketTrend = determineMarketTrend(sentimentScore);
    const confidence = calculateConfidence(agent);

    let liquidityAction: string;
    switch (marketTrend) {
      case 'STRONG_BUY':
        liquidityAction = 'Increase liquidity allocation by 50%';
        break;
      case 'BUY':
        liquidityAction = 'Increase liquidity allocation by 25%';
        break;
      case 'STRONG_SELL':
        liquidityAction = 'Decrease liquidity allocation by 50%';
        break;
      case 'SELL':
        liquidityAction = 'Decrease liquidity allocation by 25%';
        break;
      default:
        liquidityAction = 'Maintain current liquidity allocation';
    }

    signals.push({
      agentName: agent.agentName,
      sentimentScore,
      marketTrend,
      liquidityAction,
      confidence
    });
  }

  signals.sort((a, b) => b.confidence - a.confidence);

  return NextResponse.json({
    signals,
    aiAdvice: await generateAIAdvice(signals),
    timestamp: new Date().toISOString()
  });
}
