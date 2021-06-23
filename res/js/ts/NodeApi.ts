// @ts-ignore
function evaluate(str: string) {
	// @ts-ignore
	vscode.postMessage(str);
}

window.addEventListener("message", (event) => {
	const { status, result } = event.data;

	let resultRow: Row;

	if (status === "error") resultRow = new Row({ indicator: indicators.info, text: result, hasError: true });
	else resultRow = new Row({ indicator: indicators.output, text: result });

	main.appendChild(resultRow.element);

	// ----------------------------------------------------------------------------------------------------------

	const exeRow = new Row({ indicator: indicators.input, text: "", isExecution: true }).element;
	main.appendChild(exeRow);
	(exeRow.querySelector(".script") as HTMLDivElement).focus();
	setListener();
});
