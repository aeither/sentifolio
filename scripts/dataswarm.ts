// sentifolio.ts

import dotenv from "dotenv";
dotenv.config(); // Loads environment variables from .env

// Use the COOKIE_FUN_API_KEY from the environment (or fallback to a placeholder)
const API_KEY = process.env.COOKIE_FUN_API_KEY || "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.cookie.fun/v2";

/*===========================================================================
  TYPES
  ---------------------------------------------------------------------------
  Define the types for agent responses that match the sample JSON structure.
===========================================================================*/

// Represents each contract entry in the agent data
interface AgentContract {
    chain: number;
    contractAddress: string;
}

// Represents each featured tweet for the agent
interface TopTweet {
    tweetUrl: string;
    tweetAuthorProfileImageUrl: string;
    tweetAuthorDisplayName: string;
    smartEngagementPoints: number;
    impressionsCount: number;
}

// Main API agent data structure
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

// Overall API response structure
interface AgentResponse {
    ok: AgentData;
    success: boolean;
    error: any;
}

/*===========================================================================
  FETCH FUNCTIONS
  ---------------------------------------------------------------------------
  We create two functions that query the API based on Twitter username or contract address.
===========================================================================*/

/**
 * Fetch agent details by Twitter username using the specified interval.
 * Falls back between "_7Days" and "_3Days" if data is not found.
 */
async function getAgentByTwitterUsername(twitterUsername: string, interval = "_7Days"): Promise<AgentResponse> {
    const endpoint = `${BASE_URL}/agents/twitterUsername/${twitterUsername}?interval=${interval}`;
    try {
        const response = await fetch(endpoint, { headers: { "x-api-key": API_KEY } });
        if (!response.ok) {
            const errorText = await response.text();
            // If interval data is missing, try the fallback interval.
            if (response.status === 404 && errorText.includes("Interval data for the requested interval not found")) {
                const fallbackInterval = interval === "_7Days" ? "_3Days" : "_7Days";
                console.log(`Interval "${interval}" not found. Falling back to "${fallbackInterval}"...`);
                return getAgentByTwitterUsername(twitterUsername, fallbackInterval);
            }
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Fetch failed: ${error}`);
    }
}

/**
 * Fetch agent details by contract address using the specified interval.
 * Falls back as needed.
 */
async function getAgentByContractAddress(contractAddress: string, interval = "_7Days"): Promise<AgentResponse> {
    const endpoint = `${BASE_URL}/agents/contractAddress/${contractAddress}?interval=${interval}`;
    try {
        const response = await fetch(endpoint, { headers: { "x-api-key": API_KEY } });
        if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 404 && errorText.includes("Interval data for the requested interval not found")) {
                const fallbackInterval = interval === "_7Days" ? "_3Days" : "_7Days";
                console.log(`Interval "${interval}" not found. Falling back to "${fallbackInterval}"...`);
                return getAgentByContractAddress(contractAddress, fallbackInterval);
            }
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Fetch failed: ${error}`);
    }
}

/*===========================================================================
  SENTIMENT & LIQUIDITY REBALANCE
  ---------------------------------------------------------------------------
  Implement helper functions to calculate a sentiment score and produce
  a liquidity allocation suggestion based on that score.
===========================================================================*/

/**
 * Calculate a sentiment score based on selected deltas.
 * We weight:
 * - mindshareDeltaPercent: 40%
 * - marketCapDeltaPercent: 40%
 * - priceDeltaPercent: 20%
 */
function calculateSentimentScore(agent: AgentData): number {
    const weightMindshare = 0.4;
    const weightMarketCap = 0.4;
    const weightPrice = 0.2;
    const sentimentScore =
        agent.mindshareDeltaPercent * weightMindshare +
        agent.marketCapDeltaPercent * weightMarketCap +
        agent.priceDeltaPercent * weightPrice;
    return sentimentScore;
}

/**
 * Given agent data, analyze its sentiment and provide a liquidity rebalancing suggestion.
 */
function rebalanceLiquidity(agent: AgentData): void {
    const score = calculateSentimentScore(agent);
    let suggestion: string;
    if (score > 20) {
        suggestion = "Increase liquidity allocation significantly, bullish sentiment detected.";
    } else if (score > 10) {
        suggestion = "Increase liquidity allocation moderately.";
    } else if (score < -20) {
        suggestion = "Decrease liquidity allocation significantly, bearish sentiment detected.";
    } else if (score < -10) {
        suggestion = "Decrease liquidity allocation moderately.";
    } else {
        suggestion = "Keep liquidity allocation unchanged.";
    }
    console.log(`\n== Sentifolio Rebalance Suggestion for ${agent.agentName} ==`);
    console.log(`Sentiment Score: ${score.toFixed(2)}`);
    console.log(`Suggestion: ${suggestion}\n`);
}

/*===========================================================================
  MAIN FUNCTION
  ---------------------------------------------------------------------------
  Demonstrates fetching agent data via Twitter username and contract address,
  then running the sentiment analysis and rebalancing suggestion.
===========================================================================*/

async function main(): Promise<void> {
    // Option 1: Retrieve agent data by Twitter username
    const twitterUsername = "NRNAgents";
    try {
        console.log(`Fetching agent data by Twitter username: ${twitterUsername}...`);
        const agentResponseTwitter = await getAgentByTwitterUsername(twitterUsername);
        if (agentResponseTwitter.success && agentResponseTwitter.ok) {
            console.log("Agent data (Twitter):\n", JSON.stringify(agentResponseTwitter.ok, null, 2));
            rebalanceLiquidity(agentResponseTwitter.ok);
        }
    } catch (error) {
        console.error("Error fetching agent data by Twitter username:", error);
    }

    // Option 2: Retrieve agent data by contract address
    const contractAddress = "0xc0041ef357b183448b235a8ea73ce4e4ec8c265f";
    try {
        console.log(`\nFetching agent data by Contract Address: ${contractAddress}...`);
        const agentResponseContract = await getAgentByContractAddress(contractAddress);
        if (agentResponseContract.success && agentResponseContract.ok) {
            console.log("Agent data (Contract):\n", JSON.stringify(agentResponseContract.ok, null, 2));
            rebalanceLiquidity(agentResponseContract.ok);
        }
    } catch (error) {
        console.error("Error fetching agent data by contract address:", error);
    }
}

// Run the main function
main();
