import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import {
  Contract,
  JsonRpcProvider,
  Wallet,
  formatEther,
  getAddress,
  isAddress,
} from "ethers";
import solc from "solc";

export function loadLocalEnvironment() {
  if (existsSync(".env.local")) loadEnvFile(".env.local");
}

export async function compileRegistry() {
  const content = await readFile("contracts/SANADCredential.sol", "utf8");
  const input = {
    language: "Solidity",
    sources: { "SANADCredential.sol": { content } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };
  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors =
    compiled.errors?.filter((entry) => entry.severity === "error") || [];
  if (errors.length)
    throw new Error(errors.map((entry) => entry.formattedMessage).join("\n"));
  const { abi, evm } =
    compiled.contracts["SANADCredential.sol"].SANADCredential;
  return { abi, bytecode: `0x${evm.bytecode.object}` };
}

export async function checkAmoy({ forDeployment = false } = {}) {
  loadLocalEnvironment();
  const rpc = process.env.POLYGON_AMOY_RPC_URL;
  const key = process.env.BLOCKCHAIN_PRIVATE_KEY;
  if (!rpc || !key)
    throw new Error(
      "Add POLYGON_AMOY_RPC_URL and BLOCKCHAIN_PRIVATE_KEY to the ignored .env.local file.",
    );
  let url;
  try {
    url = new URL(rpc);
  } catch {
    throw new Error("POLYGON_AMOY_RPC_URL must be a valid URL.");
  }
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["127.0.0.1", "localhost", "::1"].includes(url.hostname)
    )
  )
    throw new Error(
      "Use an HTTPS Amoy RPC URL (HTTP is allowed only for local tests).",
    );
  let wallet;
  try {
    wallet = new Wallet(key);
  } catch {
    throw new Error(
      "BLOCKCHAIN_PRIVATE_KEY is not a valid issuer wallet private key.",
    );
  }
  const provider = new JsonRpcProvider(rpc);
  try {
    const network = await provider.getNetwork();
    if (network.chainId !== 80002n)
      throw new Error(
        `RPC reports chain ID ${network.chainId}; expected Amoy 80002. No transaction was sent.`,
      );
    wallet = wallet.connect(provider);
    const balance = await provider.getBalance(wallet.address);
    const address = process.env.SANAD_CONTRACT_ADDRESS;
    if (address) {
      if (forDeployment)
        throw new Error(
          "SANAD_CONTRACT_ADDRESS is already configured. Run deploy:check to inspect it before deploying another contract.",
        );
      if (!isAddress(address))
        throw new Error("SANAD_CONTRACT_ADDRESS is not a valid EVM address.");
      if ((await provider.getCode(address)) === "0x")
        throw new Error(
          "No contract code exists at SANAD_CONTRACT_ADDRESS on Amoy.",
        );
      const issuer = await new Contract(
        address,
        ["function issuer() view returns (address)"],
        provider,
      ).issuer();
      if (getAddress(issuer) !== wallet.address)
        throw new Error(
          "The configured wallet is not this contract's issuer. No transaction was sent.",
        );
      return {
        provider,
        wallet,
        balance: formatEther(balance),
        contractAddress: getAddress(address),
        gasEstimate: null,
      };
    }
    const { bytecode } = await compileRegistry();
    const gas = await provider.estimateGas({
      from: wallet.address,
      data: bytecode,
    });
    const feeData = await provider.getFeeData();
    const price = feeData.maxFeePerGas ?? feeData.gasPrice;
    if (!price)
      throw new Error(
        "RPC did not provide gas fee data. Try another Amoy RPC.",
      );
    const bufferedCost = (gas * price * 12n) / 10n;
    if (balance < bufferedCost)
      throw new Error(
        `Issuer wallet needs more test POL for estimated deployment gas (${formatEther(bufferedCost)} POL with buffer). No transaction was sent.`,
      );
    return {
      provider,
      wallet,
      balance: formatEther(balance),
      contractAddress: null,
      gasEstimate: gas.toString(),
      bufferedCost: formatEther(bufferedCost),
    };
  } catch (error) {
    provider.destroy();
    throw error;
  }
}
