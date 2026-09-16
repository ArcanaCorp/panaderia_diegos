import * as XLSX from 'xlsx';

export function exportProductsToExcel(products) {
    if (!products || products.length === 0) {
        return false;
    }

    const rows = products.map((product) => ({
        SKU: product.sku || '',
        Producto: product.name || '',
        Categoría: product.category || 'Sin categoría',
        Unidad: product.unit_type || '',
        'Precio unitario': Number(product.price_unit || 0),
        'Precio por docena': product.price_dozen
            ? Number(product.price_dozen)
            : '',
        Costo: Number(product.cost_price || 0),
        Stock: Number(product.stock || 0),
        Estado:
            product.status === 'active'
                ? 'Activo'
                : 'Inactivo',
    }));

    const worksheet =
        XLSX.utils.json_to_sheet(rows);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Productos'
    );

    worksheet['!cols'] = [
        { wch: 18 },
        { wch: 30 },
        { wch: 22 },
        { wch: 14 },
        { wch: 18 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
    ];

    const date = new Date()
        .toISOString()
        .slice(0, 10);

    XLSX.writeFile(
        workbook,
        `productos-${date}.xlsx`
    );

    return true;
}