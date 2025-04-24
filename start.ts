import { readFile } from "node:fs/promises";
import { RemoteExecution } from "./src";

async function main() {
  const filePath = "/mnt/data/mcp-stuff/src/ue/game/spawn_actor.py";
  const fileContent = await readFile(filePath, "utf-8");

  const remoteExecution = new RemoteExecution({
    commandEndpoint: ["127.0.0.1", 6776],
    multicastTTL: 1,
    multicastBindAddress: "0.0.0.0",
    multicastGroupEndpoint: ["239.0.0.1", 6767],
  });

  await remoteExecution.start();
  const node = await remoteExecution.getFirstRemoteNode(1000, 5000);
  await remoteExecution.openCommandConnection(node);
  const result = await remoteExecution.runCommand(fileContent);
  console.log(result);

  remoteExecution.stop();
}

main();
