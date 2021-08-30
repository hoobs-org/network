export = Hotspot;

declare class Hotspot {
    static code(length: any): string;

    constructor(options: any);

    uuid: string;
    iface: any;
    gateway: any;

    dhcp: {
        start: any;
        end: any;
    };

    hostapd: any;

    get running(): any;

    start(ssid: any): void;
    stop(): void;
}
