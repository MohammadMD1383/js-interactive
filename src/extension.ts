import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("js-interactive.startSession", () => {
			const panel = vscode.window.createWebviewPanel("js-interactive-playground", "JS Interactive", vscode.ViewColumn.One, {
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(context.extensionPath)],
			});
			panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, "res/icon/js.svg"));
			const htmlResPath = vscode.Uri.file(path.join(context.extensionPath, "res/html/console.html"));
			let htmlFileContent = fs.readFileSync(htmlResPath.fsPath, "utf8");

			// setting src
			htmlFileContent = htmlFileContent.replace(
				"{{style}}",
				panel.webview.asWebviewUri(getFileUri(context, "res/css/console.css")).toString()
			);
			htmlFileContent = htmlFileContent.replace(
				"{{script}}",
				panel.webview.asWebviewUri(getFileUri(context, "res/js/console.js")).toString()
			);

			// showing html
			panel.webview.html = htmlFileContent;
		})
	);
}

export function deactivate() {}

// helper functions

function getFileUri(c: vscode.ExtensionContext, p: string): vscode.Uri {
	return vscode.Uri.file(path.join(c.extensionPath, p));
}
