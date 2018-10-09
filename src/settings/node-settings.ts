import * as fs from "fs-extra";
import * as ini from "ini";
import * as os from "os";

import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

import { DeepPartial } from "../contracts/types-helpers";
import { Helpers } from "../helpers";

// Scopes
import { ControllerSettings, ControllerSettingsDto } from "./controller-settings";
import { WalletSettings, WalletSettingsDto } from "./wallet-settings";
import { StorageSettings, StorageSettingsDto } from "./storage-settings";
import { WhitelistSettings, WhitelistSettingsDto } from "./whitelist-settings";
import { SocketsSettings, SocketsSettingsDto } from "./sockets-settings";
import { BlockchainSettings, BlockchainSettingsDto } from "./blockchain-settings";

export interface NodeSettingsDto {
    statisticsPath: string;
    /**
     * False if node GUI.
     */
    isHeadless: boolean;
    /**
     * Domain SSL is valid for.
     */
    domain: string;
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

export class NodeSettings extends SettingsScopeBase<NodeSettingsDto> {
    constructor(public readonly filePath: string, settings: DeepPartial<NodeSettingsDto> = {}) {
        super(settings);

        this.on("updated", this.onUpdated);
        fs.watchFile(this.filePath, this.onFileChange);
    }

    public static async init(filePath: string): Promise<NodeSettings> {
        const fileContents = await fs.readFile(filePath, {
            encoding: "utf8"
        });
        const data = ini.parse(fileContents);

        return new NodeSettings(filePath, data);
    }

    protected getDefaultSettings(): DefaultSettings<NodeSettingsDto> {
        return {
            isHeadless: false,
            statisticsPath: "",
            domain: "",
            masterAddress: "",
            nodeId: Helpers.randomString(40),
            natPmp: false,
            publicIp: "",
            userDataPath: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsDto> {
        return {
            controller: new ControllerSettings(this.settings.controller),
            blockchain: new BlockchainSettings(this.settings.blockchain),
            wallet: new WalletSettings(this.settings.wallet),
            storage: new StorageSettings(this.settings.storage),
            whitelist: new WhitelistSettings(this.settings.whitelist),
            sockets: new SocketsSettings(this.settings.sockets)
        };
    }

    private onUpdated = async () => {
        const nextState = this.getAll();

        const iniData: string = ini.encode(nextState, {
            section: "node",
            whitespace: true
        });

        const header: string = "# NOIA Node settings file." + os.EOL;

        await fs.writeFile(this.filePath, header + iniData);
    };

    private onFileChange = async () => {
        const fileContents = await fs.readFile(this.filePath, {
            encoding: "utf8"
        });
        const data = ini.parse(fileContents);

        console.log(data);
    };
}
