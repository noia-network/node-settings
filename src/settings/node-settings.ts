import * as fs from "fs";
import * as ini from "ini";
import * as os from "os";
import { promisify } from "util";

import { SettingsBase, SettingsBaseDto } from "../abstractions/settings-base";
import { DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

import { Helpers } from "../helpers";

// Scopes
import { ControllerSettings, ControllerSettingsDto } from "./controller-settings";
import { WalletSettings, WalletSettingsDto } from "./wallet-settings";
import { StorageSettings, StorageSettingsDto } from "./storage-settings";
import { WhitelistSettings, WhitelistSettingsDto } from "./whitelist-settings";
import { SocketsSettings, SocketsSettingsDto } from "./sockets-settings";
import { BlockchainSettings, BlockchainSettingsDto } from "./blockchain-settings";
import { DeepPartial } from "../contracts/types-helpers";

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
    masterAddress: string;
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
    publicIp: string;
    /**
     * Path to user user data folder. If specified, default settings.json and/or statistics.json will be saved to user data folder.
     */
    userDataPath: string;

    // SCOPES
    controller: ControllerSettingsDto;
    blockchain: BlockchainSettingsDto;
    wallet: WalletSettingsDto;
    storage: StorageSettingsDto;
    whitelist: WhitelistSettingsDto;
    sockets: SocketsSettingsDto;
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
        const settings = await instance.readSettings();
        instance.hydrate(settings);

        return instance;
    }

    public getDefaultSettings(): DefaultSettings<NodeSettingsDto> {
        return {
            version: "1.0.0",
            isHeadless: false,
            statisticsPath: null,
            domain: null,
            masterAddress: "",
            nodeId: Helpers.randomString(40),
            natPmp: false,
            publicIp: "",
            userDataPath: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsDto> {
        return {
            controller: new ControllerSettings("controller", this.settings.controller),
            blockchain: new BlockchainSettings("blockchain", this.settings.blockchain),
            wallet: new WalletSettings("wallet", this.settings.wallet),
            storage: new StorageSettings("storage", this.settings.storage),
            whitelist: new WhitelistSettings("whitelist", this.settings.whitelist),
            sockets: new SocketsSettings("sockets", this.settings.sockets)
        };
    }

    public async readSettings(): Promise<Partial<NodeSettingsDto>> {
        const fileContents = await promisify(fs.readFile)(this.filePath, { encoding: "utf8" });

        let data: Partial<NodeSettingsDto>;
        if (fileContents == null || fileContents === "") {
            data = {};
        } else {
            const resolvedData = ini.parse(fileContents);
            const scopedData = resolvedData[this.scope];

            data = typeof scopedData === "object" ? scopedData : {};
        }

        return data;
    }

    protected async writeSettingsHandler(settings: NodeSettingsDto): Promise<void> {
        const iniData: string = ini.encode({ [this.scope]: settings }, {
            whitespace: true
        } as any);

        const header: string = "# NOIA Node settings file." + os.EOL;

        await promisify(fs.writeFile)(this.filePath, header + iniData);
    }
}
