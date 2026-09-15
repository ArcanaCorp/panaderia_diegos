'use client'

import { IconPackages, IconAlertTriangle, IconCircleCheck, IconAlertCircle, IconSearch, IconFilter, IconChevronLeft, IconChevronRight, IconPlus } from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'

export default function InventoryProduccion() {

    const { profile } = useAuth()

    const storeName = profile?.store?.name || 'Mi tienda'

    const stats = [
        {
            label: 'Total de insumos',
            value: '28',
            icon: IconPackages,
            modifier: '',
        },
        {
            label: 'Disponibles',
            value: '21',
            icon: IconCircleCheck,
            modifier: '',
        },
        {
            label: 'Stock bajo',
            value: '5',
            icon: IconAlertTriangle,
            modifier: 'warning',
        },
        {
            label: 'Insuficientes',
            value: '2',
            icon: IconAlertCircle,
            modifier: 'danger',
        },
    ]

    const supplies = [
        {
            id: 'INS-001',
            name: 'Harina de trigo',
            unit: 'kg',
            category: 'Harinas',
            stock: 80,
            reserved: 25,
            available: 55,
            minimum: 20,
            status: 'Disponible',
        },
        {
            id: 'INS-002',
            name: 'Azúcar',
            unit: 'kg',
            category: 'Insumos',
            stock: 12,
            reserved: 2,
            available: 10,
            minimum: 5,
            status: 'Disponible',
        },
        {
            id: 'INS-003',
            name: 'Levadura',
            unit: 'kg',
            category: 'Insumos',
            stock: 0.3,
            reserved: 0.2,
            available: 0.1,
            minimum: 0.5,
            status: 'Bajo',
        },
        {
            id: 'INS-004',
            name: 'Mantequilla',
            unit: 'kg',
            category: 'Lácteos',
            stock: 4,
            reserved: 2,
            available: 2,
            minimum: 5,
            status: 'Bajo',
        },
        {
            id: 'INS-005',
            name: 'Sal',
            unit: 'kg',
            category: 'Insumos',
            stock: 8,
            reserved: 0.4,
            available: 7.6,
            minimum: 2,
            status: 'Disponible',
        },
        {
            id: 'INS-006',
            name: 'Huevos',
            unit: 'unidad',
            category: 'Insumos',
            stock: 120,
            reserved: 60,
            available: 60,
            minimum: 50,
            status: 'Disponible',
        },
        {
            id: 'INS-007',
            name: 'Chocolate cobertura',
            unit: 'kg',
            category: 'Pastelería',
            stock: 0,
            reserved: 0,
            available: 0,
            minimum: 3,
            status: 'Insuficiente',
        },
    ]

    return (
        <main className="inventory">

            {/* HEADER */}

            <header className="inventory__header">

                <div>
                    <p className="inventory__eyebrow">
                        Producción · {storeName}
                    </p>

                    <h1 className="inventory__title">
                        Insumos
                    </h1>

                    <p className="inventory__description">
                        Consulta los insumos disponibles para producción.
                    </p>
                </div>

                <div className="inventory__actions">

                    <button className="btn btn--outline">
                        <IconFilter size={16} />
                        Filtrar
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

            {/* CONTENT */}

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
                                placeholder="Buscar insumo, SKU..."
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

                    </div>

                </div>

                {/* TABLE */}

                <div className="inventory__table-wrapper">

                    <table className="inventory__table">

                        <thead>
                            <tr>
                                <th>Insumo</th>
                                <th>SKU</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>Reservado</th>
                                <th>Disponible</th>
                                <th>Mínimo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>

                            {supplies.map((supply) => (

                                <tr key={supply.id}>

                                    <td>

                                        <div className="inventory__product">

                                            <div className="inventory__product-icon">
                                                <IconPackages size={16} />
                                            </div>

                                            <div>
                                                <p className="inventory__product-name">
                                                    {supply.name}
                                                </p>

                                                <span className="inventory__product-unit">
                                                    {supply.unit}
                                                </span>
                                            </div>

                                        </div>

                                    </td>

                                    <td>
                                        <span className="inventory__sku">
                                            {supply.id}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="inventory__category">
                                            {supply.category}
                                        </span>
                                    </td>

                                    <td>
                                        <strong className="inventory__stock">
                                            {supply.stock} {supply.unit}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="inventory__minimum">
                                            {supply.reserved} {supply.unit}
                                        </span>
                                    </td>

                                    <td>
                                        <strong className="inventory__stock">
                                            {supply.available} {supply.unit}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="inventory__minimum">
                                            {supply.minimum} {supply.unit}
                                        </span>
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                supply.status === 'Disponible'
                                                    ? 'badge--success'
                                                    : supply.status === 'Bajo'
                                                        ? 'badge--warning'
                                                        : 'badge--danger'
                                            }`}
                                        >
                                            {supply.status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* FOOTER */}

                <footer className="inventory__footer">

                    <span>
                        Mostrando {supplies.length} de 28 insumos
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