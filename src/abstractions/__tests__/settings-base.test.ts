import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

import { SettingsBase, SettingsBaseDto } from "../settings-base";
import { ScopedSettings, DefaultSettings } from "../settings-scope-base";
import { Helpers } from "../../helpers";

interface TestSettingsDto extends SettingsBaseDto {
    autoReconnect: boolean;
    title: string | null;
}

class TestSettings extends SettingsBase<TestSettingsDto> {
    public static async init(filePath: string): Promise<TestSettings> {
        const instance = new TestSettings("test", {}, filePath);
        const fileSettings = await instance.readSettings();
        instance.hydrate(fileSettings);

        const latestSettings = instance.dehydrate();

        if (!Helpers.compareObjects(latestSettings, fileSettings)) {
            instance.writeSettings(latestSettings);
        }

        return instance;
    }

    public async readSettings(): Promise<Partial<TestSettingsDto>> {
        const fileContents = await promisify(fs.readFile)(this.filePath, {
            encoding: "utf8"
        });

        const settings = JSON.parse(fileContents);

        return settings;
    }

    protected async writeSettingsHandler(settings: TestSettingsDto): Promise<void> {
        const stringifiedSettings = JSON.stringify(settings, undefined, 4);
        await promisify(fs.writeFile)(this.filePath, stringifiedSettings);
    }

    protected initScopedSettings(): ScopedSettings<TestSettingsDto> {
        return {};
    }

    public getDefaultSettings(): DefaultSettings<TestSettingsDto> {
        return {
            version: "0.1.0-test",
            autoReconnect: false,
            title: "Lorem Ipsum"
        };
    }
}

const EXAMPLE_SETTINGS_PATH = path.resolve(__dirname, "assets", "settings.json");

it("Init settings", async done => {
    const settings = TestSettings.init(EXAMPLE_SETTINGS_PATH);
});
