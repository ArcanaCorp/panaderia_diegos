'use client'

import {
    IconPlus,
    IconClock,
    IconPlayerPlay,
    IconPalette,
    IconCheck,
    IconDots,
    IconChevronRight,
    IconChevronLeft,
    IconAlertTriangle,
    IconPackage,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'

const orders = [
    {
        id: 'PRD-00042',
        product: 'Pan francés',
        quantity: 100,
        priority: 'Alta',
        requestedBy: 'Ventas',
        time: 'Hace 15 min',
    },
    {
        id: 'PRD-00043',
        product: 'Pan integral',
        quantity: 60,
        priority: 'Normal',
        requestedBy: 'Ventas',
        time: 'Hace 32 min',
    },
    {
        id: 'PRD-00044',
        product: 'Croissant',
        quantity: 30,
        priority: 'Urgente',
        requestedBy: 'Ventas',
        time: 'Hace 45 min',
    },
    {
        id: 'PRD-00045',
        product: 'Torta personal',
        quantity: 15,
        priority: 'Normal',
        requestedBy: 'Diseño',
        time: 'Hace 1 h',
    },
]

const columns = [
    {
        id: 'pendiente',
        title: 'Pendientes',
        icon: IconClock,
    },
    {
        id: 'proceso',
        title: 'En proceso',
        icon: IconPlayerPlay,
    },
    {
        id: 'diseno',
        title: 'Diseño',
        icon: IconPalette,
    },
    {
        id: 'completado',
        title: 'Completado',
        icon: IconCheck,
    },
]

export default function ProduccionView() {

    const { profile } = useAuth()

    const storeName = profile?.store?.name || 'Mi tienda'

    function handleMove(order, nextStatus) {
        console.log('Mover orden:', order.id, 'a:', nextStatus)
    }

    function handleCreate() {
        console.log('Nueva orden de producción')
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
                            Producción · {storeName}
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
                    className="btn btn--primary"
                    onClick={handleCreate}
                >
                    <IconPlus size={16} />
                    Nueva producción
                </button>

            </header>

            {/* RESUMEN */}

            <div className="production__summary">

                <div className="production__summary-item">
                    <span>Pendientes</span>
                    <strong>12</strong>
                </div>

                <div className="production__summary-item">
                    <span>En proceso</span>
                    <strong>8</strong>
                </div>

                <div className="production__summary-item">
                    <span>Diseño</span>
                    <strong>4</strong>
                </div>

                <div className="production__summary-item">
                    <span>Completadas hoy</span>
                    <strong>34</strong>
                </div>

                <div className="production__summary-item production__summary-item--danger">
                    <span>Urgentes</span>
                    <strong>3</strong>
                </div>

            </div>

            {/* KANBAN */}

            <section className="production__board">

                {columns.map((column) => {

                    const ColumnIcon = column.icon

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
                                        {
                                            column.id === 'pendiente'
                                                ? 2
                                                : column.id === 'proceso'
                                                    ? 1
                                                    : column.id === 'diseno'
                                                        ? 1
                                                        : 2
                                        }
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

                                {orders
                                    .filter((order, index) => {

                                        if (column.id === 'pendiente') {
                                            return index < 2
                                        }

                                        if (column.id === 'proceso') {
                                            return index === 2
                                        }

                                        if (column.id === 'diseno') {
                                            return index === 3
                                        }

                                        return false
                                    })
                                    .map((order) => (

                                        <article
                                            className="production-card"
                                            key={order.id}
                                        >

                                            <div className="production-card__top">

                                                <span className="production-card__id">
                                                    {order.id}
                                                </span>

                                                <span
                                                    className={`production-card__priority production-card__priority--${order.priority.toLowerCase()}`}
                                                >
                                                    {order.priority === 'Urgente' && (
                                                        <IconAlertTriangle size={13} />
                                                    )}

                                                    {order.priority}
                                                </span>

                                            </div>

                                            <h3 className="production-card__title">
                                                {order.product}
                                            </h3>

                                            <div className="production-card__quantity">
                                                <IconPackage size={15} />
                                                <strong>
                                                    {order.quantity}
                                                </strong>
                                                <span>unidades</span>
                                            </div>

                                            <div className="production-card__meta">

                                                <span>
                                                    Solicitado por {order.requestedBy}
                                                </span>

                                                <span>
                                                    {order.time}
                                                </span>

                                            </div>

                                            {/* QUICK ACTIONS */}

                                            <div className="production-card__actions">

                                                {column.id !== 'pendiente' &&
                                                    column.id !== 'completado' && (
                                                        <button
                                                            className="btn btn--icon btn--ghost btn--sm"
                                                            title="Retroceder"
                                                            onClick={() =>
                                                                handleMove(
                                                                    order,
                                                                    column.id === 'proceso'
                                                                        ? 'pendiente'
                                                                        : 'proceso'
                                                                )
                                                            }
                                                        >
                                                            <IconChevronLeft size={16} />
                                                        </button>
                                                    )}

                                                {column.id !== 'completado' && (
                                                    <button
                                                        className="btn btn--primary btn--sm"
                                                        onClick={() =>
                                                            handleMove(
                                                                order,
                                                                column.id === 'pendiente'
                                                                    ? 'proceso'
                                                                    : column.id === 'proceso'
                                                                        ? 'diseno'
                                                                        : 'completado'
                                                            )
                                                        }
                                                    >
                                                        {column.id === 'pendiente' && (
                                                            <>
                                                                <IconPlayerPlay size={15} />
                                                                Iniciar
                                                            </>
                                                        )}

                                                        {column.id === 'proceso' && (
                                                            <>
                                                                <IconPalette size={15} />
                                                                Diseño
                                                            </>
                                                        )}

                                                        {column.id === 'diseno' && (
                                                            <>
                                                                <IconCheck size={15} />
                                                                Completar
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                            </div>

                                        </article>

                                    ))}

                                {column.id === 'completado' && (
                                    <div className="production__empty">
                                        <IconCheck size={22} />
                                        <span>
                                            Producción completada
                                        </span>
                                    </div>
                                )}

                            </div>

                        </div>
                    )
                })}

            </section>

        </main>
    )
}