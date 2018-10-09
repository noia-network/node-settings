import * as path from "path";
import { NodeSettings } from "../node-settings";

it("Node settings parse", () => {
    const settingsPath = path.resolve(__dirname, "./settings.ini");
    const settings = new NodeSettings(settingsPath, {});

    settings.update("natPmp", false);
});
