# ⛓️ SANAD Blockchain & Verifiable Credentials Guide

SANAD includes a prototype registry for issuing, verifying, and revoking portable **user-confirmed** records on the EVM-compatible **Polygon Amoy Testnet (Chain ID 80002)**. The default local demo is a labelled simulation; a live Amoy deployment has not been verified for this repository. A credential does not prove that the underlying claim is true or establish eligibility.

---

## 🏗️ 1. Architecture Overview

```mermaid
flowchart TD
    A["Worker Situation (Text/Voice)"] --> B["AI or labelled demo extraction"]
    B --> C["User Confirmation"]
    C --> D["Salted SHA-256 snapshot hash"]
    D --> E["SANADCredential Smart Contract"]
    E --> F["Polygon Amoy Testnet (80002)"]
    F --> G["Public Verifier (/verify?id=...) & QR Code"]
```

### Privacy-First Security Model
- **No raw personal details on chain:** The contract stores no name, passport number, situation text, document, private snapshot or salt. The padded UUID can still be correlated with a shared verification link, so share it intentionally.
- **SHA-256 digest:** The `recordHash` is computed over a canonical confirmed snapshot with a random 32-byte private salt and a domain prefix; only the hash and opaque ID are written to the contract.
- **Issuer control:** This contract has one immutable issuer wallet. Only that wallet can issue or revoke; it is not a multi-organization issuer system.

---

## 📜 2. Smart Contract Specs (`contracts/SANADCredential.sol`)

`contracts/SANADCredential.sol` is written in **Solidity `^0.8.24`**:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SANADCredential {
    address public immutable issuer;
    struct Credential {
        bytes32 recordHash;
        address issuedBy;
        uint64 issuedAt;
        bool revoked;
    }
    mapping(bytes32 => Credential) private records;

    event Issued(bytes32 indexed id, bytes32 indexed recordHash, address indexed issuer);
    event Revoked(bytes32 indexed id);

    constructor() { issuer = msg.sender; }

    function issue(bytes32 id, bytes32 recordHash) external { ... }
    function revoke(bytes32 id) external { ... }
    function status(bytes32 id) external view returns (bytes32, address, uint64, bool) { ... }
}
```

---

## 🧪 3. Running Local Smart Contract Tests

SANAD comes with a local Solidity execution suite powered by `ethers` and `solc`:

```bash
npm run test:contract
```

**What it tests:**
- ✅ Issuer-only minting & revoking permissions
- ✅ Immutability of recorded hashes
- ✅ Rejection of duplicate credential IDs
- ✅ Revocation state on the local Ganache chain
- ✅ Positive contract issue timestamp

---

## 🚀 4. How to Deploy to Polygon Amoy Testnet

### Step 1: Set up a dedicated testnet issuer wallet
1. Keep the wallet private key out of GitHub and chat. Obtain Amoy testnet gas tokens from the faucet:
   👉 [Polygon Amoy Faucet](https://faucet.polygon.technology/)
2. Choose an RPC endpoint that reports chain ID 80002. Before deployment, put `POLYGON_AMOY_RPC_URL` and `BLOCKCHAIN_PRIVATE_KEY` in the local `.env.local` file; the script now loads that file itself.

### Step 2: Deploy Using the Deployment Script
Run the automated deployment script included in SANAD:

```bash
npm run deploy:contract
```

**Output example:**
```text
SANAD_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
Transaction=0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

---

## ⚙️ 5. Configuring `.env.local`

### Mode A: Mock / Simulation Mode (Default — Best for Live Hackathon Demos)
Requires zero gas fees and zero network latency.

```env
BLOCKCHAIN_MODE=mock
```

### Mode B: Real Polygon Amoy Testnet Mode
Executes live testnet transactions only after deploying the contract and configuring a persistent Supabase database. The app uses the same issuer wallet that deployed the contract.

```env
BLOCKCHAIN_MODE=real
SANAD_MODE=supabase
POLYGON_AMOY_RPC_URL=<your Amoy RPC URL>
SANAD_CONTRACT_ADDRESS=0xYourDeployedContractAddress
BLOCKCHAIN_PRIVATE_KEY=0xYourIssuerWalletPrivateKey
```

---

## 🔍 6. How Verification Works

1. **In App:** User completes claim → receives QR Code & Credential URL (`/verify?id=<credential_id>`).
2. **Public Verification Page:** Anyone (employers, legal aid, judges) can open `/verify?id=...` to verify:
   - Valid hash match
   - Contract issue timestamp when the Amoy registry is configured and reachable
   - Revocation status
   - PolygonScan transaction link: `https://amoy.polygonscan.com/tx/<transaction_hash>`

The verifier recomputes the hash server-side from the private snapshot and salt. In real mode it compares that hash and revocation state with the contract. If chain revocation is visible before the database finishes updating, the public result still reports it as revoked. Private facts and documents are not returned by the verification API.

If a real transaction is broadcast but confirmation times out, its hash is retained and the record stays `PENDING` or `REVOKING`. The owner can use **Check confirmation** or `POST /api/credentials/:id/reconcile` to read its receipt. A failed issuance receipt changes the record to `FAILED`; a failed revocation receipt restores `VALID`. Mock mode has no real transaction hash and always displays **Demo/Testnet Simulation**.
