import CLIManager from "./module/CLIManager";

async function main() {
  const cli = new CLIManager();
  await cli.run();
}

main();
