import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";

import { WebRtcSettings, WebRtcSettingsDto } from "./sockets/webrtc-settings";
import { HttpSettings, HttpSettingsDto } from "./sockets/http-settings";
import { WebSocketSettings, WebSocketSettingsDto } from "./sockets/websocket-settings";

export interface SocketsSettingsDto {
    wrtc: WebRtcSettingsDto;
    http: HttpSettingsDto;
    ws: WebSocketSettingsDto;
}

export class SocketsSettings extends SettingsScopeBase<SocketsSettingsDto> {
    public getDefaultSettings(): ScopeSettings<SocketsSettingsDto> {
        return {};
    }

    protected initScopedSettings(): ScopesListSettings<SocketsSettingsDto> {
        return {
            wrtc: new WebRtcSettings("wrtc", this.settings.wrtc),
            http: new HttpSettings("http", this.settings.http),
            ws: new WebSocketSettings("ws", this.settings.ws)
        };
    }
}
