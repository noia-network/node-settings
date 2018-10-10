import * as path from "path";
import { NodeSettings } from "../node-settings";

it("Node settings parse", async () => {
    const settingsPath = path.resolve(__dirname, "./settings.ini");
    const settings = await NodeSettings.init(settingsPath);

    settings.updateItem("natPmp", false);

    // expect(settings.getAll()).toMatchSnapshot();
});
