import * as fs from "fs-extra";
import * as ini from "ini";
import * as os from "os";

import { SettingsBase, SettingsBaseDto } from "../abstractions/settings-base";
import { ScopeSettings, ScopedSettings } from "../abstractions/settings-scope-base";
import { DeepPartial } from "../contracts/types-helpers";
import { Validate } from "../validator";

import { Helpers } from "../helpers";

// Scopes
import { ControllerSettings, ControllerSettingsDto } from "./controller-settings";
import { WalletSettings, WalletSettingsDto } from "./wallet-settings";
import { StorageSettings, StorageSettingsDto } from "./storage-settings";
import { WhitelistSettings, WhitelistSettingsDto } from "./whitelist-settings";
import { SocketsSettings, SocketsSettingsDto } from "./sockets-settings";
import { BlockchainSettings, BlockchainSettingsDto } from "./blockchain-settings";
import { SslSettings, SslSettingsDto } from "./ssl-settings";

export interface NodeSettingsDto extends SettingsBaseDto {
    statisticsPath: string | null;
    /**
     * False if node GUI.
     */
    isHeadless: boolean;
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
    nodeId: string | null;
    /**
     * Public IP that master must use. If empty, master must resolve IP by itself.
     */
    publicIp: string | null;
    /**
     * Path to user user data folder. If specified, default settings.json and/or statistics.json will be saved to user data folder.
     */
    userDataPath: string | null;

    // SCOPES
    controller: ControllerSettingsDto;
    blockchain: BlockchainSettingsDto;
    wallet: WalletSettingsDto;
    storage: StorageSettingsDto;
    whitelist: WhitelistSettingsDto;
    sockets: SocketsSettingsDto;
    ssl: SslSettingsDto;
}

export class NodeSettings extends SettingsBase<NodeSettingsDto> {
    constructor(settings: DeepPartial<NodeSettingsDto>, filePath: string) {
        super("node", settings, filePath);
    }

    /**
     * Correctly initialize settings with hydration.
     * @param filePath Location of settings file.
     */
    public static async init(filePath: string): Promise<NodeSettings> {
        const instance = new NodeSettings({}, filePath);
        const fileSettings = await instance.readSettings();
        instance.hydrate(fileSettings);

        const latestSettings = instance.dehydrate();

        if (!Helpers.compareObjects(latestSettings, fileSettings)) {
            instance.writeSettings(latestSettings);
        }

        return instance;
    }

    private readonly version: string = "1.0.0";

    public getDefaultSettings(): ScopeSettings<NodeSettingsDto> {
        return {
            version: this.version,
            isHeadless: false,
            statisticsPath: null,
            domain: null,
            masterAddress: null,
            nodeId: null,
            natPmp: false,
            publicIp: null,
            userDataPath: null
        };
    }

    public validate(settings: ScopeSettings<NodeSettingsDto>): ScopeSettings<NodeSettingsDto> {
        return {
            version: Validate(settings.version, this.version).isString(false),
            isHeadless: Validate(settings.isHeadless).isBoolean(),
            statisticsPath: Validate(settings.statisticsPath, null).isString(false),
            domain: Validate(settings.domain, null).isString(false),
            masterAddress: Validate(settings.masterAddress, null).isString(false),
            nodeId: Validate(settings.nodeId, () => Helpers.randomString(40)).isString(false),
            natPmp: Validate(settings.natPmp).isBoolean(),
            publicIp: Validate(settings.masterAddress, null).isString(false),
            userDataPath: Validate(settings.userDataPath, null).isString(false)
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsDto> {
        return {
            controller: new ControllerSettings("controller", this.settings.controller),
            blockchain: new BlockchainSettings("blockchain", this.settings.blockchain),
            wallet: new WalletSettings("wallet", this.settings.wallet),
            storage: new StorageSettings("storage", this.settings.storage),
            whitelist: new WhitelistSettings("whitelist", this.settings.whitelist),
            sockets: new SocketsSettings("sockets", this.settings.sockets),
            ssl: new SslSettings("ssl", this.settings.ssl)
        };
    }

    public async readSettings(): Promise<Partial<NodeSettingsDto>> {
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
        } as any);

        const header: string = "# NOIA Node settings file." + os.EOL;

        await fs.writeFile(this.filePath, header + iniData);
    }
}
