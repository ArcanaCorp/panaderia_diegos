
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

        // ==========================================
        // CONFIGURACIÓN
        // ==========================================

        const currency = sale.currency || "S/";
        const taxLabel = sale.taxLabel || "IGV";

        const money = (value) =>
            `${currency} ${Number(value || 0).toFixed(2)}`;

        const number = (value) => Number(value || 0);

        const quantity = (value) =>
            Number(value || 0).toLocaleString("es-PE", {
                maximumFractionDigits: 3,
            });

        const company = {
            name: sale.companyName || "MI EMPRESA",
            taxId: sale.taxId || "",
            address: sale.companyAddress || "",
            city: sale.companyCity || "",
            country: sale.companyCountry || "PERÚ",
            fiscalRegime: sale.fiscalRegime || "",
            expeditionPlace: sale.expeditionPlace || "",
        };

        // ==========================================
        // DATOS DE VENTA
        // ==========================================

        const items = sale.items.map((item) => {
            const qty = number(item.quantity);
            const price = number(item.price);
            const total = number(
                item.total ?? qty * price
            );

            return {
                quantity: qty,
                unit: item.unit || "UND",
                name: item.name || "Producto",
                price,
                total,
            };
        });

        const subtotal = number(
            sale.subtotal ??
            items.reduce((sum, item) => sum + item.total, 0)
        );

        const discounts = number(sale.discounts);
        const tax = number(sale.tax);
        const total = number(
            sale.total ?? subtotal - discounts + tax
        );

        const totalArticles = items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        // ==========================================
        // PRODUCTOS
        // ==========================================

        const itemsHtml = items.map((item) => `
            <tr>
                <td class="quantity">
                    ${quantity(item.quantity)}
                </td>

                <td class="unit">
                    ${escapeHtml(item.unit)}
                </td>

                <td class="description">
                    ${escapeHtml(item.name)}
                </td>

                <td class="price">
                    ${item.price.toFixed(2)}
                </td>

                <td class="price">
                    ${item.total.toFixed(2)}
                </td>
            </tr>
        `).join("");

        // ==========================================
        // FECHA
        // ==========================================

        const date = sale.date || new Date().toLocaleString(
            "es-PE",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

        // ==========================================
        // HTML DEL TICKET
        // ==========================================

        const html = `
        <!DOCTYPE html>
        <html lang="es">

        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>Nota de venta</title>

            <style>
                @page {
                    size: 80mm auto;
                    margin: 3mm;
                }

                * {
                    box-sizing: border-box;
                }

                html, body {
                    margin: 0;
                    padding: 0;
                    background: white;
                    color: #000;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 11px;
                }

                body {
                    width: 74mm;
                    margin: 0 auto;
                    padding: 2mm 0;
                }

                .center {
                    text-align: center;
                }

                .right {
                    text-align: right;
                }

                .bold {
                    font-weight: bold;
                }

                .company-name {
                    font-size: 16px;
                    font-weight: bold;
                    margin: 0 0 3px;
                }

                .company-info {
                    font-size: 10px;
                    line-height: 1.4;
                    margin: 2px 0;
                }

                .section-title {
                    border-top: 2px solid #555;
                    border-bottom: 2px solid #555;
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    padding: 4px 0;
                    margin: 12px 0 18px;
                }

                .details {
                    line-height: 1.7;
                    font-size: 11px;
                }

                .folio {
                    font-size: 14px;
                    font-weight: bold;
                }

                .separator {
                    border-top: 1px solid #999;
                    margin: 7px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                th {
                    font-size: 10px;
                    font-weight: normal;
                    text-align: center;
                    border-bottom: 1px solid #999;
                    padding: 5px 1px;
                }

                td {
                    font-size: 11px;
                    padding: 5px 1px;
                    vertical-align: top;
                    overflow-wrap: anywhere;
                }

                .quantity {
                    width: 11%;
                    text-align: center;
                }

                .unit {
                    width: 13%;
                    text-align: center;
                }

                .description {
                    width: 37%;
                    text-align: left;
                }

                .price {
                    width: 19.5%;
                    text-align: right;
                    white-space: nowrap;
                }

                .totals {
                    width: 100%;
                    margin-top: 5px;
                }

                .totals td {
                    padding: 3px 1px;
                    font-size: 12px;
                }

                .totals .label {
                    text-align: right;
                    font-weight: bold;
                    padding-right: 10px;
                }

                .totals .value {
                    text-align: right;
                    white-space: nowrap;
                }

                .total-final td {
                    font-size: 17px;
                    font-weight: bold;
                }

                .articles {
                    font-size: 12px;
                    margin: 8px 0;
                }

                .amount-words {
                    font-size: 15px;
                    font-weight: bold;
                    text-align: center;
                    text-transform: uppercase;
                    margin: 24px 0;
                    line-height: 1.5;
                }

                .payment {
                    font-size: 11px;
                    line-height: 1.8;
                    margin-top: 15px;
                }

                .payment strong {
                    font-weight: bold;
                }

                .footer {
                    text-align: center;
                    font-size: 14px;
                    margin: 28px 0 12px;
                }

                @media screen {
                    body {
                        margin: 20px auto;
                        padding: 10px;
                        box-shadow: 0 0 5px #999;
                        width: 74mm;
                    }
                }

                @media print {
                    html, body {
                        width: 74mm;
                        margin: 0;
                        padding: 0;
                    }

                    .no-print {
                        display: none;
                    }

                    tr, td {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>

        <body>

            <!-- ENCABEZADO EMPRESARIAL -->

            <header class="center">

                <h1 class="company-name">
                    ${escapeHtml(company.name)}
                </h1>

                ${company.taxId ? `
                    <p class="company-info bold">
                        ${escapeHtml(company.taxId)}
                    </p>
                ` : ""}

                ${company.address ? `
                    <p class="company-info">
                        ${escapeHtml(company.address)}
                    </p>
                ` : ""}

                ${company.city ? `
                    <p class="company-info">
                        ${escapeHtml(company.city)}
                    </p>
                ` : ""}

                <p class="company-info">
                    ${escapeHtml(company.country)}
                </p>

                ${company.fiscalRegime ? `
                    <p class="company-info bold">
                        RÉGIMEN FISCAL:
                    </p>
                    <p class="company-info">
                        ${escapeHtml(company.fiscalRegime)}
                    </p>
                ` : ""}

                ${company.expeditionPlace ? `
                    <p class="company-info bold">
                        LUGAR DE EXPEDICIÓN:
                    </p>
                    <p class="company-info">
                        ${escapeHtml(company.expeditionPlace)}
                    </p>
                ` : ""}

            </header>

            <!-- TÍTULO -->

            <div class="section-title">
                NOTA DE VENTA
            </div>

            <!-- INFORMACIÓN DE VENTA -->

            <section class="details">

                <div>
                    <strong>Fecha y Hora de Emisión:</strong>
                    ${escapeHtml(date)}
                </div>

                <div>
                    <strong>Cliente:</strong>
                    ${escapeHtml(sale.customerName || "Público en General")}
                </div>

                <div>
                    <strong>Cajero:</strong>
                    ${escapeHtml(sale.cashier || "")}
                </div>

                <div class="folio">
                    Folio: ${escapeHtml(sale.saleNumber || "1")}
                </div>

            </section>

            <div class="separator"></div>

            <!-- DETALLE DE PRODUCTOS -->

            <table>

                <thead>
                    <tr>
                        <th class="quantity">Cantidad</th>
                        <th class="unit">Unidad</th>
                        <th class="description">Descripción</th>
                        <th class="price">Valor<br>Unitario</th>
                        <th class="price">Total</th>
                    </tr>
                </thead>

                <tbody>
                    ${itemsHtml}
                </tbody>

            </table>

            <div class="separator"></div>

            <!-- RESUMEN ECONÓMICO -->

            <table class="totals">

                <tbody>

                    <tr>
                        <td class="label">Subtotal</td>
                        <td class="value">
                            ${subtotal.toFixed(2)}
                        </td>
                    </tr>

                    <tr>
                        <td class="label">Descuentos</td>
                        <td class="value">
                            ${discounts.toFixed(2)}
                        </td>
                    </tr>

                    <tr>
                        <td class="label">${escapeHtml(taxLabel)}</td>
                        <td class="value">
                            ${tax.toFixed(2)}
                        </td>
                    </tr>

                    <tr class="total-final">
                        <td class="label">Total</td>
                        <td class="value">
                            ${total.toFixed(2)}
                        </td>
                    </tr>

                </tbody>

            </table>

            <div class="separator"></div>

            <!-- CANTIDAD DE ARTÍCULOS -->

            <p class="articles">
                Artículos: ${quantity(totalArticles)}
            </p>

            <!-- TOTAL EN LETRAS -->

            ${sale.totalInWords ? `
                <div class="amount-words">
                    ${escapeHtml(sale.totalInWords)}
                </div>
            ` : ""}

            <!-- INFORMACIÓN DE PAGO -->

            <section class="payment">

                <div>
                    <strong>Método de Pago:</strong>
                    ${escapeHtml(sale.paymentMethod || "Contado")}
                </div>

                <div>
                    <strong>Forma de pago:</strong>
                    ${escapeHtml(sale.paymentType || "Efectivo")}
                </div>

                <div>
                    <strong>Moneda:</strong>
                    ${escapeHtml(sale.currencyName || "Sol peruano")}
                </div>

                ${sale.exchangeRate ? `
                    <div>
                        <strong>Tipo de cambio:</strong>
                        ${escapeHtml(sale.exchangeRate)}
                    </div>
                ` : ""}

                <div>
                    <strong>Pago:</strong>
                    ${money(total)}
                </div>

            </section>

            <!-- PIE DE TICKET -->

            <footer class="footer">
                ¡ GRACIAS POR SU COMPRA !
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