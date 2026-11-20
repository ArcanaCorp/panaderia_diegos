
const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

export async function POST(request) {
    try {
        const sale = await request.json();

        if (!sale || !Array.isArray(sale.items) || !sale.items.length) {
            return Response.json(
                { error: "Datos de venta inválidos" },
                { status: 400 }
            );
        }

        const money = (value) =>
            `S/ ${Number(value || 0).toFixed(2)}`;

        const itemsHtml = sale.items.map((item) => `
            <tr>
                <td>
                    ${escapeHtml(item.name)}
                    <small>${item.quantity} x ${money(item.price)}</small>
                </td>
                <td class="right">
                    ${money(item.quantity * item.price)}
                </td>
            </tr>
        `).join("");

        const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>Nota de venta</title>
                <style>
                    @page {
                        size: 80mm auto;
                        margin: 3mm;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        width: 74mm;
                        margin: 0 auto;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        color: #000;
                    }

                    .center {
                        text-align: center;
                    }

                    .bold {
                        font-weight: bold;
                    }

                    .divider {
                        border-top: 1px dashed #000;
                        margin: 10px 0;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    td {
                        padding: 4px 0;
                        vertical-align: top;
                    }

                    .right {
                        text-align: right;
                        white-space: nowrap;
                    }

                    small {
                        display: block;
                        font-size: 10px;
                    }

                    .total {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    @media screen {
                        body {
                            margin: 20px auto;
                        }
                    }
                </style>
            </head>

            <body>
                <header class="center">
                    <h2>${escapeHtml(sale.companyName)}</h2>
                    <p>NOTA DE VENTA</p>
                </header>

                <div class="divider"></div>

                <p>
                    N°: ${escapeHtml(sale.saleNumber)}<br>
                    Fecha: ${escapeHtml(sale.date)}<br>
                    Cliente: ${escapeHtml(sale.customerName || "Público general")}
                </p>

                <div class="divider"></div>

                <table>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="divider"></div>

                <p class="right total">
                    TOTAL: ${money(sale.total)}
                </p>

                <div class="divider"></div>

                <footer class="center">
                    <p>¡Gracias por su compra!</p>
                    <small>Conserve su nota de venta</small>
                </footer>
            </body>
            </html>
        `;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store",
            },
        });

    } catch (error) {
        console.error("Error generando nota:", error);

        return Response.json(
            { error: "No se pudo generar la nota de venta" },
            { status: 500 }
        );
    }
}