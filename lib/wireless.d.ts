export = Wireless;

declare class Wireless {
    static set enabled(arg: boolean);

    static get enabled(): boolean;

    static scan(iface: any): {
        ssid: any;
        quality: any;
        security: any;
        channels: any[];
    }[];

    static current(): {
        iface: any;
        ssid: any;
        quality: any;
        security: any;
        channels: any[];
    }[];

    static connect(ssid: any, password: any, iface: any): void;
    static disconnect(iface: any): void;
    static forget(ssid: any): void;
    static bssid(value: any): any;
}
