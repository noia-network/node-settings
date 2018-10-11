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
    public getDefaultSettings(): DefaultSettings<NodeSettings> {
        return {
            version: "0.0.0",
            statisticsPath: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettings> {
        return {
            sockets: new SocketsSettings("sockets", this.settings.sockets)
        };
    }
}

class SocketsSettings extends SettingsScopeBase<NodeSettingsSockets> {
    public getDefaultSettings(): DefaultSettings<NodeSettingsSockets> {
        return {};
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsSockets> {
        return {
            webrtc: new WebRtcSettings("webrtc", this.settings.webrtc),
            ws: new WebSocketSettings("ws", this.settings.ws)
        };
    }
}

class WebRtcSettings extends SettingsScopeBase<NodeSettingsSocketsWebRtc> {
    public getDefaultSettings(): DefaultSettings<NodeSettingsSocketsWebRtc> {
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
    public getDefaultSettings(): DefaultSettings<NodeSettingsSocketsWebSocket> {
        return {
            isEnabled: false,
            port: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<NodeSettingsSocketsWebSocket> {
        return {};
    }
}

const SETTINGS_EXAMPLE = {
    version: "1.0.0",
    // statisticsPath: "~/.configstore/noia-node-statistics.json",
    sockets: {
        webrtc: {
            isEnabled: false,
            port: 1000
        },
        ws: {
            isEnabled: false,
            port: 1001
        }
    }
};

it("gets settings item by key.", () => {
    const settings = new Settings("node", SETTINGS_EXAMPLE);

    expect(settings.get("version")).toBe(SETTINGS_EXAMPLE.version);
});

it("gets whole settings object.", () => {
    const settings = new Settings("node", SETTINGS_EXAMPLE);

    expect(settings.dehydrate()).toMatchObject(SETTINGS_EXAMPLE);
});

it("emits an event when item is updated.", async done => {
    const settings = new Settings("node", SETTINGS_EXAMPLE);
    const key: keyof NodeSettings = "statisticsPath";
    const nextValue = "NEXT_VALUE";
    settings.on("updated", event => {
        expect(event.setting.key).toBe(key);
        expect(event.value).toBe(nextValue);
        done();
    });

    settings.update(key, nextValue);
});

it("does NOT emit an event when value is the same.", async done => {
    const settings = new Settings("node", SETTINGS_EXAMPLE);
    const key: keyof NodeSettings = "statisticsPath";
    const sameValue = settings.get(key);
    const stub = jest.fn();

    settings.on("updated", stub);

    settings.update(key, sameValue);
    setTimeout(() => {
        expect(stub).not.toBeCalled();
        done();
    }, 0);
});

it("hydrates with new settings object.", () => {
    const settings = new WebRtcSettings("webrtc", {
        isEnabled: false,
        port: 1000
    });
    const nextIsEnabled = true;

    settings.hydrate({
        isEnabled: nextIsEnabled
    });

    expect(settings.get("isEnabled")).toBe(nextIsEnabled);
    expect(settings.get("port")).toBe(settings.getDefaultSettings().port);
    expect(settings.dehydrate()).not.toMatchObject(SETTINGS_EXAMPLE);
});
