export default function ExportButtons({ handleExportCSV }) {
    const handlePDF = () => {
        const table = document.getElementById("students-table");
        if (!table) return alert("Table not found");

        // Clone the table so we don't affect the original
        const tableClone = table.cloneNode(true);

        // Remove last column (Actions) from all rows
        const rows = tableClone.querySelectorAll("tr");
        rows.forEach(row => {
            row.removeChild(row.lastElementChild);
        });

        // Fix status colors
       tableClone.querySelectorAll("td span").forEach(span => {
    const status = span.textContent.trim();
    if (status === "Enrolled") {
        span.style.backgroundColor = "#166534"; // dark green
        span.style.color = "#FFFFFF";           // white text
    } else if (status === "Withdrawn") {
        span.style.backgroundColor = "#991B1B"; // dark red (optional)
        span.style.color = "#FFFFFF";
    } else {
        span.style.backgroundColor = "#374151"; // dark gray (optional)
        span.style.color = "#FFFFFF";
    }
    span.style.padding = "2px 6px";
    span.style.borderRadius = "0.25rem";
    span.style.fontSize = "0.75rem";
    span.style.webkitPrintColorAdjust = "exact";
    span.style.printColorAdjust = "exact";
});

        // Open new window
        const newWindow = window.open("", "_blank", "width=900,height=700");
        newWindow.document.write("<html><head><title>Students PDF</title>");
        newWindow.document.write("<style>");
        newWindow.document.write(`
            table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; border-radius: 0.5rem; overflow: hidden; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f3f3f3; }
        `);
        newWindow.document.write("</style></head><body>");
        newWindow.document.write(tableClone.outerHTML);
        newWindow.document.write("</body></html>");
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        newWindow.close();
    };

    return (
        <div className="flex gap-2">
            {/* CSV Export */}
            <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
                Export CSV
            </button>

            {/* PDF Export */}
            <button
                onClick={handlePDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
                Export PDF
            </button>
        </div>
    );
}
