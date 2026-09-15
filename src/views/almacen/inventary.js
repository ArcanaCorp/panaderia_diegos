'use client'

import {
    IconPackages,
    IconAlertTriangle,
    IconCircleCheck,
    IconAlertCircle,
    IconSearch,
    IconFilter,
    IconArrowDown,
    IconArrowUp,
    IconArrowsExchange,
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'

export default function InventaryAlmacen() {

    const { profile } = useAuth()

    const storeName = profile?.store?.name || 'Almacén Central'

    const stats = [
        {
            label: 'Total productos',
            value: '248',
            icon: IconPackages,
            modifier: '',
        },
        {
            label: 'Disponibles',
            value: '218',
            icon: IconCircleCheck,
            modifier: '',
        },
        {
            label: 'Stock bajo',
            value: '24',
            icon: IconAlertTriangle,
            modifier: 'warning',
        },
        {
            label: 'Sin stock',
            value: '6',
            icon: IconAlertCircle,
            modifier: 'danger',
        },
    ]

    const products = [
        {
            id: 'HAR-001',
            name: 'Harina de trigo',
            unit: 'kg',
            category: 'Insumos',
            stock: 80,
            minimum: 20,
            status: 'Disponible',
        },
        {
            id: 'AZU-001',
            name: 'Azúcar',
            unit: 'kg',
            category: 'Insumos',
            stock: 12,
            minimum: 15,
            status: 'Bajo',
        },
        {
            id: 'MAN-001',
            name: 'Mantequilla',
            unit: 'kg',
            category: 'Insumos',
            stock: 4,
            minimum: 10,
            status: 'Bajo',
        },
        {
            id: 'LEV-001',
            name: 'Levadura',
            unit: 'kg',
            category: 'Insumos',
            stock: 0,
            minimum: 5,
            status: 'Sin stock',
        },
        {
            id: 'PAN-001',
            name: 'Pan francés',
            unit: 'unidad',
            category: 'Panadería',
            stock: 120,
            minimum: 50,
            status: 'Disponible',
        },
        {
            id: 'PAN-002',
            name: 'Pan integral',
            unit: 'unidad',
            category: 'Panadería',
            stock: 80,
            minimum: 30,
            status: 'Disponible',
        },
        {
            id: 'CRO-001',
            name: 'Croissant',
            unit: 'unidad',
            category: 'Pastelería',
            stock: 24,
            minimum: 10,
            status: 'Disponible',
        },
        {
            id: 'TOR-001',
            name: 'Torta personal',
            unit: 'unidad',
            category: 'Pastelería',
            stock: 5,
            minimum: 10,
            status: 'Bajo',
        },
    ]

    return (
        <main className="inventory">

            {/* HEADER */}

            <header className="inventory__header">

                <div>

                    <p className="inventory__eyebrow">
                        Almacén · {storeName}
                    </p>

                    <h1 className="inventory__title">
                        Inventario
                    </h1>

                    <p className="inventory__description">
                        Controla las existencias y movimientos de tu almacén.
                    </p>

                </div>

                <div className="inventory__actions">

                    <button className="btn btn--outline">
                        <IconArrowUp size={16} />
                        Registrar salida
                    </button>

                    <button className="btn btn--primary">
                        <IconArrowDown size={16} />
                        Registrar ingreso
                    </button>

                </div>

            </header>

            {/* STATS */}

            <section className="inventory__stats">

                {stats.map((stat) => {

                    const Icon = stat.icon

                    return (
                        <article
                            className="card inventory__stat"
                            key={stat.label}
                        >

                            <div
                                className={`inventory__stat-icon ${
                                    stat.modifier
                                        ? `inventory__stat-icon--${stat.modifier}`
                                        : ''
                                }`}
                            >
                                <Icon size={17} />
                            </div>

                            <div>

                                <p className="inventory__stat-label">
                                    {stat.label}
                                </p>

                                <strong className="inventory__stat-value">
                                    {stat.value}
                                </strong>

                            </div>

                        </article>
                    )
                })}

            </section>

            {/* INVENTORY */}

            <section className="card inventory__content">

                {/* TOOLBAR */}

                <div className="inventory__toolbar">

                    <div className="inventory__search">

                        <div className="input-group">

                            <IconSearch
                                size={16}
                                className="input-group__icon--left"
                            />

                            <input
                                type="text"
                                className="input"
                                placeholder="Buscar producto, SKU..."
                            />

                        </div>

                    </div>

                    <div className="inventory__filters">

                        <button className="btn btn--outline btn--sm">
                            Todas las categorías
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            Estado
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            <IconFilter size={15} />
                            Filtros
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
                                <th>Acciones</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.map((product) => (

                                <tr key={product.id}>

                                    <td>

                                        <div className="inventory__product">

                                            <div className="inventory__product-icon">
                                                <IconPackages size={16} />
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
                                            {product.id}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="inventory__category">
                                            {product.category}
                                        </span>
                                    </td>

                                    <td>
                                        <strong className="inventory__stock">
                                            {product.stock} {product.unit}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="inventory__minimum">
                                            {product.minimum} {product.unit}
                                        </span>
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                product.status === 'Disponible'
                                                    ? 'badge--success'
                                                    : product.status === 'Bajo'
                                                        ? 'badge--warning'
                                                        : 'badge--danger'
                                            }`}
                                        >
                                            {product.status}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="inventory__actions">

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Registrar ingreso"
                                            >
                                                <IconArrowDown size={15} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Registrar salida"
                                            >
                                                <IconArrowUp size={15} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Transferir"
                                            >
                                                <IconArrowsExchange size={15} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* FOOTER */}

                <footer className="inventory__footer">

                    <span>
                        Mostrando {products.length} de 248 productos
                    </span>

                    <div className="inventory__pagination">

                        <button
                            className="btn btn--icon btn--ghost btn--sm"
                            disabled
                        >
                            <IconChevronLeft size={16} />
                        </button>

                        <button className="btn btn--primary btn--sm">
                            1
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            2
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            3
                        </button>

                        <button className="btn btn--icon btn--ghost btn--sm">
                            <IconChevronRight size={16} />
                        </button>

                    </div>

                </footer>

            </section>

        </main>
    )
}