import * as chokidar from "chokidar";
import * as fs from "fs-extra";
import StrictEventEmitter from "strict-event-emitter-types/types/src";
import { EventEmitter } from "events";

interface SettingsScopeEvents {
    change: string;
    error: Error;
}

const WatcherEmitter: { new (): StrictEventEmitter<EventEmitter, SettingsScopeEvents> } = EventEmitter;
export class FileHandler extends WatcherEmitter {
    constructor(public readonly filePath: string) {
        super();

        this.settingsWatcher = chokidar.watch(filePath).on("change", this.onFileChange.bind(this));
    }

    private settingsWatcher: chokidar.FSWatcher;
    private isReadingFile: boolean = false;
    private data: string = "";

    public async write(content: string): Promise<void> {
        // We don't listen to file changes while updating file.
        this.settingsWatcher.removeAllListeners();
        await fs.writeFile(this.filePath, content);
        this.settingsWatcher.on("change", this.onFileChange);
    }

    public async read(): Promise<string> {
        await fs.ensureFile(this.filePath);
        return fs.readFile(this.filePath, "utf8");
    }

    private onFileChange = async () => {
        if (this.isReadingFile) {
            return;
        }

        try {
            this.isReadingFile = true;
            const data = await this.read();
            this.isReadingFile = false;

            if (this.data !== data) {
                this.data = data;
                this.emit("change", data);
            }
        } catch (error) {
            this.emit("error", error);
        }
    };
}
