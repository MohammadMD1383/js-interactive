// @ts-ignore
function evaluate(str: string) {
	let resultRow: Row;
	const result = VM.exec(str);

	if (result instanceof Error) resultRow = new Row({ indicator: indicators.info, text: result.message, hasError: true });
	else resultRow = new Row({ indicator: indicators.output, text: result });

	main.appendChild(resultRow.element);

	// -----------------------------------------------------------------------------------------------------------------------

	const exeRow = new Row({ indicator: indicators.input, text: "", isExecution: true }).element;
	main.appendChild(exeRow);
	(exeRow.querySelector(".script") as HTMLDivElement).focus();
	setListener();
}
