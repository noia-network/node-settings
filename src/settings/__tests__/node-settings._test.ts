import * as path from "path";
import { NodeSettings } from "../node-settings";

it("Node settings parse", async () => {
    const settingsPath = path.resolve(__dirname, "./settings.ini");
    const settings = await NodeSettings.init(settingsPath);

    settings.set("natPmp", false);

    // expect(settings.getAll()).toMatchSnapshot();
});
