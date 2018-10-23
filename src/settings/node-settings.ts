import * as path from "path";
// tslint:disable-next-line:no-require-imports
const AppDataFolder = require("app-data-folder");

import { SettingsBase, SettingsBaseDto } from "../abstractions/settings-base";
import { DeepPartial } from "../contracts/types-helpers";
import { ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";
import { Helpers } from "../helpers";

//#region Scopes
import { ControllerSettings, ControllerSettingsDto } from "./controller-settings";
import { StorageSettings, StorageSettingsDto } from "./storage-settings";
import { WhitelistSettings, WhitelistSettingsDto } from "./whitelist-settings";
import { SocketsSettings, SocketsSettingsDto } from "./sockets-settings";
import { BlockchainSettings, BlockchainSettingsDto } from "./blockchain-settings";
import { SslSettings, SslSettingsDto } from "./ssl-settings";
import { createIniSerializer } from "../serializers/ini-serializer";
//#endregion

export interface NodeSettingsDto extends SettingsBaseDto {
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
    private constructor(filePath: string = NodeSettings.getDefaultSettingsPath()) {
        super(NodeSettings.scopeKey, {}, filePath, createIniSerializer(NodeSettings.scopeKey));
    }

    /**
     * Correctly initialize settings with hydration.
     * @param filePath Location of settings file.
     */
    public static async init(
        filePath: string = NodeSettings.getDefaultSettingsPath(),
        settings?: DeepPartial<NodeSettingsDto>
    ): Promise<NodeSettings> {
        const instance = new NodeSettings(filePath);
        const data = await instance.readFile();
        instance.hydrate(data);

        const prevSettings = instance.dehydrate();
        if (settings != null) {
            instance.deepUpdate(settings);
        }

        const latestSettings = instance.dehydrate();
        if (!Helpers.compareObjects(latestSettings, prevSettings)) {
            await instance.writeFile(latestSettings);
        }

        return instance;
    }

    protected static readonly scopeKey: string = "node";
    public static readonly version: string = "1.0.0";

    public static getDefaultSettingsPath(): string {
        return path.resolve(AppDataFolder("noia-node"), "node.settings");
    }

    public getDefaultSettings(): ScopeSettings<NodeSettingsDto> {
        const userDataPath: string = AppDataFolder("noia-node");

        return {
            version: NodeSettings.version,
            userDataPath: userDataPath,
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
            version: Validate(settings.version, NodeSettings.version).isString(false),
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
}
