// @ts-ignore
function evaluate(str: string) {
	// @ts-ignore
	vscode.postMessage(str);
}

window.addEventListener("message", (event) => {
	const message = event.data;

	let resultRow: Row;
	const result = VM.exec(message);

	if (result instanceof Error) resultRow = new Row({ indicator: indicators.info, text: result.message, hasError: true });
	else resultRow = new Row({ indicator: indicators.output, text: result });

	main.appendChild(resultRow.element);

	// ----------------------------------------------------------------------------------------------------------------------

	const exeRow = new Row({ indicator: indicators.input, text: "", isExecution: true }).element;
	main.appendChild(exeRow);
	(exeRow.querySelector(".script") as HTMLDivElement).focus();
	setListener();
});
