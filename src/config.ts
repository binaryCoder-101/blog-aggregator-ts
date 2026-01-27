import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}

export function readConfig(): Config {
  const configFilePath = getConfigFilePath();
  const jsonFileContent = fs.readFileSync(configFilePath, "utf-8");
  const rawConfig = JSON.parse(jsonFileContent);
  return validateConfig(rawConfig);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error(`db_url is required in config file`);
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error(`current_user_name is required in config file`);
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

function getConfigFilePath(): string {
  const configFilename = ".gatorconfig.json";
  const homeDir = os.homedir();
  const configFilePath = path.join(homeDir, configFilename);
  return configFilePath;
}

function writeConfig(cfg: Config) {
  const configFilePath = getConfigFilePath();

  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  const configString = JSON.stringify(rawConfig);
  fs.writeFileSync(configFilePath, configString);
}
