# Credential registry

`contracts/SANADCredential.sol` is a minimal issuer-restricted Solidity registry. `issue(bytes32 id,bytes32 recordHash)` stores an opaque ID, hash, issuer, timestamp and revocation flag; `status` reads them; `revoke` can be called only by the immutable issuer. It rejects duplicate issuance and repeated revocation. No name, address, original claim or document is stored on chain.

SANAD hashes `SHA-256("SANAD:v1:" + random 32-byte salt + ":" + canonical snapshot)`. The immutable snapshot and salt stay in the private database. Public verification recomputes integrity, checks application revocation and, in real mode, compares the hash with Amoy chain state. Verification proves issuance/integrity, **not** the reported situation's truth or legal eligibility.

`npm run test:contract` compiles the contract and exercises issue/verify/revoke and issuer authorization with local Ganache. To deploy on Polygon Amoy (chain ID 80002), configure a private issuer wallet and RPC locally, fund it with test POL, then run `npm run deploy:contract`. Copy the printed address into `SANAD_CONTRACT_ADDRESS` and set `BLOCKCHAIN_MODE=real`. Do not paste the private key into chat or commit it. Explorer links use `amoy.polygonscan.com`.

Without wallet/RPC/contract configuration, `BLOCKCHAIN_MODE=mock` produces visibly labelled **Demo/Testnet Simulation** records with no fake transaction hash. A live Amoy transaction and deployment are unverified in this repository.

Real issuance and revocation store the transaction hash as soon as the wallet broadcasts it. If confirmation times out, the record stays `PENDING` or `REVOKING`; the owner can use **Check confirmation** (or `POST /api/credentials/:id/reconcile`) to settle it from the receipt. A failed receipt marks issuance `FAILED` or restores the revocation attempt to `VALID`.
