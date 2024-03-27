import { ChildProcess, SpawnSyncReturns, spawnSync, spawn } from 'child_process';
import { getWSLLauncherPath } from './handlePath';

export function spawnBashScript(scriptCode: string, pathBash: string, outputHandler?: (output: string, category?: string) => void): ChildProcess {
    const currentShell = pathBash;
    const optionalBashPathArgument = (currentShell !== pathBash) ? pathBash : "";

    if (scriptCode) { }
    if (optionalBashPathArgument) { }
    getWSLLauncherPath(true);

    const spawnedProcess = spawn(
        currentShell,
        ["-f", "/workspace/vscode-bash-debug/bashdb_dir/makefiledb.mk", "target-recipe-2", "input_file=/workspace/vscode-bash-debug/test/Makefile"]);

    if (outputHandler) {
        spawnedProcess.on("error", (error) => {
            outputHandler(`${error}`, `console`);
        });

        spawnedProcess.stderr.on("data", (data) => {
            outputHandler(`${data}`, `stderr`);
        });

        spawnedProcess.stdout.on("data", (data) => {
            outputHandler(`${data}`, `stdout`);
        });
    }

    return spawnedProcess;
}

export function spawnBashScriptSync(scriptCode: string, pathBash: string, spawnTimeout: number): SpawnSyncReturns<string> {
    const currentShell = pathBash;
    const optionalBashPathArgument = (currentShell !== pathBash) ? pathBash : "";
    if (scriptCode) { }
    if (spawnTimeout) { }
    if (optionalBashPathArgument) { }

    // here fix the error invalid arguement `-c` is given
    return spawnSync(
        currentShell,
        ["-f", "/workspace/vscode-bash-debug/bashdb_dir/makefiledb.mk", "target-recipe-2", "input_file=/workspace/vscode-bash-debug/test/Makefile"]);
}