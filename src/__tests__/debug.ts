// tslint:disable
import { NodeSettings } from "../settings/node-settings";

async function main(): Promise<void> {
    setInterval(() => {}, 1000);
    // for (let i = 0; i < 2; i++) {
    const settings2 = await NodeSettings.init(
        "settings.ini",
        {
            blockchain: {
                walletProviderUrl: "http://example.com:54321"
            },
            controller: {},
            sockets: { http: {}, wrtc: {}, ws: {} },
            ssl: {},
            storage: {}
        },
        "settings2"
    );
    console.info(`node-id=${settings2.get("nodeId")}, wallet-provider-url=${settings2.getScope("blockchain").get("walletProviderUrl")}`);
    // }
    const settings = await NodeSettings.init(
        "settings.ini",
        {
            blockchain: {},
            controller: {},
            sockets: { http: {}, wrtc: {}, ws: {} },
            ssl: {},
            storage: {}
        },
        "settings"
    );
    console.info(`node-id=${settings.get("nodeId")}, wallet-provider-url=${settings.getScope("blockchain").get("walletProviderUrl")}`);
}

main();
