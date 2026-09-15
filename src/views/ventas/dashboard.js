'use client';

import {
    IconShoppingCart,
    IconCash,
    IconPackage,
    IconAlertTriangle,
    IconArrowUpRight,
    IconBell,
    IconPlus,
    IconClock,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

export default function DashboardView() {
    const { profile } = useAuth();

    const storeName = profile?.store?.name || 'Mi tienda';
    const userName = profile?.full_name || 'Usuario';

    const recentSales = [
        {
            id: '#V-00482',
            title: 'Venta realizada',
            description: 'Pan francés x 10 · Hace 5 min',
            amount: 'S/ 12.50',
            type: 'positive',
            icon: <IconShoppingCart size={16} />,
        },
        {
            id: '#V-00481',
            title: 'Venta realizada',
            description: 'Croissant x 2 · Hace 18 min',
            amount: 'S/ 7.00',
            type: 'positive',
            icon: <IconShoppingCart size={16} />,
        },
        {
            id: '#V-00480',
            title: 'Venta realizada',
            description: 'Pan integral x 8 · Hace 32 min',
            amount: 'S/ 4.00',
            type: 'positive',
            icon: <IconShoppingCart size={16} />,
        },
        {
            id: '#V-00479',
            title: 'Venta realizada',
            description: 'Torta personal x 1 · Hace 45 min',
            amount: 'S/ 8.00',
            type: 'positive',
            icon: <IconShoppingCart size={16} />,
        },
    ];

    const alerts = [
        {
            title: 'Stock bajo',
            description: 'Mantequilla tiene 4 unidades disponibles',
            type: 'negative',
            icon: <IconAlertTriangle size={16} />,
        },
        {
            title: 'Stock bajo',
            description: 'Croissant tiene 8 unidades disponibles',
            type: 'negative',
            icon: <IconAlertTriangle size={16} />,
        },
        {
            title: 'Nuevo pedido',
            description: 'Hay un pedido pendiente de atención',
            type: 'neutral',
            icon: <IconBell size={16} />,
        },
    ];

    const products = [
        {
            name: 'Pan francés',
            category: 'Panadería',
            quantity: '120 unidades',
            status: 'Disponible',
            badge: 'success',
        },
        {
            name: 'Pan integral',
            category: 'Panadería',
            quantity: '80 unidades',
            status: 'Disponible',
            badge: 'success',
        },
        {
            name: 'Croissant',
            category: 'Pastelería',
            quantity: '24 unidades',
            status: 'Stock bajo',
            badge: 'warning',
        },
        {
            name: 'Empanada de carne',
            category: 'Panadería',
            quantity: '18 unidades',
            status: 'Disponible',
            badge: 'success',
        },
        {
            name: 'Torta personal',
            category: 'Pastelería',
            quantity: '12 unidades',
            status: 'Stock bajo',
            badge: 'warning',
        },
    ];

    return (
        <div className="dashboard">

            {/* HEADER */}
            <header className="dashboard__header">
                <div>
                    <p className="dashboard__eyebrow">
                        {storeName}
                    </p>

                    <h1 className="dashboard__title">
                        Hola, {userName}
                    </h1>

                    <p className="dashboard__description">
                        Resumen de ventas y productos de tu tienda.
                    </p>
                </div>

                <div className="dashboard__actions">
                    <button className="btn btn--primary">
                        <IconPlus size={16} />
                        Nueva venta
                    </button>
                </div>
            </header>

            {/* STATS */}
            <section className="dashboard__stats">

                <div className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">
                            Ventas de hoy
                        </p>

                        <h3 className="card__value">
                            S/ 1,245.80
                        </h3>

                        <span className="card__trend card__trend--positive">
                            <IconArrowUpRight size={14} />
                            12.5% vs ayer
                        </span>
                    </div>
                </div>

                <div className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">
                            Ventas realizadas
                        </p>

                        <h3 className="card__value">
                            38
                        </h3>

                        <span className="card__trend">
                            <IconShoppingCart size={14} />
                            Hoy
                        </span>
                    </div>
                </div>

                <div className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">
                            Productos disponibles
                        </p>

                        <h3 className="card__value">
                            124
                        </h3>

                        <span className="card__trend">
                            <IconPackage size={14} />
                            En tienda
                        </span>
                    </div>
                </div>

                <div className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">
                            Alertas
                        </p>

                        <h3 className="card__value">
                            3
                        </h3>

                        <span className="card__trend">
                            <IconAlertTriangle size={14} />
                            Requieren atención
                        </span>
                    </div>
                </div>

            </section>

            {/* MAIN GRID */}
            <section className="dashboard__grid">

                {/* VENTAS */}
                <div className="card">

                    <div className="card__header">
                        <div>
                            <h2 className="card__title">
                                Ventas recientes
                            </h2>

                            <p className="card__description">
                                Últimas ventas realizadas en tu tienda.
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--sm">
                            Ver todas
                        </button>
                    </div>

                    <div className="card__body">
                        <div className="dashboard__activity-list">

                            {recentSales.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="dashboard__activity-item"
                                >
                                    <div
                                        className={`dashboard__activity-icon dashboard__activity-icon--${sale.type}`}
                                    >
                                        {sale.icon}
                                    </div>

                                    <div className="dashboard__activity-content">
                                        <p className="dashboard__activity-title">
                                            {sale.title}
                                        </p>

                                        <p className="dashboard__activity-description">
                                            {sale.description}
                                        </p>
                                    </div>

                                    <span className="dashboard__activity-amount">
                                        {sale.amount}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>

                {/* ALERTAS */}
                <div className="card">

                    <div className="card__header">
                        <div>
                            <h2 className="card__title">
                                Alertas
                            </h2>

                            <p className="card__description">
                                Atención requerida en tu tienda.
                            </p>
                        </div>

                        <IconBell size={18} />
                    </div>

                    <div className="card__body">
                        <div className="dashboard__activity-list">

                            {alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className="dashboard__activity-item"
                                >
                                    <div
                                        className={`dashboard__activity-icon dashboard__activity-icon--${alert.type}`}
                                    >
                                        {alert.icon}
                                    </div>

                                    <div className="dashboard__activity-content">
                                        <p className="dashboard__activity-title">
                                            {alert.title}
                                        </p>

                                        <p className="dashboard__activity-description">
                                            {alert.description}
                                        </p>
                                    </div>

                                    <IconClock
                                        size={16}
                                        className="text-gray"
                                    />
                                </div>
                            ))}

                        </div>
                    </div>

                </div>

            </section>

            {/* PRODUCTOS / STOCK */}
            <section className="dashboard__stock">

                <div className="card">

                    <div className="card__header">
                        <div>
                            <h2 className="card__title">
                                Productos de mi tienda
                            </h2>

                            <p className="card__description">
                                Stock disponible actualmente.
                            </p>
                        </div>

                        <button className="btn btn--outline btn--sm">
                            Ver inventario
                        </button>
                    </div>

                    <div className="card__body">
                        <div className="dashboard__stock-list">

                            {products.map((product) => (
                                <div
                                    key={product.name}
                                    className="dashboard__stock-item"
                                >
                                    <div className="dashboard__stock-info">
                                        <p className="dashboard__stock-name">
                                            {product.name}
                                        </p>

                                        <p className="dashboard__stock-category">
                                            {product.category}
                                        </p>
                                    </div>

                                    <span className="dashboard__stock-quantity">
                                        {product.quantity}
                                    </span>

                                    <span className={`badge badge--${product.badge}`}>
                                        {product.status}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>

            </section>

        </div>
    );
}