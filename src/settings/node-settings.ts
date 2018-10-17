import * as fs from "fs-extra";
import * as ini from "ini";
// tslint:disable-next-line:no-require-imports
const AppDataFolder = require("app-data-folder");
import * as os from "os";
import * as path from "path";

import { SettingsBase, SettingsBaseDto } from "../abstractions/settings-base";
import { ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { DeepPartial } from "../contracts/types-helpers";
import { Validate } from "../validator";

import { Helpers } from "../helpers";

// Scopes
import { ControllerSettings, ControllerSettingsDto } from "./controller-settings";
import { StorageSettings, StorageSettingsDto } from "./storage-settings";
import { WhitelistSettings, WhitelistSettingsDto } from "./whitelist-settings";
import { SocketsSettings, SocketsSettingsDto } from "./sockets-settings";
import { BlockchainSettings, BlockchainSettingsDto } from "./blockchain-settings";
import { SslSettings, SslSettingsDto } from "./ssl-settings";

export interface NodeSettingsDto extends SettingsBaseDto {
    statisticsPath: string | null;
    /**
     * Domain SSL is valid for.
     */
    domain: string | null;
    /**
     * Master address to connect to if skipping blockchain.
     */
    masterAddress: string | null;
    /**
     * Automatic ports mapping using NAT-PMP.
     */
    natPmp: boolean;
    /**
     * Node identifier if skipping blockchain.
     * TODO: Implement better generating.
     */
    nodeId: string;
    /**
     * Public IP that master must use. If empty, master must resolve IP by itself.
     */
    publicIp: string | null;
    /**
     * Path to user user data folder. If specified, default settings.json and/or statistics.json will be saved to user data folder.
     */
    userDataPath: string;

    // SCOPES
    controller: ControllerSettingsDto;
    blockchain: BlockchainSettingsDto;
    storage: StorageSettingsDto;
    whitelist: WhitelistSettingsDto;
    sockets: SocketsSettingsDto;
    ssl: SslSettingsDto;
}

export class NodeSettings extends SettingsBase<NodeSettingsDto> {
    private constructor(settings: DeepPartial<NodeSettingsDto>, filePath: string = NodeSettings.getDefaultSettingsPath()) {
        super("node", settings, filePath);
    }

    /**
     * Correctly initialize settings with hydration.
     * @param filePath Location of settings file.
     */
    public static async init(
        filePath: string = NodeSettings.getDefaultSettingsPath(),
        settings?: DeepPartial<NodeSettingsDto>
    ): Promise<NodeSettings> {
        const instance = new NodeSettings({}, filePath);
        const fileSettings = await instance.readSettings();
        instance.hydrate(fileSettings);
        if (settings != null) {
            instance.hydrate(settings);
        }

        const latestSettings = instance.dehydrate();

        if (!Helpers.compareObjects(latestSettings, fileSettings)) {
            instance.writeSettings(latestSettings);
        }

        return instance;
    }

    public static getDefaultSettingsPath(): string {
        return path.resolve(AppDataFolder("noia-node"), "node.settings");
    }

    private readonly version: string = "1.0.0";

    public getDefaultSettings(): ScopeSettings<NodeSettingsDto> {
        const userDataPath: string = AppDataFolder("noia-node");
        const statisticsPath: string = path.resolve(userDataPath, "statistics.json");

        return {
            version: this.version,
            userDataPath: userDataPath,
            statisticsPath: statisticsPath,
            domain: null,
            masterAddress: null,
            nodeId: "",
            natPmp: false,
            publicIp: null
        };
    }

    public validate(settings: ScopeSettings<NodeSettingsDto>): ScopeSettings<NodeSettingsDto> {
        const defaultSettings = this.getDefaultSettings();

        return {
            version: Validate(settings.version, this.version).isString(false),
            statisticsPath: Validate(settings.statisticsPath, defaultSettings.statisticsPath).isString(false),
            domain: Validate(settings.domain, null).isString(false),
            masterAddress: Validate(settings.masterAddress, null).isString(false),
            nodeId: Validate(settings.nodeId, () => Helpers.randomString(40)).isString(false),
            natPmp: Validate(settings.natPmp).isBoolean(),
            publicIp: Validate(settings.masterAddress, null).isString(false),
            userDataPath: Validate(settings.userDataPath, defaultSettings.userDataPath).isString(false)
        };
    }

    protected initScopedSettings(): ScopesListSettings<NodeSettingsDto> {
        return {
            controller: new ControllerSettings("controller", this.settings.controller),
            blockchain: new BlockchainSettings("blockchain", this.settings.blockchain),
            storage: new StorageSettings("storage", this.settings.storage),
            whitelist: new WhitelistSettings("whitelist", this.settings.whitelist),
            sockets: new SocketsSettings("sockets", this.settings.sockets),
            ssl: new SslSettings("ssl", this.settings.ssl)
        };
    }

    public async readSettings(): Promise<Partial<NodeSettingsDto>> {
        await fs.ensureFile(this.filePath);
        const fileContents = await fs.readFile(this.filePath, { encoding: "utf8" });

        let data: Partial<NodeSettingsDto>;
        if (fileContents == null || fileContents === "") {
            data = {};
        } else {
            const resolvedData = ini.parse(fileContents);
            const scopedData = resolvedData[this.scope.key];

            data = typeof scopedData === "object" ? scopedData : {};
        }

        return data;
    }

    protected async writeSettingsHandler(settings: NodeSettingsDto): Promise<void> {
        const iniData: string = ini.encode({ [this.scope.key]: settings }, {
            whitespace: true
            // tslint:disable-next-line:no-any
        } as any);

        const header: string = "# NOIA Node settings file." + os.EOL;

        await fs.writeFile(this.filePath, header + iniData);
    }
}
