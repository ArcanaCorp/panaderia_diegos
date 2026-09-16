'use client';

import {
    IconShoppingCart,
    IconPackage,
    IconAlertTriangle,
    IconArrowUpRight,
    IconBell,
    IconPlus,
    IconClock,
    IconRefresh,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { useSalesDashboard } from '@/hooks/useSalesDashboard';
import { useRouter } from 'next/navigation';

export default function DashboardView() {
    
    const router = useRouter();
    const { profile } = useAuth();

    const {
        dashboard,
        loading,
        error,
        reload,
    } = useSalesDashboard();

    const userName = profile?.full_name || 'Usuario';
    const storeName = profile?.store?.name || 'Mi tienda';

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard__loading">
                    <IconRefresh size={24} className="dashboard__loading-icon" />
                    <span>Cargando dashboard...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard__error">
                    <IconAlertTriangle size={24} />

                    <div>
                        <strong>No se pudo cargar el dashboard</strong>
                        <p>{error}</p>
                    </div>

                    <button
                        className="btn btn--outline btn--sm"
                        onClick={reload}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboard) return null;

    const stats = dashboard.stats || {};
    const recentSales = dashboard.recent_sales || [];
    const products = dashboard.products || [];
    const alerts = dashboard.alerts || [];

    const todaySales = Number(stats.today_sales || 0);
    const yesterdaySales = Number(stats.yesterday_sales || 0);

    let salesChange = 0;

    if (yesterdaySales > 0) {
        salesChange =
            ((todaySales - yesterdaySales) / yesterdaySales) * 100;
    }

    const isPositive = salesChange >= 0;

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
                    <button className="btn btn--primary" onClick={() => router.push('/dashboard/pos')}>
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
                            S/ {todaySales.toFixed(2)}
                        </h3>

                        <span
                            className={`card__trend ${
                                isPositive
                                    ? 'card__trend--positive'
                                    : 'card__trend--negative'
                            }`}
                        >
                            <IconArrowUpRight size={14} />

                            {yesterdaySales > 0
                                ? `${Math.abs(salesChange).toFixed(1)}% vs ayer`
                                : 'Sin ventas ayer'}
                        </span>
                    </div>
                </div>


                <div className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">
                            Ventas realizadas
                        </p>

                        <h3 className="card__value">
                            {stats.today_sales_count || 0}
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
                            {stats.products_count || 0}
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
                            {stats.low_stock_count || 0}
                        </h3>

                        <span className="card__trend">
                            <IconAlertTriangle size={14} />
                            Requieren atención
                        </span>
                    </div>
                </div>

            </section>


            {/* VENTAS + ALERTAS */}
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

                        {recentSales.length === 0 ? (
                            <div className="dashboard__empty">
                                <IconShoppingCart size={24} />
                                <span>
                                    Aún no hay ventas registradas.
                                </span>
                            </div>
                        ) : (
                            <div className="dashboard__activity-list">

                                {recentSales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="dashboard__activity-item"
                                    >
                                        <div className="dashboard__activity-icon dashboard__activity-icon--positive">
                                            <IconShoppingCart size={16} />
                                        </div>

                                        <div className="dashboard__activity-content">
                                            <p className="dashboard__activity-title">
                                                {sale.code || 'Venta'}
                                            </p>

                                            <p className="dashboard__activity-description">
                                                {sale.customer_name ||
                                                    'Cliente general'}
                                            </p>
                                        </div>

                                        <span className="dashboard__activity-amount">
                                            S/ {Number(sale.total || 0).toFixed(2)}
                                        </span>
                                    </div>
                                ))}

                            </div>
                        )}

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

                        {alerts.length === 0 ? (
                            <div className="dashboard__empty">
                                <IconBell size={24} />
                                <span>
                                    No hay alertas pendientes.
                                </span>
                            </div>
                        ) : (
                            <div className="dashboard__activity-list">

                                {alerts.map((alert, index) => (
                                    <div
                                        key={`${alert.product_id || index}`}
                                        className="dashboard__activity-item"
                                    >
                                        <div className="dashboard__activity-icon dashboard__activity-icon--negative">
                                            <IconAlertTriangle size={16} />
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
                        )}

                    </div>
                </div>

            </section>


            {/* INVENTARIO */}
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

                        {products.length === 0 ? (
                            <div className="dashboard__empty">
                                <IconPackage size={24} />

                                <span>
                                    No hay productos disponibles.
                                </span>
                            </div>
                        ) : (
                            <div className="dashboard__stock-list">

                                {products.map((product) => {

                                    const lowStock =
                                        Number(product.stock) <=
                                        Number(product.minimum_stock);

                                    return (
                                        <div
                                            key={product.id}
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
                                                {product.stock} {product.unit_type}
                                            </span>

                                            <span
                                                className={`badge ${
                                                    lowStock
                                                        ? 'badge--warning'
                                                        : 'badge--success'
                                                }`}
                                            >
                                                {lowStock
                                                    ? 'Stock bajo'
                                                    : 'Disponible'}
                                            </span>
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>
                </div>

            </section>

        </div>
    );
}