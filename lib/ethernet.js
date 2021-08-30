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

const command = require("./command");

class Ethernet {
    static current() {
        const flags = [];

        flags.push("--terse");
        flags.push("--fields");
        flags.push("active,device,type");
        flags.push("con");

        return (command.exec("nmcli", ...flags) || "").split("\n").filter((line) => line !== "").map((line) => {
            const fields = line.replace(/\\:/g, "&&").split(":");

            if (fields[0] !== "yes" || !fields[2].toLowerCase().includes("ethernet")) return undefined;

            return {
                iface: fields[1].replace(/&&/g, ":"),
            };
        }).filter((network) => network);
    }

    static up(iface) {
        const flags = [];

        flags.push("--terse");
        flags.push("--fields");
        flags.push("name,device,type");
        flags.push("con");

        const connections = (command.exec("nmcli", ...flags) || "").split("\n").filter((line) => line !== "").map((line) => {
            const fields = line.replace(/\\:/g, "&&").split(":");

            if (!fields[2].toLowerCase().includes("ethernet") || fields[1] !== iface) return undefined;

            return fields[0].replace(/&&/g, ":");
        }).filter((connection) => connection);

        for (let i = 0; i < connections.length; i += 1) {
            command.exec("nmcli", "con", "up", `'${connections[i]}'`);
        }
    }

    static down(iface) {
        const flags = [];

        flags.push("--terse");
        flags.push("--fields");
        flags.push("name,device,type");
        flags.push("con");

        const connections = (command.exec("nmcli", ...flags) || "").split("\n").filter((line) => line !== "").map((line) => {
            const fields = line.replace(/\\:/g, "&&").split(":");

            if (!fields[2].toLowerCase().includes("ethernet") || fields[1] !== iface) return undefined;

            return fields[0].replace(/&&/g, ":");
        }).filter((connection) => connection);

        for (let i = 0; i < connections.length; i += 1) {
            command.exec("nmcli", "con", "down", `'${connections[i]}'`);
        }
    }
}

module.exports = Ethernet;
