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
import { useWarehouseDashboard } from '@/hooks/useWarehouseDashboard'


export default function DashboardAlmace() {

    const { profile } = useAuth()

    const {
        stats,
        movements,
        lowStockProducts,
        loading,
        error,
    } = useWarehouseDashboard()


    const storeName =
        profile?.store?.name ||
        'Almacén Central'

    const userName =
        profile?.full_name?.split(' ')[0] ||
        'Usuario'


    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading) {

        return (
            <main className="dashboard">

                <header className="dashboard__header">

                    <div>

                        <p className="dashboard__eyebrow">
                            Almacén · {storeName}
                        </p>

                        <h1 className="dashboard__title">
                            Hola, {userName}
                        </h1>

                        <p className="dashboard__description">
                            Cargando información del almacén...
                        </p>

                    </div>

                </header>


                <section className="dashboard__stats">

                    {[1, 2, 3, 4].map((item) => (

                        <article
                            className="card card--stat"
                            key={item}
                        >

                            <div className="card__content">

                                <div className="card__icon">
                                    <IconPackages size={18} />
                                </div>

                                <div>

                                    <p className="card__label">
                                        Cargando
                                    </p>

                                    <strong className="card__value">
                                        —
                                    </strong>

                                </div>

                            </div>

                        </article>

                    ))}

                </section>

            </main>
        )
    }


    /*
     * =========================================================
     * ERROR
     * =========================================================
     */

    if (error) {

        return (
            <main className="dashboard">

                <header className="dashboard__header">

                    <div>

                        <p className="dashboard__eyebrow">
                            Almacén · {storeName}
                        </p>

                        <h1 className="dashboard__title">
                            Hola, {userName}
                        </h1>

                        <p className="dashboard__description">
                            No pudimos cargar la información del almacén.
                        </p>

                    </div>

                    <button
                        className="btn btn--primary"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>

                </header>


                <section className="card">

                    <div className="card__header">

                        <div>

                            <h2 className="card__title">
                                Error
                            </h2>

                            <p className="card__description">
                                {error}
                            </p>

                        </div>

                    </div>

                </section>

            </main>
        )
    }


    /*
     * =========================================================
     * STATS
     * =========================================================
     */

    const statsData = [

        {
            label: 'Productos en stock',
            value: stats.products_in_stock,
            icon: IconPackages,
            type: 'neutral',
        },

        {
            label: 'Ingresos hoy',
            value: stats.entries_today,
            icon: IconArrowDown,
            type: 'positive',
        },

        {
            label: 'Salidas hoy',
            value: stats.exits_today,
            icon: IconArrowUp,
            type: 'neutral',
        },

        {
            label: 'Stock bajo',
            value: stats.low_stock,
            icon: IconAlertTriangle,
            type: 'negative',
        },

    ]


    return (
        <main className="dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

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


            {/* =================================================
                STATS
            ================================================= */}

            <section className="dashboard__stats">

                {statsData.map((stat) => {

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


            {/* =================================================
                MAIN GRID
            ================================================= */}

            <section className="dashboard__grid">


                {/* =================================================
                    MOVEMENTS
                ================================================= */}

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

                        {movements.length === 0 ? (

                            <div className="dashboard__empty">

                                <IconPackages size={22} />

                                <p>
                                    No hay movimientos registrados.
                                </p>

                            </div>

                        ) : (

                            movements.map((movement) => {

                                const Icon =
                                    movement.type === 'positive'
                                        ? IconArrowDown
                                        : IconArrowUp


                                return (

                                    <div
                                        className="dashboard__activity-item"
                                        key={movement.id}
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

                            })

                        )}

                    </div>

                </article>


                {/* =================================================
                    LOW STOCK
                ================================================= */}

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

                        {lowStockProducts.length === 0 ? (

                            <div className="dashboard__empty">

                                <IconPackages size={22} />

                                <p>
                                    No hay productos con stock bajo.
                                </p>

                            </div>

                        ) : (

                            lowStockProducts.map((product) => (

                                <div
                                    className="dashboard__stock-item"
                                    key={product.id}
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

                            ))

                        )}

                    </div>

                </article>

            </section>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

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