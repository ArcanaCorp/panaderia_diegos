'use client'

import {
    IconClock,
    IconPlayerPlay,
    IconCheck,
    IconDots,
    IconChevronLeft,
    IconAlertTriangle,
    IconPackage,
} from '@tabler/icons-react'

import { useProductionDashboard } from '@/hooks/useProductionDashboard'

export default function ProduccionView() {

    const { productionOrders, stats, loading, updating, error, reload, changeOrderStatus } = useProductionDashboard()

    const columns = [
        {
            id: 'pendiente',
            title: 'Pendientes',
            icon: IconClock,
        },
        {
            id: 'en_produccion',
            title: 'En producción',
            icon: IconPlayerPlay,
        },
        {
            id: 'completado',
            title: 'Completado',
            icon: IconCheck,
        },
    ]

    function getPriorityClass(priority) {
        if (priority === 'urgente') return 'production-card__priority--urgente'
        if (priority === 'alta') return 'production-card__priority--alta'

        return 'production-card__priority--normal'
    }

    function getPriorityLabel(priority) {
        if (priority === 'urgente') return 'Urgente'
        if (priority === 'alta') return 'Alta'

        return 'Normal'
    }

    function getProducts(order) {
        if (!order.items?.length) {
            return 'Sin productos'
        }

        if (order.items.length === 1) {
            return order.items[0].product_name
        }

        return `${order.items.length} productos`
    }

    function getQuantity(order) {
        return order.items?.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        ) || 0
    }

    function getTime(date) {

        if (!date) return ''

        const created = new Date(date)
        const now = new Date()

        const diff = Math.floor(
            (now - created) / 60000
        )

        if (diff < 1) return 'Ahora'

        if (diff < 60) {
            return `Hace ${diff} min`
        }

        const hours = Math.floor(diff / 60)

        if (hours < 24) {
            return `Hace ${hours} h`
        }

        const days = Math.floor(hours / 24)

        return `Hace ${days} d`
    }

    async function handleMove(order, nextStatus) {
        try {
            await changeOrderStatus(order.id, nextStatus)
        } catch (error) {
            console.error('handleMove:', error)
        }
    }

    if (loading) {
        return (
            <main className="production">

                <div className="card">

                    <div className="card__content">

                        <p className="card__description">
                            Cargando órdenes de producción...
                        </p>

                    </div>

                </div>

            </main>
        )
    }

    if (error) {
        return (
            <main className="production">

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
        <main className="production">

            {/* HEADER */}

            <header className="production__header">

                <div className="production__title-row">

                    <div className="production__title-icon">
                        <IconPackage size={19} />
                    </div>

                    <div>

                        <p className="production__eyebrow">
                            Área de producción
                        </p>

                        <h1 className="production__title">
                            Órdenes de producción
                        </h1>

                        <p className="production__description">
                            Gestiona y controla el avance de producción.
                        </p>

                    </div>

                </div>

                <button
                    className="btn btn--ghost btn--sm"
                    onClick={reload}
                >
                    Actualizar
                </button>

            </header>


            {/* RESUMEN */}

            <div className="production__summary">

                <div className="production__summary-item">

                    <span>
                        Pendientes
                    </span>

                    <strong>
                        {stats.pending}
                    </strong>

                </div>


                <div className="production__summary-item">

                    <span>
                        En producción
                    </span>

                    <strong>
                        {stats.in_production}
                    </strong>

                </div>


                <div className="production__summary-item">

                    <span>
                        Completadas hoy
                    </span>

                    <strong>
                        {stats.completed_today}
                    </strong>

                </div>


                <div className="production__summary-item production__summary-item--danger">

                    <span>
                        Urgentes
                    </span>

                    <strong>
                        {stats.urgent}
                    </strong>

                </div>

            </div>


            {/* KANBAN */}

            <section className="production__board">

                {columns.map((column) => {

                    const ColumnIcon = column.icon

                    const columnOrders =
                        productionOrders.filter(
                            (order) =>
                                order.status === column.id
                        )

                    return (

                        <div
                            className="production__column"
                            key={column.id}
                        >

                            {/* COLUMN HEADER */}

                            <div className="production__column-header">

                                <div className="production__column-title">

                                    <ColumnIcon size={17} />

                                    <h2>
                                        {column.title}
                                    </h2>

                                    <span>
                                        {columnOrders.length}
                                    </span>

                                </div>

                                <button
                                    className="btn btn--icon btn--ghost btn--xs"
                                    aria-label="Más opciones"
                                >
                                    <IconDots size={17} />
                                </button>

                            </div>


                            {/* CARDS */}

                            <div className="production__cards">

                                {columnOrders.length === 0 ? (

                                    <div className="production__empty">

                                        <IconCheck size={22} />

                                        <span>
                                            No hay órdenes
                                        </span>

                                    </div>

                                ) : (

                                    columnOrders.map((order) => (

                                        <article
                                            className="production-card"
                                            key={order.id}
                                        >

                                            {/* TOP */}

                                            <div className="production-card__top">

                                                <span className="production-card__id">
                                                    {order.code}
                                                </span>

                                                <span
                                                    className={`production-card__priority ${getPriorityClass(
                                                        order.priority
                                                    )}`}
                                                >

                                                    {order.priority === 'urgente' && (
                                                        <IconAlertTriangle
                                                            size={13}
                                                        />
                                                    )}

                                                    {getPriorityLabel(
                                                        order.priority
                                                    )}

                                                </span>

                                            </div>


                                            {/* PRODUCT */}

                                            <h3 className="production-card__title">
                                                {getProducts(order)}
                                            </h3>


                                            {/* QUANTITY */}

                                            <div className="production-card__quantity">

                                                <IconPackage size={15} />

                                                <strong>
                                                    {getQuantity(order)}
                                                </strong>

                                                <span>
                                                    unidades
                                                </span>

                                            </div>


                                            {/* META */}

                                            <div className="production-card__meta">

                                                <span>
                                                    {order.store_name
                                                        ? `Destino: ${order.store_name}`
                                                        : 'Sin tienda de destino'}
                                                </span>

                                                <span>
                                                    {getTime(order.created_at)}
                                                </span>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="production-card__actions">

                                                {/* VOLVER A PENDIENTE */}

                                                {column.id === 'en_produccion' && (

                                                    <button
                                                        className="btn btn--icon btn--ghost btn--sm"
                                                        title="Volver a pendiente"
                                                        disabled={updating}
                                                        onClick={() => handleMove(order, 'pendiente')}
                                                    >
                                                        <IconChevronLeft
                                                            size={16}
                                                        />
                                                    </button>

                                                )}


                                                {/* INICIAR */}

                                                {column.id === 'pendiente' && (

                                                    <button
                                                        className="btn btn--primary btn--sm"
                                                        disabled={updating}
                                                        onClick={() =>
                                                            handleMove(
                                                                order,
                                                                'en_produccion'
                                                            )
                                                        }
                                                    >
                                                        <IconPlayerPlay
                                                            size={15}
                                                        />

                                                        Iniciar
                                                    </button>

                                                )}


                                                {/* COMPLETAR */}

                                                {column.id === 'en_produccion' && (

                                                    <button
                                                        className="btn btn--primary btn--sm"
                                                        disabled={updating}
                                                        onClick={() =>
                                                            handleMove(
                                                                order,
                                                                'completado'
                                                            )
                                                        }
                                                    >
                                                        <IconCheck
                                                            size={15}
                                                        />

                                                        Completar
                                                    </button>

                                                )}

                                            </div>

                                        </article>

                                    ))

                                )}

                            </div>

                        </div>

                    )
                })}

            </section>

        </main>
    )
}