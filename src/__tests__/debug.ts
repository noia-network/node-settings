// tslint:disable
import { NodeSettings } from "../settings/node-settings";

async function main(): Promise<void> {
  setInterval(() => {}, 1000);
  const settings = await NodeSettings.init("node.settings", {
    blockchain: {},
    controller: {},
    sockets: { http: {}, wrtc: {}, ws: {} },
    ssl: {},
    storage: {}
  });
  console.info(`settings-path=${settings.filePath}`);
}

main();
