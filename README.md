# FanVote on Solana

## Objective
Design and implement FanVote, a decentralized cross-chain voting platform for entertainment, on the Solana blockchain. This platform leverages Solana's high throughput and low transaction costs to enable global audiences to vote transparently for entertainment shows using stablecoins.

## Project Overview
FanVote is a blockchain-powered platform for secure, transparent voting in entertainment contexts. It utilizes stablecoins (e.g., USDC) for voting, supports cross-chain interoperability (planned), and offers NFT-based rewards (planned) to enhance fan engagement. The Solana implementation prioritizes scalability, low-cost transactions, and a seamless user experience.

## Technologies Used
*   **Solana Blockchain:** High-performance blockchain for fast and cheap transactions.
*   **Anchor Framework:** Solana development framework for building secure and efficient programs.
*   **Rust:** Programming language for developing Solana smart contracts.
*   **TypeScript:** Programming language for writing tests and potentially the frontend application.
*   **SPL Token Program:** Solana Program Library for handling tokens (like USDC).
*   **SPL Associated Token Account Program:** For managing associated token accounts.

## Project Structure

```
fanvoteSol/
├── programs/
│   └── fanvote/
│       └── src/
│           └── lib.rs  # Solana program (smart contract) code
├── tests/
│   └── fanvote.ts    # TypeScript test script
├── Anchor.toml       # Anchor project configuration
├── Cargo.toml        # Rust package manager configuration
├── package.json      # Node.js package manager configuration
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project README (this file)
```

## Setup and Running

### Prerequisites
*   [Solana Tool Suite](https://docs.solana.com/cli/install-update) (including `solana-test-validator`)
*   [Anchor Version Manager (avm)](https://www.anchor-lang.com/docs/installation)
*   [Node.js and npm](https://nodejs.org/)
*   [Yarn](https://yarnpkg.com/)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd fanvoteSol
    ```
2.  Install JavaScript dependencies using Yarn:
    ```bash
    yarn install
    ```
    *Note: If `yarn install` fails during `anchor init`, you might need to install `yarn` globally or address any Node.js/npm environment issues.* We installed `@types/mocha` and `@types/node` already to resolve testing type errors.

### Building the Program
Build the Solana program using Anchor:
```bash
anchor build
```

### Running Tests
1.  Start the local Solana test validator in the background:
    ```bash
    solana-test-validator &
    ```
    *Note: You might need to stop any previously running validators.* You can find the process ID and kill it if necessary.

2.  Run the test script:
    ```bash
    anchor test
    ```
    The test output will be displayed in your terminal.

## Smart Contract Details (Phase 1)
The current smart contract (`programs/fanvote/src/lib.rs`) implements the basic functionality for:
*   Creating voting campaigns with a title, start time, and end time.
*   Casting votes using USDC stablecoins.
*   Tracking the total votes for a campaign.
*   Preventing users from voting more than once in the same campaign.

## Roadmap (as per project design)
*   **Phase 1:** Launch MVP on Solana with a single show pilot, supporting USDC voting and basic NFT rewards.
*   **Phase 2:** Integrate Wormhole for cross-chain voting and expand NFT functionalities.
*   **Phase 3:** Support multiple shows and implement zero-knowledge (ZK) proofs for voter privacy.
*   **Phase 4:** Establish global partnerships with broadcasters and influencers.

## Contributing
Contributions are welcome! Please follow standard Git practices and open pull requests for any changes. 