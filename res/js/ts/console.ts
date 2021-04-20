setListener();

class Console {
	static log(...data: any[]) {
		for (let x of data) {
			const row = new Row({ text: x });
			main.appendChild(row.element);
		}
	}

	static warn(...data: any[]) {
		for (let x of data) {
			const row = new Row({ indicator: indicators.error, text: x, hasWarning: true });
			main.appendChild(row.element);
		}
	}

	static clear() {
		main.innerHTML = "";
	}
}

console.log = Console.log;
console.warn = Console.warn;
console.clear = Console.clear;

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
	error: "<span>!</span>",
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

	if (result instanceof Error) resultRow = new Row({ indicator: indicators.error, text: result.message, hasError: true });
	else resultRow = new Row({ indicator: indicators.output, text: result });

	main.appendChild(resultRow.element);
}

interface RowParameter {
	indicator?: string;
	text?: string;
	isExecution?: boolean;
	hasError?: boolean;
	hasWarning?: boolean;
}

class Row {
	indicator: string;
	text?: string;

	isExecution: boolean;
	hasError: boolean;
	hasWarning: boolean;

	constructor(p: RowParameter) {
		this.indicator = p.indicator ?? "";
		this.text = p.text;
		this.isExecution = p.isExecution ?? false;
		this.hasError = p.hasError ?? false;
		this.hasWarning = p.hasWarning ?? false;
	}

	get element(): HTMLDivElement {
		const div = document.createElement("div");
		let editable = false;

		div.classList.add("row");
		if (this.isExecution) {
			div.classList.add("execution");
			editable = true;
		}
		if (this.hasError) div.classList.add("error");
		if (this.hasWarning) div.classList.add("warning");

		div.innerHTML += `<div class="indicator">${this.indicator}</div>`;
		div.innerHTML += `<div class="script" contenteditable="${editable}">${this.text}</div>`;

		return div;
	}
}
