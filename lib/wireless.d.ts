export = Wireless;

declare class Wireless {
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

    static connect(ssid: any, password: any, iface: any): boolean;
    static disconnect(iface: any): void;
    static forget(ssid: any): void;
    static bssid(value: any): any;
}
