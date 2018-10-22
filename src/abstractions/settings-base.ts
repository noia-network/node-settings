import * as os from "os";
import { SettingsScopeBase } from "./settings-scope-base";
import { DeepPartial } from "../contracts/types-helpers";
import { Serializer } from "../contracts/serializer";
import { FileHandler } from "../file-handler";
import { UpdatedEvent } from "../contracts/settings-events";
import { Helpers } from "../helpers";

export interface SettingsBaseDto {
    version: string;
}

export abstract class SettingsBase<TSettings extends SettingsBaseDto> extends SettingsScopeBase<TSettings> {
    constructor(
        scopeKey: string,
        settings: DeepPartial<TSettings>,
        public readonly filePath: string,
        protected readonly serializer: Serializer<TSettings>
    ) {
        super(scopeKey, settings);

        this.on("updated", this.onSettingsUpdate.bind(this));

        this.fileHandler = new FileHandler(filePath);
        this.fileHandler.on("change", this.onFileChange.bind(this));
    }

    protected readonly fileHandler: FileHandler;

    protected async readFile(): Promise<DeepPartial<TSettings>> {
        const content = await this.fileHandler.read();
        // Problems with TSettings and DeepPartial<TSettings>.
        // tslint:disable-next-line:no-any
        return (this.serializer.serialize(content) as any) as DeepPartial<TSettings>;
    }

    protected async writeFile(settings: TSettings): Promise<void> {
        const settingsString = this.serializer.deserialize(settings);
        const header: string = "# NOIA Node settings file." + os.EOL;
        this.fileHandler.write(header + settingsString);
    }

    protected onSettingsUpdate(_: UpdatedEvent): void {
        const settings = this.dehydrate();
        this.writeFile(settings);
    }

    protected async onFileChange(content: string): Promise<void> {
        try {
            const data = this.serializer.serialize(content);
            // Problems with TSettings and DeepPartial<TSettings>.
            // tslint:disable-next-line:no-any
            this.hydrate((data as any) as DeepPartial<TSettings>);

            const updatedSettings = this.dehydrate();
            if (!Helpers.compareObjects(updatedSettings, data)) {
                await this.writeFile(updatedSettings);
            }
        } catch (error) {
            console.error("Tried reading file. Failed to resolve format.");
        }
    }
}
