# Setup
1. `npm install`
2. Now start debugging.
3. To trigger `activate` function, trigger command `Debug:Add Configuration`

# How to Debug
1. https://code.visualstudio.com/api/extension-guides/debugger-extension
2. TL;DR
3. You have 2 components to run simultaneously
- Extension & Server
4. In launch.json, you will see
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "extensionHost",
            "request": "launch",
            "name": "Extension",
            "preLaunchTask": "build",
            "runtimeExecutable": "${execPath}",
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}"
            ],
            "outFiles": [
                "${workspaceFolder}/out/**/*.js"
            ]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Server",
            "cwd": "${workspaceFolder}",
            "program": "${workspaceFolder}/src/bashDebug.ts",
            "args": [
                "--server=4711"
            ],
            "outFiles": [
                "${workspaceFolder}/out/**/*.js"
            ]
        }
    ],
    "compounds": [
        {
            "name": "Extension + Server",
            "configurations": [
                "Extension",
                "Server"
            ]
        }
    ]
}
```
5. You have to launch `Extension + Server`
6. Now you can go to /workspace/vscode-bash-debug/src/bashDebug.ts
7. Set breakpoint at `launchRequest()` function
8. Now, in the extension window that popped up, you have to create another `launch.json`
```
{
    "type": "bashdb",
    "request": "launch",
    "name": "Makefile Debug",
    "cwd": "${workspaceFolder}",
    "program": "/workspace/vscode-bash-debug/test/Makefile",
    "args": [],
    "debugServer": 4711
}
```
9. You have to put `"debugServer": 4711`
10. Now you can start debugging.
11. Explanation: Because they are separate from VSCode,
12. Thus, VSCode have to setup server at port 4711, and then the debugger should connect to it.
13. Without these, it wont stop at breakpoint and keeps going.

# Note
1. the command `Debug:Add Configuration` is not from this extension
2. it is vscode default command
3. what this extension does is, add template into the commmand
4. I think lah, the `activate` function is just to push extension's functionality only
5. when you trigger vscode debug with type `bashdb`, only then it will trigger the extension's core function