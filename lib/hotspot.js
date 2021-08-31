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

const { join } = require("path");
const { spawn } = require("child_process");
const command = require("./command");
const enviornment = require("./enviornment");

class Hotspot {
    constructor(options) {
        this.uuid = ((options || {}).uuid || {}).code || Hotspot.uuid(parseInt(((options || {}).uuid || {}).seed, 10) || 4);
        this.iface = (options || {}).gateway || "wlan0";
        this.gateway = (options || {}).gateway || "192.168.4.1";

        this.dhcp = {
            start: ((options || {}).dhcp || {}).start || "192.168.4.2",
            end: ((options || {}).dhcp || {}).end || "192.168.4.10",
        };

        this.hostapd = null;
    }

    get running() {
        if (!this.hostapd) return false;

        try {
            return process.kill(this.hostapd.pid, 0) || false;
        } catch (_error) {
            return false;
        }
    }

    get status() {
        if (this.running) {
            return {
                running: this.running,
                ssid: this.ssid,
            };
        }

        return {
            running: this.running,
        };
    }

    start(ssid) {
        this.ssid = `${ssid || "AP"}${this.uuid && this.uuid !== "" ? ` (${this.uuid})` : ""}`;

        const config = join(command.exec("mktemp", "-d"), "portal");

        let dnsmasq = "";

        dnsmasq += `interface=${this.iface}\n`;
        dnsmasq += `dhcp-range=${this.dhcp.start},${this.dhcp.end},255.255.255.0,15m\n`;
        dnsmasq += `address=/#/${this.gateway}\n`;

        let hostapd = "";

        hostapd += `interface=${this.iface}\n`;
        hostapd += "driver=nl80211\n";
        hostapd += `ssid=${this.ssid}\n`;
        hostapd += "channel=7\n";
        hostapd += "hw_mode=g\n";

        command.file.write("/etc/dnsmasq.conf", dnsmasq);
        command.file.write(config, hostapd);

        command.exec("ip", "addr", "flush", "dev", this.iface);
        command.exec("ip", "addr", "add", `${this.gateway}/24`, "dev", `${this.iface}:0`);

        command.exec("/etc/init.d/dnsmasq", "stop");
        command.exec("/etc/init.d/dnsmasq", "start");

        this.hostapd = spawn("/usr/sbin/hostapd", [config], { env: enviornment });

        this.hostapd.stdout.on("data", (data) => {
            const now = (new Date()).toLocaleTimeString();
            const today = (new Date()).toLocaleDateString();
            const lines = data.toString().split("\n").map((line) => line.trim()).filter((line) => line !== "");

            for (let i = 0; i < lines.length; i += 1) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`[${today} ${now}] ${lines[i]}\n`);
            }
        });

        this.hostapd.stderr.on("data", (data) => {
            const now = (new Date()).toLocaleTimeString();
            const today = (new Date()).toLocaleDateString();
            const lines = data.toString().split("\n").map((line) => line.trim()).filter((line) => line !== "");

            for (let i = 0; i < lines.length; i += 1) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`[${today} ${now}] ${lines[i]}\n`);
            }
        });
    }

    stop() {
        command.exec("/etc/init.d/dnsmasq", "stop");

        if (this.running) {
            this.hostapd.stdin.pause();
            this.hostapd.kill();
        }

        this.hostapd = null;
    }

    static uuid(seed) {
        const chars = "023456789ABCDEFGHIJKLMNPQRSTUVWXYZ";

        let result = "";

        for (let i = seed || 6; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        return result;
    }
}

module.exports = Hotspot;
