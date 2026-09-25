# Blockchain — planned phase 5

Target: Polygon Amoy, Solidity issuer-controlled issue/verify/revoke, an ethers or viem adapter. No contract or integration is deployed in this foundation. BLOCKCHAIN_MODE defaults to mock, but the mock issuance workflow itself is not implemented yet.

Never put claims, names, addresses or documents on-chain. Use opaque identifiers and salted hashes of immutable canonical snapshots. Store private snapshots and salts in Supabase. A valid record proves issuance/integrity/revocation state, not factual truth. Distinguish pending issuance, confirmed issuance, pending revocation, revoked and failed states. Never show a mock transaction as a real explorer transaction.

User-owned wallet creation, testnet funding, RPC setup and deployment are required before a real-mode demonstration. Do not ask for private keys in chat.
