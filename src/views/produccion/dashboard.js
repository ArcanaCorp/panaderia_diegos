'use client'

import {
    IconClipboardList,
    IconClock,
    IconLoader,
    IconCircleCheck,
    IconAlertTriangle,
    IconPlayerPlay,
    IconPackage,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'

export default function DashboardProduccion() {

    const { profile } = useAuth()

    const storeName = profile?.store?.name || 'mi tienda'
    const userName = profile?.full_name?.split(' ')[0] || 'Usuario'

    const stats = [
        {
            label: 'Pendientes',
            value: '12',
            icon: IconClock,
            modifier: 'warning',
        },
        {
            label: 'En producción',
            value: '8',
            icon: IconLoader,
            modifier: 'info',
        },
        {
            label: 'Completadas hoy',
            value: '34',
            icon: IconCircleCheck,
            modifier: 'success',
        },
        {
            label: 'Urgentes',
            value: '3',
            icon: IconAlertTriangle,
            modifier: 'danger',
        },
    ]

    const productionOrders = [
        {
            id: 'PRD-00042',
            product: 'Pan francés',
            quantity: 100,
            priority: 'Alta',
            status: 'En producción',
        },
        {
            id: 'PRD-00041',
            product: 'Pan integral',
            quantity: 60,
            priority: 'Normal',
            status: 'Pendiente',
        },
        {
            id: 'PRD-00040',
            product: 'Croissant',
            quantity: 30,
            priority: 'Alta',
            status: 'En producción',
        },
        {
            id: 'PRD-00039',
            product: 'Empanada de carne',
            quantity: 40,
            priority: 'Normal',
            status: 'Completado',
        },
        {
            id: 'PRD-00038',
            product: 'Torta personal',
            quantity: 15,
            priority: 'Urgente',
            status: 'Pendiente',
        },
    ]

    const stockProducts = [
        {
            name: 'Pan francés',
            category: 'Panadería',
            quantity: '25 unidades',
            status: 'Bajo',
        },
        {
            name: 'Pan integral',
            category: 'Panadería',
            quantity: '12 unidades',
            status: 'Bajo',
        },
        {
            name: 'Croissant',
            category: 'Pastelería',
            quantity: '8 unidades',
            status: 'Crítico',
        },
        {
            name: 'Empanada de carne',
            category: 'Panadería',
            quantity: '42 unidades',
            status: 'Disponible',
        },
    ]

    return (
        <main className="dashboard">

            <header className="dashboard__header">
                <div>
                    <p className="dashboard__eyebrow">
                        Producción · {storeName}
                    </p>

                    <h1 className="dashboard__title">
                        Hola, {userName}
                    </h1>

                    <p className="dashboard__description">
                        Supervisa las órdenes y el avance de producción de tu tienda.
                    </p>
                </div>

                <div className="dashboard__actions">
                    <button className="btn btn--primary">
                        <IconPlayerPlay size={16} />
                        Nueva producción
                    </button>
                </div>
            </header>

            <section className="dashboard__stats">

                {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <article className="card card--stat" key={stat.label}>
                            <div className="card__content">

                                <div className="card__icon">
                                    <Icon size={18} />
                                </div>

                                <div>
                                    <p className="card__label">
                                        {stat.label}
                                    </p>

                                    <strong className="card__value">
                                        {stat.value}
                                    </strong>
                                </div>

                            </div>
                        </article>
                    )
                })}

            </section>

            <section className="dashboard__grid">

                <article className="card dashboard__activity">

                    <div className="card__header">
                        <div>
                            <h2 className="card__title">
                                Órdenes de producción
                            </h2>

                            <p className="card__description">
                                Producción pendiente y en proceso
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--sm">
                            Ver todas
                        </button>
                    </div>

                    <div className="dashboard__activity-list">

                        {productionOrders.map((order) => (
                            <div
                                className="dashboard__activity-item"
                                key={order.id}
                            >

                                <div className="dashboard__activity-icon dashboard__activity-icon--neutral">
                                    <IconClipboardList size={17} />
                                </div>

                                <div className="dashboard__activity-content">

                                    <p className="dashboard__activity-title">
                                        {order.product}
                                    </p>

                                    <p className="dashboard__activity-description">
                                        {order.id} · {order.quantity} unidades
                                    </p>

                                </div>

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

                            </div>
                        ))}

                    </div>

                </article>

                <article className="card dashboard__stock">

                    <div className="card__header">
                        <div>
                            <h2 className="card__title">
                                Productos a producir
                            </h2>

                            <p className="card__description">
                                Stock que requiere reposición
                            </p>
                        </div>
                    </div>

                    <div className="dashboard__stock-list">

                        {stockProducts.map((product) => (
                            <div
                                className="dashboard__stock-item"
                                key={product.name}
                            >

                                <div className="dashboard__stock-info">

                                    <div className="dashboard__activity-icon dashboard__activity-icon--neutral">
                                        <IconPackage size={16} />
                                    </div>

                                    <div>
                                        <p className="dashboard__stock-name">
                                            {product.name}
                                        </p>

                                        <p className="dashboard__stock-category">
                                            {product.category}
                                        </p>
                                    </div>

                                </div>

                                <div className="dashboard__stock-quantity">
                                    <strong>
                                        {product.quantity}
                                    </strong>

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
                                </div>

                            </div>
                        ))}

                    </div>

                </article>

            </section>

            <section className="card">

                <div className="card__header">
                    <div>
                        <h2 className="card__title">
                            Resumen de producción
                        </h2>

                        <p className="card__description">
                            Actividad de producción de {storeName}
                        </p>
                    </div>
                </div>

                <div className="dashboard__chart">
                    <div className="dashboard__chart-placeholder">
                        <IconClipboardList size={28} />

                        <p>
                            Aquí se mostrará el gráfico de producción
                        </p>

                        <span>
                            Producción completada por día
                        </span>
                    </div>
                </div>

            </section>

        </main>
    )
}