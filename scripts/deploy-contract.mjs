import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import solc from "solc";
import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";
if (existsSync(".env.local")) loadEnvFile(".env.local");
const rpc = process.env.POLYGON_AMOY_RPC_URL,
  key = process.env.BLOCKCHAIN_PRIVATE_KEY;
if (!rpc || !key)
  throw new Error(
    "Set POLYGON_AMOY_RPC_URL and BLOCKCHAIN_PRIVATE_KEY in your local environment.",
  );
const provider = new JsonRpcProvider(rpc);
if ((await provider.getNetwork()).chainId !== 80002n)
  throw new Error("Connected RPC is not Polygon Amoy (80002).");
const input = {
  language: "Solidity",
  sources: {
    "SANADCredential.sol": {
      content: await readFile("contracts/SANADCredential.sol", "utf8"),
    },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};
const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
const errors = compiled.errors?.filter((e) => e.severity === "error") || [];
if (errors.length)
  throw new Error(errors.map((e) => e.formattedMessage).join("\n"));
const { abi, evm } = compiled.contracts["SANADCredential.sol"].SANADCredential;
const contract = await new ContractFactory(
  abi,
  `0x${evm.bytecode.object}`,
  new Wallet(key, provider),
).deploy();
await contract.waitForDeployment();
console.log("SANAD_CONTRACT_ADDRESS=" + (await contract.getAddress()));
console.log("Transaction=" + contract.deploymentTransaction()?.hash);
