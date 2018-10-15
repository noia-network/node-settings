// tslint:disable
import { NodeSettings } from "../settings/node-settings";

async function main(): Promise<void> {
    setInterval(() => {}, 1000);

    console.log("Started.");
    const settings = await NodeSettings.init("settings.ini");
    (global as any).settings = settings;
    settings.on("updated", () => {});
}

main();
