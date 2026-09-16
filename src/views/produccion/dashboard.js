'use client'

import {
    IconClipboardList,
    IconClock,
    IconLoader,
    IconCircleCheck,
    IconAlertTriangle,
    IconPackage,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'
import { useProductionDashboard } from '@/hooks/useProductionDashboard'

export default function DashboardProduccion() {

    const { profile } = useAuth()

    const {
        stats,
        productionOrders,
        loading,
        error,
        reload,
    } = useProductionDashboard()

    const userName =
        profile?.full_name?.split(' ')[0] || 'Usuario'

    const statCards = [
        {
            label: 'Pendientes',
            value: stats.pending,
            icon: IconClock,
            modifier: 'warning',
        },
        {
            label: 'En producción',
            value: stats.in_production,
            icon: IconLoader,
            modifier: 'info',
        },
        {
            label: 'Completadas hoy',
            value: stats.completed_today,
            icon: IconCircleCheck,
            modifier: 'success',
        },
        {
            label: 'Urgentes',
            value: stats.urgent,
            icon: IconAlertTriangle,
            modifier: 'danger',
        },
    ]

    function getPriorityClass(priority) {
        if (priority === 'urgente') return 'badge--danger'
        if (priority === 'alta') return 'badge--warning'

        return 'badge--neutral'
    }

    function getPriorityLabel(priority) {
        if (priority === 'urgente') return 'Urgente'
        if (priority === 'alta') return 'Alta'

        return 'Normal'
    }

    function getStatusClass(status) {
        if (status === 'completado') return 'badge--success'
        if (status === 'en_produccion') return 'badge--info'

        return 'badge--warning'
    }

    function getStatusLabel(status) {
        if (status === 'completado') return 'Completado'
        if (status === 'en_produccion') return 'En producción'

        return 'Pendiente'
    }

    function getProductsSummary(order) {

        if (!order.items?.length) {
            return 'Sin productos registrados'
        }

        if (order.items.length === 1) {
            const item = order.items[0]

            return `${item.product_name} · ${item.quantity} ${item.unit || 'unidades'}`
        }

        const totalQuantity = order.items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        )

        return `${order.items.length} productos · ${totalQuantity} unidades`
    }

    if (loading) {
        return (
            <main className="dashboard">
                <div className="card">
                    <div className="card__content">
                        <p className="card__description">
                            Cargando producción...
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="dashboard">
                <div className="card">
                    <div className="card__content">
                        <p className="card__description">
                            {error}
                        </p>

                        <button
                            className="btn btn--primary"
                            onClick={reload}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="dashboard">

            {/* HEADER */}

            <header className="dashboard__header">

                <div>

                    <p className="dashboard__eyebrow">
                        Área de producción
                    </p>

                    <h1 className="dashboard__title">
                        Hola, {userName}
                    </h1>

                    <p className="dashboard__description">
                        Supervisa las órdenes y el avance de producción.
                    </p>

                </div>

            </header>


            {/* STATS */}

            <section className="dashboard__stats">

                {statCards.map((stat) => {

                    const Icon = stat.icon

                    return (
                        <article
                            className="card card--stat"
                            key={stat.label}
                        >

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


            {/* MAIN GRID */}

            <section className="dashboard__grid">

                {/* ÓRDENES */}

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

                        <button
                            className="btn btn--ghost btn--sm"
                            onClick={reload}
                        >
                            Actualizar
                        </button>

                    </div>


                    <div className="dashboard__activity-list">

                        {productionOrders.length === 0 ? (

                            <div className="dashboard__empty">

                                <IconClipboardList size={28} />

                                <p>
                                    No hay órdenes de producción.
                                </p>

                            </div>

                        ) : (

                            productionOrders.map((order) => (

                                <div
                                    className="dashboard__activity-item"
                                    key={order.id}
                                >

                                    <div className="dashboard__activity-icon dashboard__activity-icon--neutral">
                                        <IconClipboardList size={17} />
                                    </div>


                                    <div className="dashboard__activity-content">

                                        <p className="dashboard__activity-title">
                                            {getProductsSummary(order)}
                                        </p>

                                        <p className="dashboard__activity-description">
                                            {order.code}
                                            {order.store_name
                                                ? ` · ${order.store_name}`
                                                : ''}
                                        </p>

                                    </div>


                                    <span
                                        className={`badge ${getPriorityClass(
                                            order.priority
                                        )}`}
                                    >
                                        {getPriorityLabel(order.priority)}
                                    </span>


                                    <span
                                        className={`badge ${getStatusClass(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusLabel(order.status)}
                                    </span>

                                </div>

                            ))

                        )}

                    </div>

                </article>


                {/* TRABAJO PENDIENTE */}

                <article className="card dashboard__stock">

                    <div className="card__header">

                        <div>

                            <h2 className="card__title">
                                Trabajo pendiente
                            </h2>

                            <p className="card__description">
                                Órdenes que requieren atención
                            </p>

                        </div>

                    </div>


                    <div className="dashboard__stock-list">

                        {productionOrders
                            .filter(
                                (order) =>
                                    order.status === 'pendiente' ||
                                    order.status === 'en_produccion'
                            )
                            .slice(0, 5)
                            .map((order) => (

                                <div
                                    className="dashboard__stock-item"
                                    key={order.id}
                                >

                                    <div className="dashboard__stock-info">

                                        <div className="dashboard__activity-icon dashboard__activity-icon--neutral">
                                            <IconPackage size={16} />
                                        </div>

                                        <div>

                                            <p className="dashboard__stock-name">
                                                {order.code}
                                            </p>

                                            <p className="dashboard__stock-category">
                                                {order.store_name ||
                                                    'Sin tienda'}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="dashboard__stock-quantity">

                                        <strong>
                                            {order.items?.reduce(
                                                (total, item) =>
                                                    total +
                                                    Number(
                                                        item.quantity || 0
                                                    ),
                                                0
                                            ) || 0}
                                        </strong>

                                        <span
                                            className={`badge ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>

                                    </div>

                                </div>

                            ))}

                    </div>

                </article>

            </section>


            {/* RESUMEN */}

            <section className="card">

                <div className="card__header">

                    <div>

                        <h2 className="card__title">
                            Resumen de producción
                        </h2>

                        <p className="card__description">
                            Actividad reciente del área de producción
                        </p>

                    </div>

                </div>


                <div className="dashboard__chart">

                    <div className="dashboard__chart-placeholder">

                        <IconClipboardList size={28} />

                        <p>
                            Producción completada por día
                        </p>

                        <span>
                            Aquí se mostrará el gráfico de producción
                        </span>

                    </div>

                </div>

            </section>

        </main>
    )
}