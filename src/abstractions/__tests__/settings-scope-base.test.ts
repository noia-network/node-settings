import { SettingsScopeBase, ScopedSettings, DefaultSettings } from "../settings-scope-base";

interface NodeSettings {
    version: string;
    statisticsPath: string;
    sockets: NodeSettingsSockets;
}

interface NodeSettingsSockets {
    webrtc: NodeSettingsSocketsWebRtc;
    ws: NodeSettingsSocketsWebSocket;
}

interface NodeSettingsSocketsWebRtc {
    isEnabled: boolean;
    port: number;
}

interface NodeSettingsSocketsWebSocket {
    isEnabled: boolean;
    port: number;
}

class Settings extends SettingsScopeBase<NodeSettings> {
    protected getDefaultSettings(): DefaultSettings<NodeSettings> {
        return {
            version: "0.0.0",
            statisticsPath: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettings> {
        return {
            sockets: new SocketsSettings(this.settings.sockets)
        };
    }
}

class SocketsSettings extends SettingsScopeBase<NodeSettingsSockets> {
    protected getDefaultSettings(): DefaultSettings<NodeSettingsSockets> {
        return {};
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsSockets> {
        return {
            webrtc: new WebRtcSettings(this.settings.webrtc),
            ws: new WebSocketSettings(this.settings.ws)
        };
    }
}

class WebRtcSettings extends SettingsScopeBase<NodeSettingsSocketsWebRtc> {
    protected getDefaultSettings(): DefaultSettings<NodeSettingsSocketsWebRtc> {
        return {
            isEnabled: false,
            port: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsSocketsWebRtc> {
        return {};
    }
}
class WebSocketSettings extends SettingsScopeBase<NodeSettingsSocketsWebSocket> {
    protected getDefaultSettings(): DefaultSettings<NodeSettingsSocketsWebSocket> {
        return {
            isEnabled: false,
            port: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsSocketsWebSocket> {
        return {};
    }
}

const settings = new Settings({
    version: "1.0.0",
    statisticsPath: "~/.configstore/noia-node-statistics.json",
    sockets: {
        webrtc: {
            isEnabled: false,
            port: 0
        },
        ws: {
            isEnabled: false,
            port: 0
        }
    }
});

// Print version.
console.info(settings.get("version"));
