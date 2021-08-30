export = Ethernet;

declare class Ethernet {
    static current(): any;
    static up(iface: any): void;
    static down(iface: any): void;
}
