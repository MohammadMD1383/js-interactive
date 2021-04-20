setListener();
class Console {
    static log(...data) {
        for (let x of data) {
            const row = new Row({ text: x });
            main.appendChild(row.element);
        }
    }
    static warn(...data) {
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
    vm: (function* createVm(expr) {
        while (1) {
            try {
                expr = yield eval(expr || "");
            }
            catch (e) {
                expr = yield new Error(e instanceof Error ? e.message : e);
            }
        }
    })(),
    exec(expr) {
        return this.vm.next(expr);
    },
});
VM.vm.next();
var indicators = Object.freeze({
    input: "⫸",
    output: "⫷",
    error: "<span>!</span>",
});
const main = document.querySelector("main");
function setListener() {
    document.querySelector(".execution").addEventListener("keydown", (e) => {
        var _a;
        const el = e.target;
        if (!e.shiftKey && e.key === "Enter" && ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== "") {
            el.parentElement.classList.remove("execution");
            el.contentEditable = "false";
            evaluate(el.textContent);
            const exeRow = new Row({ indicator: indicators.input, text: "", isExecution: true }).element;
            main.appendChild(exeRow);
            e.preventDefault();
            exeRow.querySelector(".script").focus();
            setListener();
        }
        else if (e.key === "Tab") {
            e.preventDefault();
        }
    });
}
function evaluate(str) {
    let resultRow;
    const result = VM.exec(str).value;
    if (result instanceof Error)
        resultRow = new Row({ indicator: indicators.error, text: result.message, hasError: true });
    else
        resultRow = new Row({ indicator: indicators.output, text: result });
    main.appendChild(resultRow.element);
}
class Row {
    constructor(p) {
        var _a, _b, _c, _d;
        this.indicator = (_a = p.indicator) !== null && _a !== void 0 ? _a : "";
        this.text = p.text;
        this.isExecution = (_b = p.isExecution) !== null && _b !== void 0 ? _b : false;
        this.hasError = (_c = p.hasError) !== null && _c !== void 0 ? _c : false;
        this.hasWarning = (_d = p.hasWarning) !== null && _d !== void 0 ? _d : false;
    }
    get element() {
        const div = document.createElement("div");
        let editable = false;
        div.classList.add("row");
        if (this.isExecution) {
            div.classList.add("execution");
            editable = true;
        }
        if (this.hasError)
            div.classList.add("error");
        if (this.hasWarning)
            div.classList.add("warning");
        div.innerHTML += `<div class="indicator">${this.indicator}</div>`;
        div.innerHTML += `<div class="script" contenteditable="${editable}">${this.text}</div>`;
        return div;
    }
}
//# sourceMappingURL=console.js.map