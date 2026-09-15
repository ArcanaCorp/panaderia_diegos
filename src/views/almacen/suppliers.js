'use client'

import {
    IconTruckDelivery,
    IconPlus,
    IconSearch,
    IconPhone,
    IconMail,
    IconMapPin,
    IconDots,
    IconEdit,
    IconTrash,
    IconFileInvoice,
} from '@tabler/icons-react'


const suppliers = [
    {
        id: 'PROV-001',
        name: 'Distribuidora San Martín',
        ruc: '20601234567',
        contact: 'Carlos Mendoza',
        phone: '964 123 456',
        email: 'ventas@sanmartin.com',
        category: 'Harinas e insumos',
        purchases: 'S/ 8,450.00',
        orders: 18,
        status: 'Activo',
    },
    {
        id: 'PROV-002',
        name: 'Lácteos Andinos',
        ruc: '20456789123',
        contact: 'María Quispe',
        phone: '987 654 321',
        email: 'contacto@lacteosandinos.com',
        category: 'Lácteos',
        purchases: 'S/ 5,280.00',
        orders: 12,
        status: 'Activo',
    },
    {
        id: 'PROV-003',
        name: 'Comercial El Molino',
        ruc: '20567891234',
        contact: 'Jorge Huamán',
        phone: '975 321 654',
        email: 'ventas@elmolino.com',
        category: 'Harinas',
        purchases: 'S/ 3,920.00',
        orders: 9,
        status: 'Activo',
    },
    {
        id: 'PROV-004',
        name: 'Insumos La Central',
        ruc: '20123456789',
        contact: 'Ana Torres',
        phone: '966 789 123',
        email: 'info@lacentral.com',
        category: 'Insumos generales',
        purchases: 'S/ 2,150.00',
        orders: 6,
        status: 'Inactivo',
    },
    {
        id: 'PROV-005',
        name: 'Dulces del Valle',
        ruc: '20987654321',
        contact: 'Luis Paredes',
        phone: '982 456 789',
        email: 'ventas@dulcesvalle.com',
        category: 'Pastelería',
        purchases: 'S/ 1,870.00',
        orders: 5,
        status: 'Activo',
    },
]

export default function SuppliersAlmacen() {

    return (
        <main className="suppliers">

            {/* HEADER */}

            <header className="suppliers__header">

                <div className="suppliers__title-row">

                    <div className="suppliers__title-icon">
                        <IconTruckDelivery size={19} />
                    </div>

                    <div>

                        <p className="suppliers__eyebrow">
                            Almacén
                        </p>

                        <h1 className="suppliers__title">
                            Proveedores
                        </h1>

                        <p className="suppliers__description">
                            Gestiona los proveedores y abastecimiento del almacén.
                        </p>

                    </div>

                </div>

                <button className="btn btn--primary">
                    <IconPlus size={16} />
                    Nuevo proveedor
                </button>

            </header>

            {/* STATS */}

            <section className="suppliers__stats">

                <article className="card suppliers__stat">
                    <span className="suppliers__stat-label">
                        Total proveedores
                    </span>
                    <strong className="suppliers__stat-value">
                        24
                    </strong>
                </article>

                <article className="card suppliers__stat">
                    <span className="suppliers__stat-label">
                        Activos
                    </span>
                    <strong className="suppliers__stat-value suppliers__stat-value--success">
                        21
                    </strong>
                </article>

                <article className="card suppliers__stat">
                    <span className="suppliers__stat-label">
                        Compras este mes
                    </span>
                    <strong className="suppliers__stat-value">
                        S/ 21,670
                    </strong>
                </article>

                <article className="card suppliers__stat">
                    <span className="suppliers__stat-label">
                        Órdenes este mes
                    </span>
                    <strong className="suppliers__stat-value">
                        50
                    </strong>
                </article>

            </section>

            {/* CONTENT */}

            <section className="card suppliers__content">

                {/* TOOLBAR */}

                <div className="suppliers__toolbar">

                    <div className="suppliers__search">

                        <div className="input-group">

                            <IconSearch
                                size={16}
                                className="input-group__icon--left"
                            />

                            <input
                                type="text"
                                className="input"
                                placeholder="Buscar proveedor, RUC..."
                            />

                        </div>

                    </div>

                    <div className="suppliers__filters">

                        <button className="btn btn--outline btn--sm">
                            Todos
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            Activos
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            Inactivos
                        </button>

                    </div>

                </div>

                {/* TABLE */}

                <div className="suppliers__table-wrapper">

                    <table className="suppliers__table">

                        <thead>

                            <tr>
                                <th>Proveedor</th>
                                <th>Contacto</th>
                                <th>Categoría</th>
                                <th>Compras</th>
                                <th>Órdenes</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>

                        </thead>

                        <tbody>

                            {suppliers.map((supplier) => (

                                <tr key={supplier.id}>

                                    <td>

                                        <div className="suppliers__supplier">

                                            <div className="suppliers__supplier-icon">
                                                <IconTruckDelivery size={16} />
                                            </div>

                                            <div>

                                                <p className="suppliers__supplier-name">
                                                    {supplier.name}
                                                </p>

                                                <span className="suppliers__supplier-ruc">
                                                    RUC {supplier.ruc}
                                                </span>

                                            </div>

                                        </div>

                                    </td>

                                    <td>

                                        <div className="suppliers__contact">

                                            <span>
                                                <IconPhone size={13} />
                                                {supplier.phone}
                                            </span>

                                            <span>
                                                <IconMail size={13} />
                                                {supplier.email}
                                            </span>

                                        </div>

                                    </td>

                                    <td>
                                        <span className="suppliers__category">
                                            {supplier.category}
                                        </span>
                                    </td>

                                    <td>
                                        <strong className="suppliers__purchases">
                                            {supplier.purchases}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="suppliers__orders">
                                            {supplier.orders}
                                        </span>
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                supplier.status === 'Activo'
                                                    ? 'badge--success'
                                                    : 'badge--neutral'
                                            }`}
                                        >
                                            {supplier.status}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="suppliers__actions">

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Ver compras"
                                            >
                                                <IconFileInvoice size={15} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Editar"
                                            >
                                                <IconEdit size={15} />
                                            </button>

                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Más opciones"
                                            >
                                                <IconDots size={15} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* FOOTER */}

                <footer className="suppliers__footer">

                    <span>
                        Mostrando {suppliers.length} de 24 proveedores
                    </span>

                    <div className="suppliers__pagination">

                        <button className="btn btn--primary btn--sm">
                            1
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            2
                        </button>

                        <button className="btn btn--ghost btn--sm">
                            3
                        </button>

                    </div>

                </footer>

            </section>

        </main>
    )
}