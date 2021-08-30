export = Hotspot;

declare class Hotspot {
    static uuid(seed: any): string;

    constructor(options: any);

    uuid: any;
    iface: any;
    gateway: any;

    dhcp: {
        start: any;
        end: any;
    };

    hostapd: any;

    get running(): any;

    get status(): {
        running: any;
        ssid: string;
    } | {
        running: any;
        ssid?: undefined;
    };

    start(ssid: any): void;
    ssid: string;

    stop(): void;
}
