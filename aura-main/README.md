# AdEx AURA

AdEx AURA is a personal AI agent framework and recommendation engine that leverages and analyzes publicly available data from Ethereum and Layer 2 blockchains. It processes the data through a large language model (LLM) to generate personalized recommendations for actions or applications based on user behavior. In simple terms, AdEx AURA looks at the users’ blockchain activity, e.g., where they’ve sent funds or what apps they’ve used, and suggests actions or services that might interest them based on that behavior.

For initial context see this: https://www.adex.network/blog/introducing-adex-aura/

AURA is a unique product that blends together DeFAI and advertising, by being a recommendations engine for earning opportunities. The main design goal of AURA is to simplify Web3 investing and financial strategies, thereby making DeFi truly accessible.

AURA is very different from other recommendation and native advertising solutions in two distinct ways:

- Incentives flow to the user, rather than the publisher. Everyone is implicitly an advertiser, as long as their app has value to the user.
- AURA leverages AI to introduce human-like logic into the recommendation process, rather than simply using an old-school targeting algorithm. AURA will produce an answer of the question "which opportunities could be most valuable for this user" and consider all the available data from different angles

AURA is also different from AI-based DeFi automation solutions, in that most of them take a human-readable prompt and output instructions. AURA doesn’t need a prompt, it just directly recommends a few apps and strategies along with the instructions that the user’s wallet needs to execute them.

### Usage example

A perfect case where AURA is valuable in multiple ways is this: imagine that a new web3 app launches a reward program and it wants to give a rewards boost to holders of a specific NFT, in order to reach out to this community.

However, said holders have no immediate way of knowing that they get this benefit from holding their NFT. The web3 app may not have direct channels to reach out to this community, especially if said community is exclusive.

In this case, if you’re a holder of this NFT and your wallet supports AURA, you can be pointed to this web3 app. This is beneficial on many levels:

- it's a specific strategy that you're unlikely to discover yourself
- it doesn't conflict with any other strategies, it supplements them
- it's a recommendation that actually boosts your portfolio, rather than simply being an ad (there’s benefit for the user)
- it's the best channel for the web3 app to communicate this, because it's falling into right the hands of users who are already looking for yield boost

The best example of this is LobsterDAO and Ambire Wallet, especially considering that this is a triple-dip opportunity for users (original asset, which could be yield-bearing, plus the Ambire rewards, plus the boost from the NFT).

## Roadmap

**v0.1: text-based recommendations** (just runs security processing): at this stage, AURA will merely be an API that gets in an account address and outputs a list of app recommendations and strategies in natural language form, with a description of what each one does.

Following this stage, we’ll start an ongoing training of our own AI model behind AURA.

**v0.2 basic external data sources:** At this stage, AURA will pull in web3 apps, DeFi earning opportunities and airdrop opportunities from external sources, so as not to rely only on the information that the LLM model contains within it.

**v1.0: actionable recommendations**. At this stage, AURA will also output machine-readable instructions on how to execute each strategy for the particular account, for example: a transaction that provides liquidity on Curve, followed by a transaction that stakes the LP token somewhere.

**v2.0: personal AI agent.** At this stage, you can link AURA to your account and it would automatically perform some of the recommended strategies thanks to an account abstraction-based AI agent.

**v3.0: detailed account analysis and more data sources.** At this stage, AURA will start doing deep analysis of the entire activity of your account to figure out your interests. Furthermore, it will start pull in data automatically from search engines, social media, and even the blockchain.

## FAQ

**Is it DeFAI?**

AURA is designed not only to recommend web3 apps, but recommend particular earning strategies within them, therefore making it a DeFAI product. Even before v1, AURA needs to know what the earning opportunities are in order to generate a reasonable output, as it uses the earning potential for ranking.

**Is it related to advertising?**
Only philosophically. We at AdEx started with advertising, but AURA achieves the same goal of attention economy, in a much better way: in AURA, you cannot pay your way into being recommended to users, you have to earn it on merit: say you’re a web3 app - in order to appear in AURA recommendations for a given user, you need to provide some value for them, be it yield, airdrop, usage credits or something else in the future.

**Is it an airdrop hunting tool?**
Yes! AURA will recommend airdrop opportunities as well - a huge benefit is that AURA can analyze double-dip opportunities, in which you both earn stable yield and maximize future airdrop potential. AURA can also find existing unclaimed airdrops for you and recommend claiming them.

**Is AURA only for airdrop hunting and yield farming?**
While this is a compelling use case right now, AURA can be extended to look for any benefits for the user in the future: for example, usage credits, or simply some valuable use case based on the users previous on-chain activity. A futuristic example would be the user buying an NFT that helps AURA learn that they have an affinity to a niche sport like BJJ, and AURA recommending them a local dojo.

**Is it intents?**
Intent usually refers to an actual technical mechanism of describing authorized user actions, but lately it has taken a more broad definition of “what the user wants, described declaratively”. Still, AURA may utilize intents as part of it’s recommendations, but it’s not an intents engine in itself.

**Is it cross-chain?**
Yes! AURA will look for opportunities across all EVM chains it knows about where a certain account can be used!

## Use cases

- Personal AI agent: AURA can be used as part of a personal AI agent that helps the user generate interest, yield or automatically claim airdrops.
- Wallet UIs: wallets can use AURA as part of built-in web3 app catalogs, in order to pin apps that provide good opportunities, or even to curate said apps altogether. Furthermore it can be used in the homepage or dashboard, to directly offer suggestions that the user can act upon with a single click - this is especially possible in account abstraction wallets that support transaction batching.
- Web3 apps: a good example of this is, a bridge can recommend you what to do with the funds you just bridged to the network, for example “Stake in _Aave fork name_ for 5% yield”.

## License

AURA is partially open source, with this repo under the GPL license.

This repo contains the information fetcher, the LLM integrations and a basic prompt generator.
