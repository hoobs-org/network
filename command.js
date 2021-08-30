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

const { execSync } = require("child_process");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const enviornment = require("./enviornment");

class Command {
    static path(command) {
        return execSync(`command -v ${command}`, { env: enviornment }).toString().trim();
    }

    static exec(command, ...flags) {
        const executable = Command.path(command);

        if (!executable || executable === "") return undefined;

        try {
            return execSync(`${executable} ${flags.join(" ")}`, { env: enviornment }).toString().trim();
        } catch (_error) {
            return undefined;
        }
    }

    static get file() {
        return {
            read(path) {
                if (!existsSync(path)) return undefined;

                return readFileSync(path).toString();
            },

            write(path, content) {
                writeFileSync(path, content);
            }
        };
    }
}

module.exports = Command;
