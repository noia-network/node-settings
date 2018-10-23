import * as path from "path";
// tslint:disable-next-line:no-require-imports
const AppDataFolder = require("app-data-folder");

export const DEFAULT_USER_DATA_PATH = AppDataFolder("noia-node");
export const DEFAULT_SETTINGS_PATH = path.resolve(DEFAULT_USER_DATA_PATH, "node.settings");
export const DEFAULT_STORAGE_PATH = path.resolve(DEFAULT_USER_DATA_PATH, "storage");
