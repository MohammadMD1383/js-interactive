// @ts-ignore
const vscode = acquireVsCodeApi();

var indicators = Object.freeze({
	input: "⫸",
	output: "⫷",
	info: "<span>!</span>",
});

interface RowParameter {
	indicator?: string;
	text?: string;
	isExecution?: boolean;
	hasInfo?: boolean;
	hasWarning?: boolean;
	hasError?: boolean;
}

class Row {
	indicator: string;
	text?: string;

	isExecution: boolean;
	hasInfo: boolean;
	hasWarning: boolean;
	hasError: boolean;

	constructor(p: RowParameter) {
		this.indicator = p.indicator ?? "";
		this.text = p.text;
		this.isExecution = p.isExecution ?? false;
		this.hasInfo = p.hasInfo ?? false;
		this.hasWarning = p.hasWarning ?? false;
		this.hasError = p.hasError ?? false;
	}

	get element(): HTMLDivElement {
		const div = document.createElement("div");
		let editable = false;

		div.classList.add("row");
		if (this.isExecution) {
			div.classList.add("execution");
			editable = true;
		}
		if (this.hasInfo) div.classList.add("info");
		if (this.hasWarning) div.classList.add("warning");
		if (this.hasError) div.classList.add("error");

		div.innerHTML += `<div class="indicator">${this.indicator}</div>`;
		div.innerHTML += `<div class="script" contenteditable="${editable}">${this.text}</div>`;

		return div;
	}
}

const main: HTMLDivElement = document.querySelector("main") as HTMLDivElement;

function insertTab() {
	let sel = document.getSelection();
	let range = sel!.getRangeAt(0);

	let tabNode = document.createTextNode("\xa0\xa0\xa0\xa0");
	range.insertNode(tabNode);

	range.setStartAfter(tabNode);
	range.setEndAfter(tabNode);
	sel!.removeAllRanges();
	sel!.addRange(range);
}

function setListener() {
	(document.querySelector(".execution") as HTMLDivElement).addEventListener("keydown", (e: KeyboardEvent) => {
		const el = e.target as HTMLDivElement;
		if (!e.shiftKey && e.key === "Enter" && el.textContent?.trim() !== "") {
			e.preventDefault();
			el.parentElement!.classList.remove("execution");
			el.contentEditable = "false";
			evaluate(el.textContent!);
		} else if (e.key === "Tab") {
			e.preventDefault();
			insertTab();
		}
	});
}
