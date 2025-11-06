import { readConfig, setUser } from "./config.js"


function main() {
  console.log("Hello, world!");
  setUser("Misaque");
  const result = readConfig();
  console.log(result);
}

main();