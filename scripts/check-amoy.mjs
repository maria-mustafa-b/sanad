import { checkAmoy } from "./amoy-shared.mjs";
const result = await checkAmoy();
try {
  console.log("Network: Polygon Amoy (80002)");
  console.log("Issuer address: " + result.wallet.address);
  console.log("Test POL balance: " + result.balance);
  if (result.contractAddress)
    console.log("Contract verified for this issuer: " + result.contractAddress);
  else {
    console.log(
      "No contract configured. Estimated deployment gas: " + result.gasEstimate,
    );
    console.log("Estimated test POL with buffer: " + result.bufferedCost);
  }
  console.log("Preflight complete. No transaction was sent.");
} finally {
  result.provider.destroy();
}
