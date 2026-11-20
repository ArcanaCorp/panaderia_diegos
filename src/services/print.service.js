export const salePrint = async (sale) => {
        const printWindow = window.open("", "_blank", "width=400,height=700");

        if (!printWindow) {
            alert("Permite las ventanas emergentes para imprimir.");
            return;
        }

        try {
            const response = await fetch("/api/print-sale", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sale),
            });

            if (!response.ok) {
                throw new Error(`No se pudo generar la nota: ${response.statusText}`);
            }

            const html = await response.text();

            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };

        } catch (error) {
            printWindow.close();
            console.error(error);
            alert("Error al imprimir la nota de venta.");
        }
};