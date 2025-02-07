import { NextResponse } from 'next/server';
import { OpenAI } from "openai";

const API_KEY = process.env.COOKIE_FUN_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BASE_URL = "https://api.cookie.fun/v2";

if (!API_KEY) {
  throw new Error('COOKIE_FUN_API_KEY is not defined');
}

if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not defined');
}

const openai = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

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
    const response = await fetch(endpoint, {
      headers: new Headers({
        "x-api-key": API_KEY || ''
      }),
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.ok) {
      throw new Error('Invalid response format');
    }
    return data;
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

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Analyze these AI agent market signals and provide 3-5 clear, actionable bullet points for a DeFi trader. Focus on the highest confidence signals and potential risks:\n\n${signalsText}`
      }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'No advice generated';
  } catch (error) {
    console.error('Error generating AI advice:', error);
    return 'AI advice generation failed. Please rely on the signal data below.';
  }
}

export async function GET() {
  try {
    const aiAgents = [
      "NRNAgents",
      "ArbDoge_AI",
      "AiAgentLima",
      "OverlordBot_",
      "Gameboiai",
      "vitaieth",
      "delaunch",
      "reika_ai_"
    ];

    const signals: MarketSignal[] = [];
    const errors: string[] = [];

    for (const username of aiAgents) {
      try {
        const response = await fetchAgentData(username);
        if (!response?.ok) {
          errors.push(`Failed to fetch data for ${username}`);
          continue;
        }

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
      } catch (error) {
        errors.push(`Error processing ${username}: ${error}`);
      }
    }

    if (signals.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch any agent data', details: errors },
        { status: 500 }
      );
    }

    signals.sort((a, b) => b.confidence - a.confidence);

    const aiAdvice = await generateAIAdvice(signals);

    return NextResponse.json({
      signals,
      aiAdvice,
      timestamp: new Date().toISOString(),
      warnings: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
