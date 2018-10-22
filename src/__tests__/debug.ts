// tslint:disable
import { NodeSettings } from "../settings/node-settings";

async function main(): Promise<void> {
    setInterval(() => {}, 1000);
    // for (let i = 0; i < 2; i++) {
    const settings1 = await NodeSettings.init("settings.ini", {
        masterAddress: "ws://127.0.0.1:6565",
        blockchain: {
            walletProviderUrl: "http://example.com:54321"
        },
        controller: {},
        sockets: { http: {}, wrtc: {}, ws: {} },
        ssl: {},
        storage: {}
    });
    // @ts-ignore
    settings1.scopeA = "set1";
    console.info(
        `node-id=${settings1.get("nodeId")}, master-address=${settings1.get("masterAddress")}, wallet-provider-url=${settings1
            .getScope("blockchain")
            .get("walletProviderUrl")}`
    );
    // }
    const settings2 = await NodeSettings.init("settings.ini");
    // @ts-ignore
    settings2.scopeA = "set2";
    console.info(
        `node-id=${settings2.get("nodeId")}, master-address=${settings2.get("masterAddress")}, wallet-provider-url=${settings2
            .getScope("blockchain")
            .get("walletProviderUrl")}`
    );

    settings2
        .getScope("sockets")
        .getScope("wrtc")
        .update("dataIp", "127.0.0.1");

    console.info(
        `node-id=${settings2.get("nodeId")}, master-address=${settings2.get("masterAddress")}, wallet-provider-url=${settings2
            .getScope("blockchain")
            .get("walletProviderUrl")}`
    );

    settings2
        .getScope("sockets")
        .getScope("wrtc")
        .update("dataIp", "127.0.0.2");

    setTimeout(() => {
        console.info(
            `node-id=${settings1.get("nodeId")}, master-address=${settings1.get("masterAddress")}, wallet-provider-url=${settings1
                .getScope("blockchain")
                .get("walletProviderUrl")}`
        );
    }, 5000);
}

main();
