'use client'

import {
    IconPackages,
    IconArrowDown,
    IconArrowUp,
    IconArrowsExchange,
    IconAlertTriangle,
    IconPlus,
    IconTransfer,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'

export default function DashboardAlmace() {

    const { profile } = useAuth()

    const storeName = profile?.store?.name || 'Almacén Central'
    const userName = profile?.full_name?.split(' ')[0] || 'Usuario'

    const stats = [
        {
            label: 'Productos en stock',
            value: '248',
            icon: IconPackages,
            type: 'neutral',
        },
        {
            label: 'Ingresos hoy',
            value: '36',
            icon: IconArrowDown,
            type: 'positive',
        },
        {
            label: 'Salidas hoy',
            value: '52',
            icon: IconArrowUp,
            type: 'neutral',
        },
        {
            label: 'Stock bajo',
            value: '14',
            icon: IconAlertTriangle,
            type: 'negative',
        },
    ]

    const movements = [
        {
            title: 'Ingreso de harina de trigo',
            description: 'Compra · 50 kg',
            amount: '+50 kg',
            type: 'positive',
        },
        {
            title: 'Salida de azúcar',
            description: 'Producción · 10 kg',
            amount: '-10 kg',
            type: 'negative',
        },
        {
            title: 'Transferencia a Tienda Centro',
            description: 'Pan francés · 50 unidades',
            amount: '-50 und.',
            type: 'negative',
        },
        {
            title: 'Ingreso de mantequilla',
            description: 'Compra · 20 kg',
            amount: '+20 kg',
            type: 'positive',
        },
        {
            title: 'Transferencia recibida',
            description: 'Croissant · 30 unidades',
            amount: '+30 und.',
            type: 'positive',
        },
    ]

    const lowStock = [
        {
            name: 'Harina de trigo',
            category: 'Insumos',
            quantity: '8 kg',
            minimum: '20 kg',
        },
        {
            name: 'Mantequilla',
            category: 'Insumos',
            quantity: '4 kg',
            minimum: '10 kg',
        },
        {
            name: 'Levadura',
            category: 'Insumos',
            quantity: '2 kg',
            minimum: '5 kg',
        },
        {
            name: 'Chocolate cobertura',
            category: 'Pastelería',
            quantity: '0 kg',
            minimum: '3 kg',
        },
    ]

    return (
        <main className="dashboard">

            {/* HEADER */}

            <header className="dashboard__header">

                <div>

                    <p className="dashboard__eyebrow">
                        Almacén · {storeName}
                    </p>

                    <h1 className="dashboard__title">
                        Hola, {userName}
                    </h1>

                    <p className="dashboard__description">
                        Controla el inventario y los movimientos de tu almacén.
                    </p>

                </div>

                <div className="dashboard__actions">

                    <button className="btn btn--outline">
                        <IconTransfer size={16} />
                        Transferir
                    </button>

                    <button className="btn btn--primary">
                        <IconPlus size={16} />
                        Registrar ingreso
                    </button>

                </div>

            </header>

            {/* STATS */}

            <section className="dashboard__stats">

                {stats.map((stat) => {

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

                {/* MOVEMENTS */}

                <article className="card">

                    <div className="card__header">

                        <div>

                            <h2 className="card__title">
                                Movimientos recientes
                            </h2>

                            <p className="card__description">
                                Últimos movimientos del inventario
                            </p>

                        </div>

                        <button className="btn btn--ghost btn--sm">
                            Ver todos
                        </button>

                    </div>

                    <div className="dashboard__activity-list">

                        {movements.map((movement, index) => {

                            const Icon =
                                movement.type === 'positive'
                                    ? IconArrowDown
                                    : IconArrowUp

                            return (
                                <div
                                    className="dashboard__activity-item"
                                    key={index}
                                >

                                    <div
                                        className={`dashboard__activity-icon dashboard__activity-icon--${movement.type}`}
                                    >
                                        <Icon size={16} />
                                    </div>

                                    <div className="dashboard__activity-content">

                                        <p className="dashboard__activity-title">
                                            {movement.title}
                                        </p>

                                        <p className="dashboard__activity-description">
                                            {movement.description}
                                        </p>

                                    </div>

                                    <strong className="dashboard__activity-amount">
                                        {movement.amount}
                                    </strong>

                                </div>
                            )
                        })}

                    </div>

                </article>

                {/* LOW STOCK */}

                <article className="card dashboard__stock">

                    <div className="card__header">

                        <div>

                            <h2 className="card__title">
                                Stock bajo
                            </h2>

                            <p className="card__description">
                                Productos que requieren reposición
                            </p>

                        </div>

                        <button className="btn btn--ghost btn--sm">
                            Ver todos
                        </button>

                    </div>

                    <div className="dashboard__stock-list">

                        {lowStock.map((product) => (

                            <div
                                className="dashboard__stock-item"
                                key={product.name}
                            >

                                <div className="dashboard__stock-info">

                                    <div className="dashboard__activity-icon dashboard__activity-icon--negative">
                                        <IconAlertTriangle size={16} />
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

                                    <span>
                                        mín. {product.minimum}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </article>

            </section>

            {/* QUICK ACTIONS */}

            <section className="card">

                <div className="card__header">

                    <div>

                        <h2 className="card__title">
                            Acciones rápidas
                        </h2>

                        <p className="card__description">
                            Gestiona las operaciones frecuentes del almacén.
                        </p>

                    </div>

                </div>

                <div className="dashboard__actions">

                    <button className="btn btn--outline">
                        <IconArrowDown size={16} />
                        Registrar ingreso
                    </button>

                    <button className="btn btn--outline">
                        <IconArrowUp size={16} />
                        Registrar salida
                    </button>

                    <button className="btn btn--outline">
                        <IconArrowsExchange size={16} />
                        Transferir productos
                    </button>

                    <button className="btn btn--outline">
                        <IconPackages size={16} />
                        Ver inventario
                    </button>

                </div>

            </section>

        </main>
    )
}