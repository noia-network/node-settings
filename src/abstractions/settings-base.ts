import deepEqual = require("deep-equal");
import * as chokidar from "chokidar";

import { SettingsScopeBase } from "./settings-scope-base";
import { DeepPartial } from "../contracts/types-helpers";

export interface SettingsBaseDto {
    version: string;
}

export abstract class SettingsBase<TSettings extends SettingsBaseDto> extends SettingsScopeBase<TSettings> {
    constructor(scope: string, settings: DeepPartial<TSettings>, public readonly filePath: string) {
        super(scope, settings);

        this.on("updated", this.onUpdated.bind(this));
        this.settingsWatcher = chokidar.watch(filePath).on("change", this.onFileChange.bind(this));
    }

    private settingsWatcher: chokidar.FSWatcher;

    public abstract async readSettings(): Promise<Partial<TSettings>>;
    protected abstract async writeSettingsHandler(settings: TSettings): Promise<void>;

    public async writeSettings(settings: TSettings): Promise<void> {
        // We don't listen to file changes while updating file.
        this.settingsWatcher.removeAllListeners();
        await this.writeSettingsHandler(settings);
        this.settingsWatcher.on("change", this.onFileChange);
    }

    private async onUpdated(): Promise<void> {
        const nextSettingsState = this.dehydrate();
        await this.writeSettings(nextSettingsState);
    }

    private onFileChange = async () => {
        const data = await this.readSettings();
        this.hydrate(data);

        if (!deepEqual(data, this.dehydrate(), { strict: true })) {
            console.log("Settings file is incomplete. Updating...");
            this.writeSettings(this.dehydrate());
        }
    };
}
