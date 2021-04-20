"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("js-interactive.startSession", () => {
        const panel = vscode.window.createWebviewPanel("js-interactive-playground", "JS Interactive", vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)],
        });
        panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, "res/icon/js.svg"));
        const htmlResPath = vscode.Uri.file(path.join(context.extensionPath, "res/html/console.html"));
        let htmlFileContent = fs.readFileSync(htmlResPath.fsPath, "utf8");
        htmlFileContent = htmlFileContent.replace("{{style}}", panel.webview.asWebviewUri(getFileUri(context, "res/css/console.css")).toString());
        htmlFileContent = htmlFileContent.replace("{{script}}", panel.webview.asWebviewUri(getFileUri(context, "res/js/console.js")).toString());
        panel.webview.html = htmlFileContent;
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function getFileUri(c, p) {
    return vscode.Uri.file(path.join(c.extensionPath, p));
}
//# sourceMappingURL=extension.js.map