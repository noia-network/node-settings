import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

import { WebRtcSettings, WebRtcSettingsDto } from "./sockets/webrtc-settings";
import { HttpSettings, HttpSettingsDto } from "./sockets/http-settings";
import { WebSocketSettings, WebSocketSettingsDto } from "./sockets/websocket-settings";

export interface SocketsSettingsDto {
    wrtc: WebRtcSettingsDto;
    http: HttpSettingsDto;
    ws: WebSocketSettingsDto;
}

export class SocketsSettings extends SettingsScopeBase<SocketsSettingsDto> {
    public getDefaultSettings(): DefaultSettings<SocketsSettingsDto> {
        return {};
    }

    protected initScopedSettings(): ScopedSettings<SocketsSettingsDto> {
        return {
            wrtc: new WebRtcSettings(this.settings.wrtc),
            http: new HttpSettings(this.settings.http),
            ws: new WebSocketSettings(this.settings.ws)
        };
    }
}
