import { spawnBashScriptSync } from './spawnBash';
import * as fs from 'fs';

export enum validatePathResult {
    success = 0,
    notExistCwd,
    notFoundBash,
    notFoundBashdb,
    notFoundCat,
    notFoundMkfifo,
    notFoundPkill,
    timeout,
    cannotChmod,
    unsupportedBashVersion,
    unknown,
}

export function _validatePath(cwd: string,
    pathBash: string, pathBashdb: string, pathCat: string, pathMkfifo: string, pathPkill: string, spawnTimeout = 5000): [validatePathResult, string] {
    if (cwd) { }
    if (pathCat) { }
    if (pathMkfifo) { }
    if (pathPkill) { }

    const vpr = validatePathResult;

    let chmod_bashdb = pathBashdb.indexOf("bashdb_dir") > 0;
    if (chmod_bashdb) {
        try {
            fs.accessSync(pathBashdb, fs.constants.X_OK);
            chmod_bashdb = false;
        } catch (err) {
            // Means that execute not possible, try and chmod it
        }
    }

    // here gives the arguments
    const proc = spawnBashScriptSync(
        '', pathBash, spawnTimeout);

    if (proc.error !== undefined) {

        if (proc.error?.["code"] === "ENOENT") {
            return [vpr.notFoundBash, ""];
        }

        if (proc.error?.["code"] === "ETIMEDOUT") {
            return [vpr.timeout, ""];
        }
        return [vpr.unknown, ""];
    }

    const errorString = proc.stderr.toString();

    return [<validatePathResult>proc.status, errorString];
}

export function validatePath(cwd: string,
    pathBash: string, pathBashdb: string, pathCat: string, pathMkfifo: string, pathPkill: string): string {
    // i dk how to debug here, it wont pause here
    // then i tried `console.log()` it also wont print in console
    // but i can do is `return `${pathBash}``
    // lol
    // cwd - /workspace
    // pathBash - make
    // pathBashdb - /workspace/vscode-bash-debug/bashdb_dir/makefiledb.mk
    // pathcat - cat
    // pathMkfifo - mkfifo
    // pathPkill - pkill
    // return `${cwd} + ${pathBash} + ${pathBashdb} + ${pathCat} + ${pathMkfifo} + ${pathPkill}`
    const rc = _validatePath(cwd, pathBash, pathBashdb, pathCat, pathMkfifo, pathPkill);

    const askReport = `If it is reproducible, please report it to https://github.com/rogalmic/vscode-bash-debug/issues.`;

    const stderrContent = `\n\n${rc["1"]}`;

    switch (rc["0"]) {
        case validatePathResult.success: {
            return ``;
        }
        case validatePathResult.notExistCwd: {
            return `Error: cwd (${cwd}) does not exist.` + stderrContent;
        }
        case validatePathResult.notFoundBash: {
            if (process.platform.toString() === "win32") {
                return `Error: WSL bash (mandatory on Windows) is not found. (pathBash: ${pathBash})` + stderrContent;
            } else {
                // after making `config.pathBash = "make -f";`
                // here prints out the error
                return `Error: bash not found. (pathBash: ${pathBash})` + stderrContent;
            }
        }
        case validatePathResult.notFoundBashdb: {
            return `Error: bashdb not found. (pathBashdb: ${pathBashdb})` + stderrContent;
        }
        case validatePathResult.notFoundCat: {
            return `Error: cat not found. (pathCat: ${pathCat})` + stderrContent;
        }
        case validatePathResult.notFoundMkfifo: {
            return `Error: mkfifo not found. (pathMkfifo: ${pathMkfifo})` + stderrContent;
        }
        case validatePathResult.notFoundPkill: {
            return `Error: pkill not found. (pathPkill: ${pathPkill})` + stderrContent;
        }
        case validatePathResult.timeout: {
            return `Error: BUG: timeout while validating environment. ` + askReport + stderrContent;
        }
        case validatePathResult.cannotChmod: {
            return `Error: Cannot chmod +x internal bashdb copy.` + stderrContent;
        }
        case validatePathResult.unsupportedBashVersion: {
            return `Error: Only bash versions 4.* or 5.* are supported.` + stderrContent;
        }
        case validatePathResult.unknown: {
            return `Error: BUG: unknown error ocurred while validating environment. ` + askReport + stderrContent;
        }
    }

    return `Error: BUG: reached to unreachable code while validating environment (code ${rc}). ` + askReport + stderrContent;
}

