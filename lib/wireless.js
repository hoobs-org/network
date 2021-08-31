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

class Wireless {
    static get enabled() {
        const flags = [];

        flags.push("radio");
        flags.push("wifi");

        return command.exec("nmcli", ...flags) === "enabled";
    }

    static set enabled(value) {
        const flags = [];

        flags.push("radio");
        flags.push("wifi");

        if (value) {
            flags.push("on");
        } else {
            flags.push("off");
        }

        command.exec("nmcli", ...flags);
    }

    static scan(iface) {
        const flags = [];

        flags.push("--terse");
        flags.push("--fields");
        flags.push("active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags");
        flags.push("device");
        flags.push("wifi");
        flags.push("list");

        if (iface && iface !== "") {
            flags.push("ifname");
            flags.push(iface);
        }

        const networks = (command.exec("nmcli", ...flags) || "").split("\n").filter((line) => line !== "" && line.includes(":")).filter((line) => Wireless.bssid(line)).map((line) => {
            const match = Wireless.bssid(line);
            const bssid = match[0].replace(/\\:/g, ":");
            const fields = line.replace(match[0]).split(":");

            return {
                ssid: fields[1],
                bssid,
                mode: fields[3],
                channel: parseInt(fields[4], 10),
                frequency: parseInt(fields[5], 10),
                signal: parseFloat(fields[6]) / 2 - 100,
                quality: parseInt(fields[6], 10),
                security: {
                    mode: fields[7] !== "(none)" ? fields[7] : "none",
                    wpa: fields[8],
                    rsn: fields[9],
                },
            };
        });

        const results = [];

        for (let i = 0; i < networks.length; i += 1) {
            if (networks[i].ssid && networks[i].ssid !== "") {
                let index = results.findIndex((item) => item.ssid === networks[i].ssid);

                if (index === -1) {
                    index = results.length;

                    results.push({
                        ssid: networks[i].ssid,
                        quality: networks[i].quality,
                        security: networks[i].security,
                        channels: [],
                    });
                }

                if (networks[i].quality > results[index].quality) results[index].quality = networks[i].quality;

                results[index].channels.push({
                    bssid: networks[i].bssid,
                    mode: networks[i].mode,
                    channel: networks[i].channel,
                    frequency: networks[i].frequency,
                    signal: networks[i].signal,
                    quality: networks[i].quality,
                });
            }
        }

        return results;
    }

    static current() {
        const flags = [];

        flags.push("--terse");
        flags.push("--fields");
        flags.push("active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags,device");
        flags.push("device");
        flags.push("wifi");

        const networks = (command.exec("nmcli", ...flags) || "").split("\n").filter((line) => line !== "").map((line) => {
            const fields = line.replace(/\\:/g, "&&").split(":");

            if (fields[0] !== "yes") return undefined;

            return {
                iface: fields[10].replace(/&&/g, ":"),
                ssid: fields[1].replace(/&&/g, ":"),
                bssid: fields[2].replace(/&&/g, ":"),
                mode: fields[3].replace(/&&/g, ":"),
                channel: parseInt(fields[4].replace(/&&/g, ":"), 10),
                frequency: parseInt(fields[5].replace(/&&/g, ":"), 10),
                signal: parseFloat(fields[6].replace(/&&/g, ":")) / 2 - 100,
                quality: parseFloat(fields[6].replace(/&&/g, ":")),
                security: {
                    mode: fields[7].replace(/&&/g, ":"),
                    wpa: fields[8].replace(/&&/g, ":"),
                    rsn: fields[9].replace(/&&/g, ":"),
                },
            };
        }).filter((network) => network);

        const results = [];

        for (let i = 0; i < networks.length; i += 1) {
            if (networks[i].ssid && networks[i].ssid !== "") {
                let index = results.findIndex((item) => item.iface === networks[i].iface && item.ssid === networks[i].ssid);

                if (index === -1) {
                    index = results.length;

                    results.push({
                        iface: networks[i].iface,
                        ssid: networks[i].ssid,
                        quality: networks[i].quality,
                        security: networks[i].security,
                        channels: [],
                    });
                }

                if (networks[i].quality > results[index].quality) results[index].quality = networks[i].quality;

                results[index].channels.push({
                    bssid: networks[i].bssid,
                    mode: networks[i].mode,
                    channel: networks[i].channel,
                    frequency: networks[i].frequency,
                    signal: networks[i].signal,
                    quality: networks[i].quality,
                });
            }
        }

        return results;
    }

    static connect(ssid, password, iface) {
        const flags = [];

        flags.push("-w");
        flags.push("10");
        flags.push("device");
        flags.push("wifi");
        flags.push("connect");
        flags.push(`'${ssid}'`);

        if (password && password !== "") {
            flags.push("password");
            flags.push(password);
        }

        if (iface && iface !== "") {
            flags.push("ifname");
            flags.push(iface);
        }

        command.exec("nmcli", ...flags);
    }

    static disconnect(iface) {
        const flags = [];

        flags.push("device");
        flags.push("disconnect");

        if (iface && iface !== "") flags.push(iface);

        command.exec("nmcli", "device", "disconnect");
    }

    static forget(ssid) {
        command.exec("nmcli", "connection", "delete", "id", ssid);
    }

    static bssid(value) {
        return value.match(/[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}\\:[A-F0-9]{2}/);
    }
}

module.exports = Wireless;
