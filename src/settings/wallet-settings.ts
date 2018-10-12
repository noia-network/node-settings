import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface WalletSettingsDto {
    address: string | null;
    /**
     * Wallet address. If skipBlockchain is turned on this setting takes effect, else walletMnemonic is used to retrieve wallet address.
     */
    mnemonic: string | null;
    providerUrl: string | null;
}

export class WalletSettings extends SettingsScopeBase<WalletSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WalletSettingsDto> {
        return {
            address: "",
            mnemonic: "",
            providerUrl: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<WalletSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<WalletSettingsDto>): ScopeSettings<WalletSettingsDto> {
        return {
            address: Validate(settings.address, null).isString(false),
            mnemonic: Validate(settings.mnemonic, null).isString(false),
            providerUrl: Validate(settings.providerUrl, null).isString(false)
        };
    }
}
