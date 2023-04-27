import CliManager from "./CliManager";

async function main() {
  const cli = new CliManager();
  await cli.run();
}

main();
