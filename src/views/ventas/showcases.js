'use client';

import { useState } from 'react';
import {
    IconPackage,
    IconSearch,
    IconFilter,
    IconEye,
    IconTransfer,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

export default function ShowcasesView() {

    const { profile } = useAuth();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Todas');

    const products = [
        {
            id: 1,
            name: 'Pan francés',
            sku: 'PAN-001',
            category: 'Panadería',
            price: 0.30,
            stock: 120,
            unit: 'Unidad',
            status: 'Disponible',
            badge: 'success',
        },
        {
            id: 2,
            name: 'Pan integral',
            sku: 'PAN-002',
            category: 'Panadería',
            price: 0.50,
            stock: 80,
            unit: 'Unidad',
            status: 'Disponible',
            badge: 'success',
        },
        {
            id: 3,
            name: 'Croissant',
            sku: 'CRO-001',
            category: 'Pastelería',
            price: 3.50,
            stock: 24,
            unit: 'Unidad',
            status: 'Stock bajo',
            badge: 'warning',
        },
        {
            id: 4,
            name: 'Empanada de carne',
            sku: 'EMP-001',
            category: 'Panadería',
            price: 4.00,
            stock: 18,
            unit: 'Unidad',
            status: 'Disponible',
            badge: 'success',
        },
        {
            id: 5,
            name: 'Torta personal',
            sku: 'TOR-001',
            category: 'Pastelería',
            price: 8.00,
            stock: 12,
            unit: 'Unidad',
            status: 'Stock bajo',
            badge: 'warning',
        },
        {
            id: 6,
            name: 'Café americano',
            sku: 'CAF-001',
            category: 'Bebidas',
            price: 4.50,
            stock: 30,
            unit: 'Unidad',
            status: 'Disponible',
            badge: 'success',
        },
    ];

    const categories = [
        'Todas',
        'Panadería',
        'Pastelería',
        'Bebidas',
    ];

    const filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            category === 'Todas' ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });

    const totalProducts = products.length;

    const availableProducts = products.filter(
        (product) => product.stock > 0
    ).length;

    const lowStockProducts = products.filter(
        (product) => product.stock <= 25
    ).length;

    const outOfStockProducts = products.filter(
        (product) => product.stock === 0
    ).length;

    return (
        <div className="products">

            {/* HEADER */}
            <header className="products__header">

                <div className="products__title-row">

                    <div className="products__title-icon">
                        <IconPackage size={18} />
                    </div>

                    <div>
                        <h1 className="products__title">
                            Productos
                        </h1>

                        <p className="products__description">
                            Productos disponibles en{' '}
                            {profile?.store?.name || 'mi tienda'}
                        </p>
                    </div>

                </div>

                <button className="btn btn--primary">
                    <IconTransfer size={16} />
                    Transferir productos
                </button>

            </header>

            {/* STATS */}
            <section className="products__stats">

                <div className="card products__stat">
                    <div className="products__stat-icon">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span>Total productos</span>
                        <strong>{totalProducts}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--success">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span>Disponibles</span>
                        <strong>{availableProducts}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--warning">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span>Stock bajo</span>
                        <strong>{lowStockProducts}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--danger">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span>Sin stock</span>
                        <strong>{outOfStockProducts}</strong>
                    </div>
                </div>

            </section>

            {/* PRODUCTS PANEL */}
            <section className="card products__panel">

                {/* TOOLBAR */}
                <div className="products__toolbar">

                    <div className="products__search">
                        <IconSearch size={16} />

                        <input
                            type="search"
                            placeholder="Buscar producto o SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="products__filters">

                        <IconFilter
                            size={15}
                            className="text-gray"
                        />

                        {categories.map((item) => (
                            <button
                                key={item}
                                className={`btn btn--sm ${
                                    category === item
                                        ? 'btn--primary'
                                        : 'btn--ghost'
                                }`}
                                onClick={() => setCategory(item)}
                            >
                                {item}
                            </button>
                        ))}

                    </div>

                </div>

                {/* TABLE */}
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

                            {filteredProducts.map((product) => (

                                <tr key={product.id}>

                                    <td>
                                        <div className="products__product">

                                            <div className="products__product-icon">
                                                <IconPackage size={15} />
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
                                                {product.unit.toLowerCase()}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className={`badge badge--${product.badge}`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="products__actions">

                                            <button
                                                className="btn btn--ghost btn--icon btn--sm"
                                                title="Ver producto"
                                            >
                                                <IconEye size={15} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}
                <div className="products__pagination">

                    <span>
                        Mostrando {filteredProducts.length} de {totalProducts} productos
                    </span>

                    <div>
                        <button
                            className="btn btn--outline btn--sm"
                            disabled
                        >
                            Anterior
                        </button>

                        <button className="btn btn--primary btn--sm">
                            1
                        </button>

                        <button
                            className="btn btn--outline btn--sm"
                            disabled
                        >
                            Siguiente
                        </button>
                    </div>

                </div>

            </section>

        </div>
    );
}