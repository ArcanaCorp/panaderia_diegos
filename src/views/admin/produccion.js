'use client';

import {
    IconPlus,
    IconSearch,
    IconFilter,
    IconDotsVertical,
    IconClock,
    IconChefHat,
    IconCheck,
    IconPlayerPause,
    IconAlertTriangle,
    IconPackage,
} from '@tabler/icons-react';

export default function ProduccionAdmin() {

    const orders = [
        {
            id: 'PRD-00024',
            product: 'Pan francés',
            quantity: 120,
            unit: 'unidades',
            priority: 'Normal',
            status: 'Pendiente',
            requestedBy: 'Ventas',
            date: 'Hoy, 09:30',
        },
        {
            id: 'PRD-00023',
            product: 'Croissant',
            quantity: 40,
            unit: 'unidades',
            priority: 'Alta',
            status: 'En producción',
            requestedBy: 'Ventas',
            date: 'Hoy, 08:45',
        },
        {
            id: 'PRD-00022',
            product: 'Pan integral',
            quantity: 60,
            unit: 'unidades',
            priority: 'Normal',
            status: 'Pendiente',
            requestedBy: 'Administrador',
            date: 'Hoy, 08:20',
        },
        {
            id: 'PRD-00021',
            product: 'Empanada de carne',
            quantity: 30,
            unit: 'unidades',
            priority: 'Urgente',
            status: 'En producción',
            requestedBy: 'Ventas',
            date: 'Hoy, 07:50',
        },
        {
            id: 'PRD-00020',
            product: 'Torta personal',
            quantity: 15,
            unit: 'unidades',
            priority: 'Normal',
            status: 'Completado',
            requestedBy: 'Ventas',
            date: 'Ayer, 17:30',
        },
    ];

    return (
        <main className="production">

            {/* HEADER */}

            <header className="production__header">

                <div>
                    <p className="production__eyebrow">
                        Operaciones
                    </p>

                    <h1 className="production__title">
                        Producción
                    </h1>

                    <p className="production__description">
                        Gestiona los pedidos y productos que deben fabricarse.
                    </p>
                </div>

                <div className="production__actions">

                    <button className="btn btn--outline">
                        <IconFilter size={16} />
                        Filtrar
                    </button>

                    <button className="btn btn--primary">
                        <IconPlus size={16} />
                        Nueva orden
                    </button>

                </div>

            </header>


            {/* SUMMARY */}

            <section className="production__stats">

                <div className="card production__stat">

                    <div className="production__stat-icon production__stat-icon--warning">
                        <IconClock size={17} />
                    </div>

                    <div>
                        <p className="production__stat-label">
                            Pendientes
                        </p>

                        <strong className="production__stat-value">
                            8
                        </strong>
                    </div>

                </div>


                <div className="card production__stat">

                    <div className="production__stat-icon">
                        <IconChefHat size={17} />
                    </div>

                    <div>
                        <p className="production__stat-label">
                            En producción
                        </p>

                        <strong className="production__stat-value">
                            4
                        </strong>
                    </div>

                </div>


                <div className="card production__stat">

                    <div className="production__stat-icon production__stat-icon--success">
                        <IconCheck size={17} />
                    </div>

                    <div>
                        <p className="production__stat-label">
                            Completadas hoy
                        </p>

                        <strong className="production__stat-value">
                            16
                        </strong>
                    </div>

                </div>


                <div className="card production__stat">

                    <div className="production__stat-icon production__stat-icon--danger">
                        <IconAlertTriangle size={17} />
                    </div>

                    <div>
                        <p className="production__stat-label">
                            Urgentes
                        </p>

                        <strong className="production__stat-value">
                            2
                        </strong>
                    </div>

                </div>

            </section>


            {/* ORDERS */}

            <section className="card production__content">

                {/* TOOLBAR */}

                <div className="production__toolbar">

                    <div className="production__search">

                        <div className="input-group input-group--left">

                            <span className="input-group__icon--left">
                                <IconSearch size={17} />
                            </span>

                            <input
                                className="input"
                                placeholder="Buscar orden o producto..."
                            />

                        </div>

                    </div>


                    <div className="production__filters">

                        <button className="btn btn--outline btn--sm">
                            Todas
                        </button>

                        <button className="btn btn--outline btn--sm">
                            Pendientes
                        </button>

                        <button className="btn btn--outline btn--sm">
                            En producción
                        </button>

                        <button className="btn btn--outline btn--sm">
                            Completadas
                        </button>

                    </div>

                </div>


                {/* TABLE */}

                <div className="production__table-wrapper">

                    <table className="production__table">

                        <thead>

                            <tr>
                                <th>Orden</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Prioridad</th>
                                <th>Solicitado por</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>

                        </thead>


                        <tbody>

                            {orders.map((order) => (

                                <tr key={order.id}>

                                    <td>
                                        <span className="production__order-id">
                                            {order.id}
                                        </span>
                                    </td>


                                    <td>

                                        <div className="production__product">

                                            <div className="production__product-icon">
                                                <IconPackage size={16} />
                                            </div>

                                            <div>
                                                <p className="production__product-name">
                                                    {order.product}
                                                </p>
                                            </div>

                                        </div>

                                    </td>


                                    <td>

                                        <strong className="production__quantity">
                                            {order.quantity}
                                        </strong>

                                        <span className="production__unit">
                                            {order.unit}
                                        </span>

                                    </td>


                                    <td>

                                        <span
                                            className={`badge ${
                                                order.priority === 'Urgente'
                                                    ? 'badge--danger'
                                                    : order.priority === 'Alta'
                                                        ? 'badge--warning'
                                                        : 'badge--neutral'
                                            }`}
                                        >
                                            {order.priority}
                                        </span>

                                    </td>


                                    <td>
                                        <span className="production__requested">
                                            {order.requestedBy}
                                        </span>
                                    </td>


                                    <td>
                                        <span className="production__date">
                                            {order.date}
                                        </span>
                                    </td>


                                    <td>

                                        <span
                                            className={`badge ${
                                                order.status === 'Completado'
                                                    ? 'badge--success'
                                                    : order.status === 'En producción'
                                                        ? 'badge--info'
                                                        : 'badge--warning'
                                            }`}
                                        >
                                            {order.status}
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

                <div className="production__footer">

                    <span>
                        Mostrando 5 órdenes
                    </span>

                    <div className="production__pagination">

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
                            Siguiente
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}