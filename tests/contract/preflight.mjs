import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ganache from "ganache";
import { JsonRpcProvider, Wallet } from "ethers";

const server = ganache.server({
  logging: { quiet: true },
  chain: { chainId: 80002, hardfork: "shanghai" },
});
await server.listen(0);
const rpc = `http://127.0.0.1:${server.address().port}`;
const [address, account] = Object.entries(
  server.provider.getInitialAccounts(),
)[0];
async function run(privateKey, extra = {}) {
  return promisify(execFile)(process.execPath, ["scripts/check-amoy.mjs"], {
    env: {
      ...process.env,
      POLYGON_AMOY_RPC_URL: rpc,
      BLOCKCHAIN_PRIVATE_KEY: privateKey,
      SANAD_CONTRACT_ADDRESS: "",
      ...extra,
    },
  });
}
try {
  const { stdout: output } = await run(account.secretKey);
  assert.match(output, /Polygon Amoy \(80002\)/);
  assert.match(output, /No transaction was sent/);
  assert.ok(!output.includes(account.secretKey));
  const provider = new JsonRpcProvider(rpc);
  assert.equal(await provider.getTransactionCount(address), 0);
  provider.destroy();
  await assert.rejects(
    run(Wallet.createRandom().privateKey),
    /needs more test POL/,
  );
  await assert.rejects(
    run(account.secretKey, {
      SANAD_CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000001",
    }),
    /No contract code exists/,
  );
  const wrongChain = ganache.server({
    logging: { quiet: true },
    chain: { chainId: 1337 },
  });
  await wrongChain.listen(0);
  try {
    await assert.rejects(
      run(account.secretKey, {
        POLYGON_AMOY_RPC_URL: `http://127.0.0.1:${wrongChain.address().port}`,
      }),
      /expected Amoy 80002/,
    );
  } finally {
    await wrongChain.close();
  }
  console.log(
    "Amoy preflight checks passed: funded issuer, no broadcast, empty wallet, missing contract and wrong chain.",
  );
} finally {
  await server.close();
}
