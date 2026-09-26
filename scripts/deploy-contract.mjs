import { ContractFactory } from "ethers";
import { checkAmoy, compileRegistry } from "./amoy-shared.mjs";

const { provider, wallet, balance, gasEstimate } = await checkAmoy({
  forDeployment: true,
});
try {
  console.log(
    `Amoy 80002 · issuer ${wallet.address} · balance ${balance} test POL · estimated gas ${gasEstimate}`,
  );
  const { abi, bytecode } = await compileRegistry();
  const contract = await new ContractFactory(abi, bytecode, wallet).deploy();
  console.log("Transaction=" + contract.deploymentTransaction()?.hash);
  await contract.waitForDeployment();
  console.log("SANAD_CONTRACT_ADDRESS=" + (await contract.getAddress()));
} finally {
  provider.destroy();
}
