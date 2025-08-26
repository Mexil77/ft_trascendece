const TableRow = <T extends Record<string, any>>(rowData: T) => {
	const TableRowTr = document.createElement("tr");
	TableRowTr.className =
		"bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200";
	Object.values(rowData).forEach((value) => {
		const TableRowTd = document.createElement("td");
		TableRowTd.className = "px-6 py-4";
		TableRowTd.textContent = value;
		TableRowTr.appendChild(TableRowTd);
	});
	return TableRowTr;
};

export const Table = <T extends Record<string, any>>(
	headers: string[],
	dataRows: T[]
) => {
	const TableContainer = document.createElement("table");
	TableContainer.className =
		"w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400";

	const TableHeader = document.createElement("thead");
	TableHeader.className =
		"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400";

	const TableHeaderTr = document.createElement("tr");

	headers.map((header: string) => {
		const TableHeaderTh = document.createElement("th");
		TableHeaderTh.scope = "col";
		TableHeaderTh.className = "px-6 py-3";
		TableHeaderTh.textContent = header;
		TableHeaderTr.appendChild(TableHeaderTh);
	});
	TableHeader.appendChild(TableHeaderTr);

	TableContainer.appendChild(TableHeader);

	const TableBody = document.createElement("tbody");
	dataRows.map((dataRow: T) => {
		TableBody.appendChild(TableRow(dataRow));
	});
	TableContainer.appendChild(TableBody);
	return TableContainer;
};
