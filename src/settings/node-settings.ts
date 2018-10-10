import * as fs from "fs";
import * as ini from "ini";
import * as os from "os";
import * as chokidar from "chokidar";
import deepEqual = require("deep-equal");
import { promisify } from "util";

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

export class NodeSettings extends SettingsScopeBase<NodeSettingsDto> {
    constructor(public readonly filePath: string, settings: DeepPartial<NodeSettingsDto> = {}) {
        super(settings);

        this.on("updated", this.onUpdated);
        this.settingsWatcher = chokidar.watch(filePath).on("change", this.onFileChange);
    }

    private settingsWatcher: chokidar.FSWatcher;

    public static async init(filePath: string): Promise<NodeSettings> {
        const data = await this.readConfig(filePath);

        return new NodeSettings(filePath, data);
    }

    private static readonly iniScopeName: string = "node";

    public getDefaultSettings(): DefaultSettings<NodeSettingsDto> {
        return {
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
            controller: new ControllerSettings(this.settings.controller),
            blockchain: new BlockchainSettings(this.settings.blockchain),
            wallet: new WalletSettings(this.settings.wallet),
            storage: new StorageSettings(this.settings.storage),
            whitelist: new WhitelistSettings(this.settings.whitelist),
            sockets: new SocketsSettings(this.settings.sockets)
        };
    }

    private static async readConfig(filePath: string): Promise<Partial<NodeSettingsDto>> {
        const fileContents = await promisify(fs.readFile)(filePath, { encoding: "utf8" });

        let data: Partial<NodeSettingsDto>;
        if (fileContents == null || fileContents === "") {
            data = {};
        } else {
            const resolvedData = ini.parse(fileContents);
            const scopedData = resolvedData[this.iniScopeName];

            data = typeof scopedData === "object" ? scopedData : {};
        }

        return data;
    }

    private async writeConfig(data: NodeSettingsDto): Promise<void> {
        // We don't listen to file changes while updating file.
        this.settingsWatcher.removeAllListeners();

        const iniData: string = ini.encode({ [NodeSettings.iniScopeName]: data }, {
            whitespace: true
        } as any);

        const header: string = "# NOIA Node settings file." + os.EOL;

        await promisify(fs.writeFile)(this.filePath, header + iniData);
        this.settingsWatcher.on("change", this.onFileChange);
    }

    private onUpdated = async () => {
        const nextSettingsState = this.getSettings();
        await this.writeConfig(nextSettingsState);
    };

    private onFileChange = async () => {
        const data = await NodeSettings.readConfig(this.filePath);
        this.hydrate(data);

        if (!deepEqual(data, this.getSettings(), { strict: true })) {
            console.log("Settings file is incomplete. Updating...");
            this.writeConfig(this.getSettings());
        }
    };
}
