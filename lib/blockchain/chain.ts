import { Contract, JsonRpcProvider, Wallet, isAddress } from "ethers";
import { AppError } from "@/lib/api/errors";
import { demoMode } from "@/lib/database/repository";
export const mode = () =>
  process.env.BLOCKCHAIN_MODE === "real" ? "real" : "mock";
const abi = [
  "function issue(bytes32 id, bytes32 recordHash) external",
  "function revoke(bytes32 id) external",
  "function status(bytes32 id) external view returns (bytes32, address, uint64, bool)",
];
export function onchainId(id: string) {
  return "0x" + id.replaceAll("-", "").padStart(64, "0");
}
function contract(write = false) {
  if (demoMode())
    throw new AppError(
      "CHAIN_CONFIG_REQUIRED",
      "Real issuance requires Supabase mode and a configured issuer.",
      503,
    );
  const rpc = process.env.POLYGON_AMOY_RPC_URL,
    addr = process.env.SANAD_CONTRACT_ADDRESS;
  if (!rpc || !addr || !isAddress(addr))
    throw new AppError(
      "CHAIN_CONFIG_REQUIRED",
      "Configure the Amoy RPC and deployed contract.",
      503,
    );
  const provider = new JsonRpcProvider(rpc, 80002, { staticNetwork: true });
  const signer = write
    ? new Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY || "", provider)
    : provider;
  return new Contract(addr, abi, signer);
}
export async function issue(
  id: string,
  hash: string,
  onBroadcast?: (hash: string) => Promise<void>,
) {
  if (mode() === "mock")
    return { mode: "mock" as const, transaction_hash: null, chain_id: null };
  try {
    const c = contract(true);
    const tx = await c.issue(onchainId(id), hash);
    await onBroadcast?.(tx.hash);
    const receipt = await tx.wait(1);
    if (!receipt || receipt.status !== 1) throw new Error("Transaction failed");
    return {
      mode: "real" as const,
      transaction_hash: tx.hash,
      chain_id: 80002,
    };
  } catch {
    throw new AppError(
      "CHAIN_ISSUE_FAILED",
      "Amoy issuance failed. Check the wallet, RPC, contract and test funds.",
      502,
    );
  }
}
export async function revoke(
  id: string,
  onBroadcast?: (hash: string) => Promise<void>,
) {
  if (mode() === "mock") return { transaction_hash: null };
  try {
    const tx = await contract(true).revoke(onchainId(id));
    await onBroadcast?.(tx.hash);
    const receipt = await tx.wait(1);
    if (!receipt || receipt.status !== 1) throw new Error("Transaction failed");
    return { transaction_hash: tx.hash as string };
  } catch {
    throw new AppError(
      "CHAIN_REVOKE_FAILED",
      "Amoy revocation failed. Please retry.",
      502,
    );
  }
}
export async function verify(id: string, hash: string) {
  if (mode() === "mock")
    return { verified: false, mode: "mock", reason: "Demo/Testnet Simulation" };
  try {
    const [stored, , , revoked] = await contract().status(onchainId(id));
    return {
      verified: stored.toLowerCase() === hash.toLowerCase() && !revoked,
      mode: "real",
      revoked: Boolean(revoked),
    };
  } catch {
    throw new AppError(
      "CHAIN_VERIFY_FAILED",
      "Amoy verification is temporarily unavailable.",
      502,
    );
  }
}
export async function transaction(hash: string) {
  const rpc = process.env.POLYGON_AMOY_RPC_URL;
  if (!rpc)
    throw new AppError("CHAIN_CONFIG_REQUIRED", "Configure an Amoy RPC.", 503);
  const receipt = await new JsonRpcProvider(rpc, 80002).getTransactionReceipt(
    hash,
  );
  return {
    status: receipt?.status ?? null,
    confirmations: receipt ? await receipt.confirmations() : 0,
    explorer: `https://amoy.polygonscan.com/tx/${hash}`,
  };
}
