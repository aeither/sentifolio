import dotenv from "dotenv";
import { setTimeout } from "timers/promises";
dotenv.config();

const API_KEY = process.env.COOKIE_FUN_API_KEY || "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.cookie.fun/v2";

// Types from dataswarm.ts remain the same
interface AgentContract {
    chain: number;
    contractAddress: string;
}

interface TopTweet {
    tweetUrl: string;
    tweetAuthorProfileImageUrl: string;
    tweetAuthorDisplayName: string;
    smartEngagementPoints: number;
    impressionsCount: number;
}

interface AgentData {
    agentName: string;
    contracts: AgentContract[];
    twitterUsernames: string[];
    mindshare: number;
    mindshareDeltaPercent: number;
    marketCap: number;
    marketCapDeltaPercent: number;
    price: number;
    priceDeltaPercent: number;
    liquidity: number;
    volume24Hours: number;
    volume24HoursDeltaPercent: number;
    holdersCount: number;
    holdersCountDeltaPercent: number;
    averageImpressionsCount: number;
    averageImpressionsCountDeltaPercent: number;
    averageEngagementsCount: number;
    averageEngagementsCountDeltaPercent: number;
    followersCount: number;
    smartFollowersCount: number;
    topTweets: TopTweet[];
}

interface AgentResponse {
    ok: AgentData;
    success: boolean;
    error: any;
}

interface MarketSignal {
    agentName: string;
    sentimentScore: number;
    marketTrend: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
    liquidityAction: string;
    confidence: number;
}

class AIAgentAnalyzer {
    private readonly twitterUsernames: string[];
    private historicalData: Map<string, AgentData[]> = new Map();
    private readonly maxHistoryLength = 10;

    constructor(twitterUsernames: string[]) {
        this.twitterUsernames = twitterUsernames;
    }

    private async fetchAgentData(username: string): Promise<AgentData | null> {
        const endpoint = `${BASE_URL}/agents/twitterUsername/${username}?interval=_7Days`;
        try {
            const response = await fetch(endpoint, { headers: { "x-api-key": API_KEY } });
            if (!response.ok) {
                console.error(`Failed to fetch data for ${username}: ${response.statusText}`);
                return null;
            }
            const data: AgentResponse = await response.json();
            return data.ok;
        } catch (error) {
            console.error(`Error fetching data for ${username}:`, error);
            return null;
        }
    }

    private calculateSentimentScore(agent: AgentData): number {
        // Enhanced sentiment calculation including more metrics
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

    private determineMarketTrend(score: number): MarketSignal['marketTrend'] {
        if (score > 30) return 'STRONG_BUY';
        if (score > 15) return 'BUY';
        if (score < -30) return 'STRONG_SELL';
        if (score < -15) return 'SELL';
        return 'NEUTRAL';
    }

    private calculateConfidence(agent: AgentData): number {
        // Calculate confidence based on engagement metrics and market data
        const engagementScore = (agent.averageEngagementsCount / agent.followersCount) * 100;
        const liquidityScore = agent.liquidity > 0 ? 
            (agent.volume24Hours / agent.liquidity) * 100 : 0;
        
        return Math.min((engagementScore + liquidityScore) / 2, 100);
    }

    private generateMarketSignal(agent: AgentData): MarketSignal {
        const sentimentScore = this.calculateSentimentScore(agent);
        const marketTrend = this.determineMarketTrend(sentimentScore);
        const confidence = this.calculateConfidence(agent);

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

        return {
            agentName: agent.agentName,
            sentimentScore,
            marketTrend,
            liquidityAction,
            confidence
        };
    }

    public async analyzeAgents(): Promise<MarketSignal[]> {
        const signals: MarketSignal[] = [];
        
        for (const username of this.twitterUsernames) {
            const agentData = await this.fetchAgentData(username);
            if (!agentData) continue;

            // Update historical data
            const history = this.historicalData.get(username) || [];
            history.push(agentData);
            if (history.length > this.maxHistoryLength) {
                history.shift();
            }
            this.historicalData.set(username, history);

            const signal = this.generateMarketSignal(agentData);
            signals.push(signal);
        }

        return signals;
    }

    public async startAutonomousMonitoring(intervalMinutes: number = 5): Promise<void> {
        console.log('Starting autonomous AI agent monitoring...');
        
        while (true) {
            console.log('\n=== New Analysis Round ===');
            console.log(`Time: ${new Date().toISOString()}`);
            
            const signals = await this.analyzeAgents();
            
            // Sort signals by confidence
            signals.sort((a, b) => b.confidence - a.confidence);
            
            console.log('\nMarket Signals (sorted by confidence):');
            signals.forEach(signal => {
                console.log(`\nAgent: ${signal.agentName}`);
                console.log(`Sentiment Score: ${signal.sentimentScore.toFixed(2)}`);
                console.log(`Market Trend: ${signal.marketTrend}`);
                console.log(`Action: ${signal.liquidityAction}`);
                console.log(`Confidence: ${signal.confidence.toFixed(2)}%`);
            });

            // Calculate aggregate market sentiment
            const avgSentiment = signals.reduce((sum, s) => sum + s.sentimentScore, 0) / signals.length;
            console.log(`\nAggregate Market Sentiment: ${avgSentiment.toFixed(2)}`);
            
            // Wait for the next interval
            console.log(`\nWaiting ${intervalMinutes} minutes for next analysis...`);
            await setTimeout(intervalMinutes * 60 * 1000);
        }
    }
}

// Main execution
const aiAgents = [
    "NRNAgents",
    "ArbDoge_AI",
    "AiAgentLima",
    "OverlordBot_",
    "Gameboiai",
    "vitaieth"
];

const analyzer = new AIAgentAnalyzer(aiAgents);
analyzer.startAutonomousMonitoring(5);
