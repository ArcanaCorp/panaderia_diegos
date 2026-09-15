'use client';

import {
    IconSearch,
    IconPlus,
    IconDownload,
    IconPackage,
    IconAlertTriangle,
    IconArchive,
    IconDotsVertical,
    IconChevronDown,
    IconArrowUp,
    IconArrowDown,
} from '@tabler/icons-react';

export default function InventaryAdmin() {

    const products = [
        {
            id: 1,
            name: 'Harina de trigo',
            sku: 'HAR-001',
            category: 'Insumos',
            unit: 'kg',
            stock: 8,
            minStock: 20,
            status: 'Bajo',
        },
        {
            id: 2,
            name: 'Azúcar',
            sku: 'AZU-001',
            category: 'Insumos',
            unit: 'kg',
            stock: 12,
            minStock: 20,
            status: 'Bajo',
        },
        {
            id: 3,
            name: 'Mantequilla',
            sku: 'MAN-001',
            category: 'Insumos',
            unit: 'kg',
            stock: 4,
            minStock: 10,
            status: 'Crítico',
        },
        {
            id: 4,
            name: 'Pan francés',
            sku: 'PAN-001',
            category: 'Panadería',
            unit: 'unidad',
            stock: 120,
            minStock: 50,
            status: 'Disponible',
        },
        {
            id: 5,
            name: 'Croissant',
            sku: 'CRO-001',
            category: 'Pastelería',
            unit: 'unidad',
            stock: 24,
            minStock: 10,
            status: 'Disponible',
        },
        {
            id: 6,
            name: 'Café americano',
            sku: 'CAF-001',
            category: 'Bebidas',
            unit: 'unidad',
            stock: 30,
            minStock: 10,
            status: 'Disponible',
        },
    ];

    return (
        <main className="inventory">

            {/* HEADER */}

            <header className="inventory__header">

                <div>
                    <p className="inventory__eyebrow">
                        Almacén
                    </p>

                    <h1 className="inventory__title">
                        Inventario
                    </h1>

                    <p className="inventory__description">
                        Controla tus productos y niveles de stock.
                    </p>
                </div>

                <div className="inventory__actions">

                    <button className="btn btn--outline">
                        <IconDownload size={16} />
                        Exportar
                    </button>

                    <button className="btn btn--primary">
                        <IconPlus size={16} />
                        Nuevo producto
                    </button>

                </div>

            </header>


            {/* SUMMARY */}

            <section className="inventory__stats">

                <div className="card inventory__stat">

                    <div className="inventory__stat-icon">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <p className="inventory__stat-label">
                            Total productos
                        </p>

                        <strong className="inventory__stat-value">
                            248
                        </strong>
                    </div>

                </div>


                <div className="card inventory__stat">

                    <div className="inventory__stat-icon inventory__stat-icon--warning">
                        <IconAlertTriangle size={17} />
                    </div>

                    <div>
                        <p className="inventory__stat-label">
                            Stock bajo
                        </p>

                        <strong className="inventory__stat-value">
                            6
                        </strong>
                    </div>

                </div>


                <div className="card inventory__stat">

                    <div className="inventory__stat-icon inventory__stat-icon--danger">
                        <IconArchive size={17} />
                    </div>

                    <div>
                        <p className="inventory__stat-label">
                            Sin stock
                        </p>

                        <strong className="inventory__stat-value">
                            2
                        </strong>
                    </div>

                </div>


                <div className="card inventory__stat">

                    <div className="inventory__stat-icon">
                        <IconArrowUp size={17} />
                    </div>

                    <div>
                        <p className="inventory__stat-label">
                            Ingresos este mes
                        </p>

                        <strong className="inventory__stat-value">
                            42
                        </strong>
                    </div>

                </div>

            </section>


            {/* INVENTORY TABLE */}

            <section className="card inventory__content">

                {/* TOOLBAR */}

                <div className="inventory__toolbar">

                    <div className="inventory__search">

                        <div className="input-group input-group--left">

                            <span className="input-group__icon--left">
                                <IconSearch size={17} />
                            </span>

                            <input
                                className="input"
                                placeholder="Buscar producto, SKU..."
                            />

                        </div>

                    </div>


                    <div className="inventory__filters">

                        <button className="btn btn--outline">
                            Todas las categorías
                            <IconChevronDown size={15} />
                        </button>

                        <button className="btn btn--outline">
                            Todos los estados
                            <IconChevronDown size={15} />
                        </button>

                    </div>

                </div>


                {/* TABLE */}

                <div className="inventory__table-wrapper">

                    <table className="inventory__table">

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>Mínimo</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {products.map((product) => (

                                <tr key={product.id}>

                                    <td>
                                        <div className="inventory__product">

                                            <div className="inventory__product-icon">
                                                <IconPackage size={16} />
                                            </div>

                                            <div>
                                                <p className="inventory__product-name">
                                                    {product.name}
                                                </p>

                                                <span className="inventory__product-unit">
                                                    {product.unit}
                                                </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        <span className="inventory__sku">
                                            {product.sku}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="inventory__category">
                                            {product.category}
                                        </span>
                                    </td>

                                    <td>
                                        <strong className="inventory__stock">
                                            {product.stock}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="inventory__minimum">
                                            {product.minStock}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${
                                                product.status === 'Crítico'
                                                    ? 'badge--danger'
                                                    : product.status === 'Bajo'
                                                        ? 'badge--warning'
                                                        : 'badge--success'
                                            }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>

                                    <td>

                                        <button className="btn btn--ghost btn--icon">
                                            <IconDotsVertical size={17} />
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* FOOTER */}

                <div className="inventory__footer">

                    <span>
                        Mostrando 6 de 248 productos
                    </span>

                    <div className="inventory__pagination">

                        <button className="btn btn--outline btn--sm">
                            Anterior
                        </button>

                        <button className="btn btn--primary btn--sm">
                            1
                        </button>

                        <button className="btn btn--outline btn--sm">
                            2
                        </button>

                        <button className="btn btn--outline btn--sm">
                            3
                        </button>

                        <button className="btn btn--outline btn--sm">
                            Siguiente
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}