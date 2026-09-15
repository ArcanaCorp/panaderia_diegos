'use client';

import {
    IconPlus,
    IconSearch,
    IconFilter,
    IconDownload,
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconPackage,
    IconBox,
    IconRefresh,
    IconChevronDown,
} from '@tabler/icons-react';

const products = [
    {
        id: 1,
        name: 'Pan francés',
        sku: 'PAN-001',
        category: 'Panadería',
        unit: 'Unidad',
        price: 0.30,
        stock: 120,
        minStock: 50,
        status: 'Disponible',
        active: true,
    },
    {
        id: 2,
        name: 'Pan integral',
        sku: 'PAN-002',
        category: 'Panadería',
        unit: 'Unidad',
        price: 0.50,
        stock: 80,
        minStock: 30,
        status: 'Disponible',
        active: true,
    },
    {
        id: 3,
        name: 'Croissant',
        sku: 'CRO-001',
        category: 'Pastelería',
        unit: 'Unidad',
        price: 3.50,
        stock: 24,
        minStock: 10,
        status: 'Disponible',
        active: true,
    },
    {
        id: 4,
        name: 'Mantequilla',
        sku: 'MAN-001',
        category: 'Insumos',
        unit: 'Kg',
        price: 18.00,
        stock: 4,
        minStock: 10,
        status: 'Stock bajo',
        active: true,
    },
    {
        id: 5,
        name: 'Harina de trigo',
        sku: 'HAR-001',
        category: 'Insumos',
        unit: 'Kg',
        price: 4.50,
        stock: 0,
        minStock: 20,
        status: 'Sin stock',
        active: true,
    },
    {
        id: 6,
        name: 'Torta personal',
        sku: 'TOR-001',
        category: 'Pastelería',
        unit: 'Unidad',
        price: 8.00,
        stock: 12,
        minStock: 5,
        status: 'Disponible',
        active: true,
    },
];

export default function ProductsAdmin() {

    function handleNewProduct() {
        console.log('Nuevo producto');
    }

    function handleEdit(product) {
        console.log('Editar:', product);
    }

    function handleDelete(product) {
        console.log('Eliminar:', product);
    }

    function handleStock(product) {
        console.log('Rellenar stock:', product);
    }

    return (
        <main className="products">

            {/* Header */}
            <header className="products__header">
                <div>
                    <div className="products__title-row">
                        <div className="products__title-icon">
                            <IconPackage size={18} />
                        </div>

                        <div>
                            <h1 className="products__title">
                                Productos
                            </h1>

                            <p className="products__description">
                                Administra el catálogo, precios y stock de tus productos.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn--primary"
                    onClick={handleNewProduct}
                >
                    <IconPlus size={16} />
                    Nuevo producto
                </button>
            </header>

            {/* Stats */}
            <section className="products__stats">

                <div className="card products__stat">
                    <div className="products__stat-icon">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span>Total productos</span>
                        <strong>{products.length}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--success">
                        <IconBox size={17} />
                    </div>

                    <div>
                        <span>Disponibles</span>
                        <strong>
                            {products.filter(p => p.status === 'Disponible').length}
                        </strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--warning">
                        <IconRefresh size={17} />
                    </div>

                    <div>
                        <span>Stock bajo</span>
                        <strong>
                            {products.filter(p => p.status === 'Stock bajo').length}
                        </strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--danger">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span>Sin stock</span>
                        <strong>
                            {products.filter(p => p.status === 'Sin stock').length}
                        </strong>
                    </div>
                </div>

            </section>

            {/* Table */}
            <section className="card products__panel">

                <div className="products__toolbar">

                    <div className="products__search">
                        <IconSearch size={16} />

                        <input
                            type="text"
                            placeholder="Buscar producto, SKU..."
                        />
                    </div>

                    <div className="products__filters">

                        <button className="btn btn--outline btn--sm">
                            Todas las categorías
                            <IconChevronDown size={14} />
                        </button>

                        <button className="btn btn--outline btn--sm">
                            Estado
                            <IconChevronDown size={14} />
                        </button>

                        <button className="btn btn--outline btn--sm">
                            <IconFilter size={15} />
                            Filtros
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            <IconDownload size={15} />
                            Exportar
                        </button>

                    </div>

                </div>

                <div className="products__table-wrapper">
                    <table className="products__table">

                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (

                                <tr key={product.id}>

                                    <td>
                                        <div className="products__product">

                                            <div className="products__product-icon">
                                                <IconPackage size={16} />
                                            </div>

                                            <div>
                                                <strong>
                                                    {product.name}
                                                </strong>

                                                <span>
                                                    {product.unit}
                                                </span>
                                            </div>

                                        </div>
                                    </td>

                                    <td>
                                        <span className="products__sku">
                                            {product.sku}
                                        </span>
                                    </td>

                                    <td>
                                        {product.category}
                                    </td>

                                    <td>
                                        <strong>
                                            S/ {product.price.toFixed(2)}
                                        </strong>
                                    </td>

                                    <td>
                                        <div className="products__stock">

                                            <strong>
                                                {product.stock}
                                            </strong>

                                            <span>
                                                mín. {product.minStock}
                                            </span>

                                        </div>
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                product.status === 'Disponible'
                                                    ? 'badge--success'
                                                    : product.status === 'Stock bajo'
                                                        ? 'badge--warning'
                                                        : 'badge--danger'
                                            }`}
                                        >
                                            {product.status}
                                        </span>

                                    </td>

                                    <td>
                                        <div className="products__actions">

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Rellenar stock"
                                                onClick={() => handleStock(product)}
                                            >
                                                <IconRefresh size={16} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Editar"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <IconEdit size={16} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm products__delete"
                                                title="Eliminar"
                                                onClick={() => handleDelete(product)}
                                            >
                                                <IconTrash size={16} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Más opciones"
                                            >
                                                <IconDotsVertical size={16} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))}
                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                <div className="products__pagination">

                    <span>
                        Mostrando 1–6 de 6 productos
                    </span>

                    <div>
                        <button
                            className="btn btn--outline btn--sm"
                            disabled
                        >
                            Anterior
                        </button>

                        <button
                            className="btn btn--outline btn--sm"
                        >
                            Siguiente
                        </button>
                    </div>

                </div>

            </section>

        </main>
    );
}