import { NodeSettings } from "./settings/node-settings";

async function main(): Promise<void> {
    setInterval(() => {}, 1000);

    console.log("Started.");
    const settings = await NodeSettings.init("settings.ini");
    settings.on("updated", () => {});
}

main();
