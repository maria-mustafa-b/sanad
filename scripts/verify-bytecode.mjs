// Read-only check: compile SANADCredential.sol locally and compare the
// runtime bytecode with what is deployed at SANAD_CONTRACT_ADDRESS on Amoy.
import { loadEnvFile } from "node:process";
import { JsonRpcProvider } from "ethers";
import { compileRegistry } from "./amoy-shared.mjs";

try { loadEnvFile(".env.local"); } catch { /* optional */ }
const addr = process.argv[2] || process.env.SANAD_CONTRACT_ADDRESS;
const rpc = process.argv[3] || process.env.POLYGON_AMOY_RPC_URL || "https://polygon-amoy-bor-rpc.publicnode.com";
if (!addr) {
  console.error("SANAD_CONTRACT_ADDRESS not set in .env.local");
  process.exit(2);
}
const { bytecode: creation } = await compileRegistry();
const provider = new JsonRpcProvider(rpc, 80002);
const deployed = await provider.getCode(addr);

// Runtime code = creation code with constructor suffix removed. Our
// constructor has no arguments and only stores issuer, so solc's creation
// code ends with the constructor body after the runtime code; instead of
// parsing it, compare the deployed code against the metadata-stripped
// prefixes of both.
const stripMeta = (hex) => {
  const h = (hex.startsWith("0x") ? hex.slice(2) : hex).toLowerCase();
  const i = h.lastIndexOf("a264697066735822"); // CBOR metadata start
  return i === -1 ? h : h.slice(0, i);
};
const d = stripMeta(deployed);
const c = stripMeta(creation);
// The runtime code embeds the immutable `issuer` address (filled at deploy
// time); local compilation has a zero placeholder there. Align on that.
const ISSUER = "09ae9a82d13ac708ffe68ed4e7139ea68554da50";
const dNorm = d.split(ISSUER).join("0".repeat(40));
let match = dNorm.length > 0 && c.includes(dNorm);
let note = "runtime (immutable-normalised) embedded in local creation code";
if (!match) {
  // fall back to raw comparison
  match = d.length > 0 && c.includes(d);
  note = "runtime embedded verbatim";
}
if (!match) {
  // report divergence regions between deployed runtime and the runtime
  // section of the creation code (after the 0x61xxxx60...f3fe pattern)
  const rtStart = c.indexOf("6080604052");
  const cRt = rtStart === -1 ? c : c.slice(rtStart);
  let diffs = [];
  for (let i = 0; i < Math.min(d.length, cRt.length); i++) {
    if (d[i] !== cRt[i]) diffs.push(i);
  }
  console.log("diff char offsets:", diffs.slice(0, 90).join(","), diffs.length > 90 ? "..." : "");
  if (diffs.length) {
    const a = diffs[0];
    console.log("deployed at first diff:", d.slice(Math.max(0, a - 8), a + 50));
    console.log("local     at first diff:", cRt.slice(Math.max(0, a - 8), a + 50));
  }
}
console.log("deployed addr:", addr);
console.log("deployed runtime len:", (deployed.length - 2) / 2, "bytes");
console.log("deployed runtime (metadata-stripped) embedded in local creation code:", match ? "YES" : "NO");
if (!match) {
  console.log("deployed  :", d.slice(0, 120), "...");
  console.log("local crea:", c.slice(0, 120), "...");
}
provider.destroy();
