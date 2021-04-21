setListener();

var CONSOLE = Object.freeze({
	log(...data: any[]) {
		for (let x of data) {
			const row = new Row({ indicator: indicators.info, text: x, hasInfo: true });
			main.appendChild(row.element);
		}
	},

	warn(...data: any[]) {
		for (let x of data) {
			const row = new Row({ indicator: indicators.info, text: x, hasWarning: true });
			main.appendChild(row.element);
		}
	},

	clear() {
		main.innerHTML = "";
	},
});

console.log = CONSOLE.log;
console.warn = CONSOLE.warn;
console.clear = CONSOLE.clear;

var WINDOW = Object.freeze({
	alert(message?: any) {
		const modal = new Modal(message, {
			text: "ok",
			color: "blue",
			callback: () => {
				modal.hide();
			},
		});

		console.warn("use of experimental method: <i>window.alert</i>");

		modal.show();
	},

	confirm() {},

	prompt() {},
});

window.alert = WINDOW.alert;

const VM = Object.freeze({
	vm: (function* createVm(expr?: string) {
		while (1) {
			try {
				expr = yield eval(expr || "");
			} catch (e) {
				expr = yield new Error(e instanceof Error ? e.message : e);
			}
		}
	})(),

	exec(expr: string) {
		return this.vm.next(expr);
	},
});
VM.vm.next();

var indicators = Object.freeze({
	input: "⫸",
	output: "⫷",
	info: "<span>!</span>",
});

const main: HTMLDivElement = document.querySelector("main") as HTMLDivElement;

function setListener() {
	(document.querySelector(".execution") as HTMLDivElement).addEventListener("keydown", (e: KeyboardEvent) => {
		const el = e.target as HTMLDivElement;
		if (!e.shiftKey && e.key === "Enter" && el.textContent?.trim() !== "") {
			el.parentElement!.classList.remove("execution");
			el.contentEditable = "false";
			evaluate(el.textContent!);

			const exeRow = new Row({ indicator: indicators.input, text: "", isExecution: true }).element;
			main.appendChild(exeRow);
			e.preventDefault();
			(exeRow.querySelector(".script") as HTMLDivElement).focus();
			setListener();
		} else if (e.key === "Tab") {
			e.preventDefault();
			// el.innerHTML += "\t";
		}
	});
}

function evaluate(str: string) {
	let resultRow: Row;
	const result = VM.exec(str).value;

	if (result instanceof Error) resultRow = new Row({ indicator: indicators.info, text: result.message, hasError: true });
	else resultRow = new Row({ indicator: indicators.output, text: result });

	main.appendChild(resultRow.element);
}

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

interface ModalButtonProperties {
	text: string;
	color: string;
	callback?: () => void;
}

class Modal {
	private el?: HTMLDivElement;

	text: string;
	buttonList = new Array<HTMLButtonElement>();

	constructor(t: string, ...p: ModalButtonProperties[]) {
		this.text = t;
		for (let prop of p) {
			let btn = document.createElement("button");
			btn.textContent = prop.text;
			btn.setAttribute("style", `--button-color:${prop.color}`);
			btn.classList.add("modal-button");
			btn.onclick = prop.callback ?? null;
			this.buttonList.push(btn);
		}
	}

	private registerElement(): void {
		this.el ??= (() => {
			const modal = document.createElement("div");
			modal.classList.add("modal");

			const txt = document.createElement("p");
			txt.textContent = this.text;

			const buttonContainer = document.createElement("div");
			buttonContainer.classList.add("button-container");

			buttonContainer.append(...this.buttonList);
			modal.append(txt, buttonContainer);

			return modal;
		})();
	}

	show() {
		this.registerElement();
		BackDrop.show();
		document.body.appendChild(this.el!);
	}

	hide() {
		this.el?.remove();
		BackDrop.hide();
	}
}

class BackDrop {
	private constructor() {}

	private static element = (() => {
		const el = document.createElement("div");
		el.style.position = "fixed";
		el.style.top = "0";
		el.style.left = "0";
		el.style.width = "100%";
		el.style.height = "100%";
		el.style.backgroundColor = "var(--vscode-editor-selectionBackground)";
		return el;
	})();

	static show(): void {
		document.body.appendChild(BackDrop.element);
	}

	static hide(): void {
		BackDrop.element.remove();
	}
}
