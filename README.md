# Sentifolio: AI-Powered DeFi Liquidity Rebalancer

## Project Description

Sentifolio is an AI-driven liquidity rebalancer that autonomously adjusts DeFi liquidity pools based on real-time social sentiment and market data. By integrating Cookie DataSwarm APIs with on-chain analytics for Avalanche and Arbitrum, it optimizes liquidity allocation to maximize returns while minimizing risks like impermanent loss. The platform also features a powerful cross-chain token exchange powered by Li.Fi, enabling users to bridge and swap tokens across multiple networks with optimal rates.

## Cookie DataSwarm API Integration

Sentifolio leverages Cookie DataSwarm APIs in three key ways:

1. **Agent Metrics**: Fetches real-time token data for Avalanche and Arbitrum using `/v2/agents` endpoints.
2. **Trend Analysis**: Identifies emerging trends with `/v1/hackathon/search/{query}` for AI agents tokens.
3. **Sentiment Scoring**: Calculates sentiment scores driving rebalancing decisions across both chains.

## Cross-Chain Token Exchange

- **Li.Fi Integration**: Seamless token bridging and swapping across multiple blockchain networks
- **Best Rate Routing**: Automatic routing to find the best rates across DEXs and bridges
- **User-Friendly Interface**: Modern, intuitive interface for executing cross-chain transactions

## Web3 x AI Intersection

- **AI Layer**: Processes social sentiment data to predict market trends for AI agents tokens.
- **Web3 Layer**: Executes on-chain actions through smart contracts on Avalanche and Arbitrum.
- **Exchange Layer**: Facilitates cross-chain token swaps and bridges via Li.Fi protocol.

## GitHub Repository

 [Repository](https://github.com/aeither/sentifolio)

### Key Components:
- `frontend/`: React dashboard for metrics and actions across both chains.
- `frontend/src/api/`: Backend logic for API data fetching and sentiment analysis of AI agents tokens.
- `frontend/src/app/exchange/`: Li.Fi widget integration for cross-chain token exchange.

## Deployment

 [Live Demo](https://sentifolio.vercel.app)

### Local Setup:

```bash
git clone https://github.com/aeither/sentifolio
cd frontend && bun install
echo "COOKIE_FUN_API_KEY=your_key_here" > .env
echo "GROQ_API_KEY=your_key_here" > .env
bun run dev
```

### Vercel Deployment:

1. Fork the repository on GitHub.
2. Connect your forked repository to Vercel.
3. In the Vercel deployment settings:
   - Set the Root Directory to `frontend`
   - Select Next.js as the Framework Preset
4. Add the following environment variables:
   - `COOKIE_FUN_API_KEY`
   - `GROQ_API_KEY`
5. Deploy the project.

## Technical Overview

### Architecture:
1. Data Layer: Cookie APIs → Sentiment Score Engine for AI agents tokens
2. AI Layer: Logistic regression for liquidity adjustments on Avalanche and Arbitrum
3. Blockchain Layer: Solidity smart contracts for execution on both chains
4. Exchange Layer: Li.Fi protocol integration for cross-chain token operations

### Key Code Snippets:

```typescript
// Sentiment score calculation for AI agents tokens
const score = (mindshareDelta * 0.4) + (marketCapDelta * 0.4) + (priceDelta * 0.2);

// Li.Fi widget configuration for token exchange
const widgetConfig: WidgetConfig = {
  integrator: 'Sentifolio',
  appearance: 'light',
  theme: {
    container: {
      borderRadius: '16px',
    },
  },
};
