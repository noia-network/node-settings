import * as chokidar from "chokidar";
// tslint:disable-next-line:no-require-imports
import debounce = require("lodash.debounce");

import { SettingsScopeBase } from "./settings-scope-base";
import { DeepPartial } from "../contracts/types-helpers";
import { Helpers } from "../helpers";

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
    private isReadingFile: boolean = false;

    public abstract async readSettings(): Promise<DeepPartial<TSettings>>;
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

    private onFileChange: () => void = debounce(async () => {
        if (this.isReadingFile) {
            return;
        }

        try {
            this.isReadingFile = true;
            const data = await this.readSettings();
            this.isReadingFile = false;
            this.hydrate(data);

            const updatedSettings = this.dehydrate();
            if (!Helpers.compareObjects(updatedSettings, data)) {
                this.writeSettings(updatedSettings);
            }
        } catch (error) {
            console.error("Tried reading file. Failed to resolve format.");
        }
    }, 100);
}
