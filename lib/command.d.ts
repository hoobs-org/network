export = Command;

declare class Command {
    static path(command: any): any;
    static exec(command: any, ...flags: any[]): any;

    static get file(): {
        read(path: any): any;
        write(path: any, content: any): void;
    };
}
