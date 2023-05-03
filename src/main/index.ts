import CLIManager from "./cli/CLIManager";

async function main() {
  const cli = new CLIManager();
  await cli.run();
}

main();