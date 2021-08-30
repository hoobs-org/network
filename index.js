/**************************************************************************************************
 * hoobs-network                                                                                  *
 * Copyright (C) 2021 HOOBS                                                                       *
 *                                                                                                *
 * This program is free software: you can redistribute it and/or modify                           *
 * it under the terms of the GNU General Public License as published by                           *
 * the Free Software Foundation, either version 3 of the License, or                              *
 * (at your option) any later version.                                                            *
 *                                                                                                *
 * This program is distributed in the hope that it will be useful,                                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                                 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  *
 * GNU General Public License for more details.                                                   *
 *                                                                                                *
 * You should have received a copy of the GNU General Public License                              *
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.                          *
 **************************************************************************************************/

const hotspot = require("./lib/hotspot");
const wireless = require("./lib/wireless");
const ethernet = require("./lib/ethernet");
const command = require("./lib/command");

let AP;

class Network {
    static get ethernet() {
        return ethernet;
    }

    static get wireless() {
        return wireless;
    }

    static get connected() {
        return Network.current().length > 0;
    }

    static current() {
        return [...ethernet.current(), ...wireless.current()];
    }

    static get hotspot() {
        if (!AP) AP = new hotspot();

        return AP;
    }

    static devices() {
        const flags = [];

        flags.push("--terse");
        flags.push("--fields");
        flags.push("device,type,state");
        flags.push("dev");

        return (command.exec("nmcli", ...flags) || "").split("\n").filter((line) => line !== "").map((line) => {
            const fields = line.replace(/\\:/g, "&&").split(":");

            if (fields[2] === "unmanaged") return undefined;

            if (fields[1] === "ethernet" || fields[1] === "wifi") {
                return {
                    iface: fields[0].replace(/&&/g, ":"),
                    type: fields[1].replace(/&&/g, ":"),
                    active: fields[2].replace(/&&/g, ":") === "connected",
                };
            }

            return undefined;
        }).filter((network) => network);
    }
}

function teardown() {
    Network.hotspot.stop();
}

process.on("exit", teardown);
process.on("SIGINT", teardown);
process.on("SIGTERM", teardown);
process.on("SIGUSR1", teardown);
process.on("SIGUSR2", teardown);

module.exports = Network;
