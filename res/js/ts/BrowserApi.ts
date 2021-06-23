var CONSOLE = {
	generateString(...data: any[]): string {
		let message: string = "";
		for (let x of data) message += ` ${x}`;
		return message;
	},

	log(...data: any[]) {
		const row = new Row({ indicator: indicators.info, text: CONSOLE.generateString(...data), hasInfo: true });
		main.appendChild(row.element);
	},

	warn(...data: any[]) {
		const row = new Row({ indicator: indicators.info, text: CONSOLE.generateString(...data), hasWarning: true });
		main.appendChild(row.element);
	},

	error(...data: any[]) {
		const row = new Row({ indicator: indicators.info, text: CONSOLE.generateString(...data), hasError: true });
		main.appendChild(row.element);
	},

	clear() {
		main.innerHTML = "";
	},

	table(...data: any[]) {
		const table = document.createElement("table");
		const thead = document.createElement("thead");
		const tbody = document.createElement("tbody");

		table.classList.add("table");
		table.append(thead, tbody);

		const model: any = {};
		const models: Array<any> = [];

		for (let o of data) {
			for (let k of Object.keys(o)) {
				model[k] = "";
			}
		}

		for (let o of data) {
			const tempModel: any = Object.assign({}, model);
			for (let k of Object.keys(o)) {
				tempModel[k] = o[k];
			}
			models.push(tempModel);
		}

		for (let k of Object.keys(model)) {
			const td = document.createElement("td");
			td.textContent = k;
			thead.append(td);
		}

		for (let o of models) {
			const tbodyTR = document.createElement("tr");
			for (let k of Object.keys(model)) {
				const td = document.createElement("td");
				if (o.hasOwnProperty(k)) td.textContent = o[k];
				tbodyTR.append(td);
			}
			tbody.append(tbodyTR);
		}

		main.append(table);
	},

	counter: { default: 0 } as any,
	count(label: string = "default") {
		if (!CONSOLE.counter.hasOwnProperty(label)) CONSOLE.counter[label] = 0;
		CONSOLE.log(`${label}: ${++CONSOLE.counter[label]}`);
	},

	countReset() {
		CONSOLE.counter = { default: 0 };
	},

	timer: {} as any,
	time(label: string = "default") {
		if (CONSOLE.timer.hasOwnProperty(label)) {
			CONSOLE.warn(`timer '${label}' already exist`);
			return;
		}

		CONSOLE.timer[label] = performance.now();
	},

	timeEnd(label: string = "default") {
		if (!CONSOLE.timer.hasOwnProperty(label)) {
			CONSOLE.warn(`timer '${label}' doesn't exist`);
			return;
		}

		CONSOLE.log(`${label}: ${performance.now() - CONSOLE.timer[label]} ms`);
		delete CONSOLE.timer[label];
	},
};

console.log = CONSOLE.log;
console.info = CONSOLE.log;
console.warn = CONSOLE.warn;
console.error = CONSOLE.error;
console.clear = CONSOLE.clear;
console.table = CONSOLE.table;
console.count = CONSOLE.count;
console.countReset = CONSOLE.countReset;
console.time = CONSOLE.time;
console.timeEnd = CONSOLE.timeEnd;

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

var __EVAL = (s: string) => eval(`void (__EVAL = ${__EVAL.toString()}); ${s}`);

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
