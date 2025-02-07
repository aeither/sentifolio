# Sentifolio: AI-Powered DeFi Liquidity Rebalancer

## Project Description

Sentifolio is an AI-driven liquidity rebalancer that autonomously adjusts DeFi liquidity pools based on real-time social sentiment and market data. By integrating Cookie DataSwarm APIs with on-chain analytics for Avalanche and Arbitrum, it optimizes liquidity allocation to maximize returns while minimizing risks like impermanent loss.

## Cookie DataSwarm API Integration

Sentifolio leverages Cookie DataSwarm APIs in three key ways:

1. **Agent Metrics**: Fetches real-time token data for Avalanche and Arbitrum using `/v2/agents` endpoints.
2. **Trend Analysis**: Identifies emerging trends with `/v1/hackathon/search/{query}` for AI agents tokens.
3. **Sentiment Scoring**: Calculates sentiment scores driving rebalancing decisions across both chains.

## Web3 x AI Intersection

- **AI Layer**: Processes social sentiment data to predict market trends for AI agents tokens.
- **Web3 Layer**: Executes on-chain actions through smart contracts on Avalanche and Arbitrum.

## GitHub Repository

🔗 [Repository](https://github.com/your-username/sentifolio)

### Key Components:
- `api/`: Backend logic for API data fetching and sentiment analysis of AI agents tokens.
- `contracts/`: Avalanche and Arbitrum-compatible smart contracts.
- `frontend/`: React dashboard for metrics and actions across both chains.

## Deployment

🌐 [Live Demo](https://sentifolio.vercel.app)

### Local Setup:

```bash
git clone https://github.com/aeither/sentifolio
cd frontend && bun install
echo "COOKIE_FUN_API_KEY=your_key_here" > .env
echo "GROQ_API_KEY=your_key_here" > .env
bun run dev
```

## Technical Overview

### Architecture:
1. Data Layer: Cookie APIs → Sentiment Score Engine for AI agents tokens
2. AI Layer: Logistic regression for liquidity adjustments on Avalanche and Arbitrum
3. Blockchain Layer: Solidity smart contracts for execution on both chains

### Key Code Snippets:

```typescript
// Sentiment score calculation for AI agents tokens
const score = (mindshareDelta * 0.4) + (marketCapDelta * 0.4) + (priceDelta * 0.2);

// Smart contract for liquidity adjustment (compatible with Avalanche and Arbitrum)
function rebalanceLiquidity(uint256 _amount, address _token, address _dexPool) external {
  IERC20(_token).transfer(_dexPool, _amount);
}
```
