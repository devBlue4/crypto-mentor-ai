import { Strategy, StrategyRisk } from '..'

export const EMPTY_PORTFOLIO_STRATEGIES: Strategy[] = [
    {
        actions: [
            {
                description:
                    'Your wallet seems to be empty or have very small amounts in it. Consider buying some stablecoins, for example USDT or USDC, or some native crypto like ETH.',
                tokens: 'USDC, USDT, ETH'
            }
        ],
        name: 'Top up wallet with funds',
        risk: StrategyRisk.LOW
    }
]
