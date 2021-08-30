export = Network;

declare class Network {
    static get ethernet(): typeof ethernet;
    static get wireless(): typeof wireless;
    static get connected(): boolean;
    static current(): any[];
    static get hotspot(): any;
    static devices(): any;
}

import ethernet = require("./lib/ethernet");
import wireless = require("./lib/wireless");
