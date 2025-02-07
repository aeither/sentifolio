# Sentifolio: AI-Powered DeFi Liquidity Rebalancer

## Project Description

Sentifolio is an AI-driven liquidity rebalancer that autonomously adjusts DeFi liquidity pools based on real-time social sentiment and market data. By integrating Cookie DataSwarm APIs with on-chain analytics, it optimizes liquidity allocation to maximize returns while minimizing risks like impermanent loss.

## Cookie DataSwarm API Integration

Sentifolio leverages Cookie DataSwarm APIs in three key ways:

1. **Agent Metrics**: Fetches real-time token data using `/v2/agents` endpoints.
2. **Trend Analysis**: Identifies emerging trends with `/v1/hackathon/search/{query}`.
3. **Sentiment Scoring**: Calculates sentiment scores driving rebalancing decisions.

## Web3 x AI Intersection

- **AI Layer**: Processes social sentiment data to predict market trends.
- **Web3 Layer**: Executes on-chain actions through smart contracts.

## GitHub Repository

🔗 [Repository](https://github.com/your-username/sentifolio)

### Key Components:
- `api/`: Backend logic for API data fetching and sentiment analysis.
- `contracts/`: Avalanche-compatible smart contracts.
- `frontend/`: React dashboard for metrics and actions.

## Deployment

🌐 [Live Demo](https://sentifolio.vercel.app)

### Local Setup:

```bash
git clone https://github.com/your-username/sentifolio
cd sentifolio && npm install
echo "COOKIE_FUN_API_KEY=your_key_here" > .env
npm run dev
```

## Technical Overview

### Architecture:
1. Data Layer: Cookie APIs → Sentiment Score Engine
2. AI Layer: Logistic regression for liquidity adjustments
3. Blockchain Layer: Solidity smart contracts for execution

### Key Code Snippets:

```typescript
// Sentiment score calculation
const score = (mindshareDelta * 0.4) + (marketCapDelta * 0.4) + (priceDelta * 0.2);

// Avalanche smart contract for liquidity adjustment
function rebalanceLiquidity(uint256 _amount) external {
  IERC20(token).transfer(dexPool, _amount);
}
```