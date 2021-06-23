import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("js-interactive.startSession-js", () => {
			createWebView(context, WebViewItems.js);
		}),

		vscode.commands.registerCommand("js-interactive.startSession-node", () => {
			let __EVAL = (s: string) => eval(`void (__EVAL = ${__EVAL.toString()}); ${s}`);

			const VM = Object.freeze({
				exec(expr: string) {
					let result;
					try {
						result = __EVAL(expr);
					} catch (e) {
						result = new Error(e instanceof Error ? e.message : e);
					}
					return result;
				},
			});

			const panel = createWebView(context, WebViewItems.node);
			panel.webview.onDidReceiveMessage(
				(message) => {
					const evalResult = VM.exec(message);

					if (evalResult instanceof Error) {
						panel.webview.postMessage({ status: "error", result: evalResult.message });
					} else {
						panel.webview.postMessage({ status: "success", result: evalResult });
					}
				},
				undefined,
				context.subscriptions
			);
		}),

		vscode.commands.registerCommand("js-interactive.startSession-ts-js", () => {
			const panel = createWebView(context, WebViewItems.ts_js);
			panel.webview.onDidReceiveMessage(
				(message) => {
					const result = ts.transpileModule(message, {
						compilerOptions: {
							module: ts.ModuleKind.ES2020,
							target: ts.ScriptTarget.ES2020,
						},
					}).outputText;
					panel.webview.postMessage(result);
				},
				undefined,
				context.subscriptions
			);
		}),

		vscode.commands.registerCommand("js-interactive.startSession-ts-node", () => {
			let __EVAL = (s: string) => eval(`void (__EVAL = ${__EVAL.toString()}); ${s}`);

			const VM = Object.freeze({
				exec(expr: string) {
					let result;
					try {
						result = __EVAL(expr);
					} catch (e) {
						result = new Error(e instanceof Error ? e.message : e);
					}
					return result;
				},
			});

			const panel = createWebView(context, WebViewItems.ts_node);
			panel.webview.onDidReceiveMessage(
				(message) => {
					const compiled = ts.transpileModule(message, {
						compilerOptions: {
							module: ts.ModuleKind.CommonJS,
							target: ts.ScriptTarget.ES2020,
						},
					}).outputText;

					const evalResult = VM.exec(compiled);

					if (evalResult instanceof Error) {
						panel.webview.postMessage({ status: "error", result: evalResult.message });
					} else {
						panel.webview.postMessage({ status: "success", result: evalResult });
					}
				},
				undefined,
				context.subscriptions
			);
		})
	);
}

export function deactivate() {}

// enums

interface IItem {
	title: string;
	icon: string;
	viewType: string;
	js: string;
	api: string;
}

const WebViewItems = Object.freeze({
	js: {
		title: "JS Playground",
		icon: "res/icon/js.svg",
		viewType: "playground.js",
		js: "res/js/console-js.js",
		api: "browser",
	},
	node: {
		title: "Node Playground",
		icon: "res/icon/node.svg",
		viewType: "playground.node",
		js: "",
		api: "node",
	},
	ts_js: {
		title: "TS-JS Playground",
		icon: "res/icon/ts-js.svg",
		viewType: "playground.ts-js",
		js: "res/js/console-ts.js",
		api: "browser",
	},
	ts_node: {
		title: "TS-Node Playground",
		icon: "res/icon/ts-node.svg",
		viewType: "playground.ts-node",
		js: "",
		api: "node",
	},
});

// helper functions

function getFileUri(c: vscode.ExtensionContext, p: string): vscode.Uri {
	return vscode.Uri.file(path.join(c.extensionPath, p));
}

function createWebView(context: vscode.ExtensionContext, item: IItem): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(item.viewType, item.title, vscode.ViewColumn.One, {
		enableScripts: true,
		localResourceRoots: [vscode.Uri.file(context.extensionPath)],
	});
	panel.iconPath = getFileUri(context, item.icon);

	const htmlResPath = getFileUri(context, "res/html/console.html");
	const jsResPath = panel.webview.asWebviewUri(getFileUri(context, item.js)).toString();
	const styleResPath = panel.webview.asWebviewUri(getFileUri(context, "res/css/console.css")).toString();
	const consoleResPath = panel.webview.asWebviewUri(getFileUri(context, "res/js/console.js")).toString();
	const browserApiResPath = panel.webview.asWebviewUri(getFileUri(context, "res/js/BrowserApi.js")).toString();
	const NodeApiResPath = panel.webview.asWebviewUri(getFileUri(context, "res/js/NodeApi.js")).toString();

	let htmlFileContent = fs.readFileSync(htmlResPath.fsPath, "utf8");

	// setting src
	htmlFileContent = htmlFileContent.replace("{{style}}", styleResPath);

	if (item.api === "browser") {
		htmlFileContent = htmlFileContent.replace("{{script1}}", browserApiResPath);
		htmlFileContent = htmlFileContent.replace("{{script2}}", consoleResPath);
		htmlFileContent = htmlFileContent.replace("{{script3}}", jsResPath);
	} else if (item.api === "node") {
		htmlFileContent = htmlFileContent.replace("{{script1}}", NodeApiResPath);
		htmlFileContent = htmlFileContent.replace("{{script2}}", consoleResPath);
	}

	panel.webview.html = htmlFileContent;
	return panel;
}
