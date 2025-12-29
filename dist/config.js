import fs from "fs";
import os from "os";
import path from "path";

export function setUser(userName) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}
export function readConfig() {
  const configFilePath = getConfigFilePath();
  const jsonFileContent = fs.readFileSync(configFilePath, "utf-8");
  const rawConfig = JSON.parse(jsonFileContent);
  return validateConfig(rawConfig);
}
function validateConfig(rawConfig) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error(`Invalid JSON config provided!`);
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error(`Invalid JSON config provided!`);
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}
function getConfigFilePath() {
  const configFilename = ".gatorconfig.json";
  const homeDir = os.homedir();
  const configFilePath = path.join(homeDir, configFilename);
  return configFilePath;
}
function writeConfig(cfg) {
  const configFilePath = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const configString = JSON.stringify(rawConfig);
  fs.writeFileSync(configFilePath, configString);
}
