import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface WalletSettingsDto {
    address: string;
    /**
     * Wallet address. If skipBlockchain is turned on this setting takes effect, else walletMnemonic is used to retrieve wallet address.
     */
    mnemonic: string;
    providerUrl: string | undefined;
}

export class WalletSettings extends SettingsScopeBase<WalletSettingsDto> {
    public getDefaultSettings(): DefaultSettings<WalletSettingsDto> {
        return {
            address: "",
            mnemonic: "",
            providerUrl: undefined
        };
    }

    protected initScopedSettings(): ScopedSettings<WalletSettingsDto> {
        return {};
    }
}
