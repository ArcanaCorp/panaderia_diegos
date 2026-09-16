'use client';

import { IconShoppingCart, IconClipboardList, IconPackage, IconTrendingUp, IconAlertTriangle, IconArrowUpRight, IconArrowDownRight, IconDotsVertical, IconRefresh } from '@tabler/icons-react';

import { useAuth } from "@/context/AuthContext";
import Activity from '@/components/Cards/admin/Activity';
import StockItem from '@/components/Cards/admin/StockItem';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency, formatPercentage, getActivityIcon, getActivityType, getTrendClass, getTrendIcon, getTrendText } from "@/helpers/dashboard.helper";

export default function DashboardAdmin() {

    const { profile } = useAuth();

    const { data, loading, error, refresh } = useAdminDashboard();

    const { kpis, sales_chart, recent_activity, low_stock_products } = data;

    if (loading) {
        return (
            <main className="dashboard">

                <section className="dashboard__header">

                    <div>
                        <p className="dashboard__eyebrow">
                            Panel de administración
                        </p>

                        <h1 className="dashboard__title">
                            Cargando dashboard...
                        </h1>

                        <p className="dashboard__description">
                            Estamos preparando la información de tu empresa.
                        </p>
                    </div>

                </section>

            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard">

                <section className="dashboard__header">

                    <div>
                        <p className="dashboard__eyebrow">
                            Panel de administración
                        </p>

                        <h1 className="dashboard__title">
                            No se pudo cargar el dashboard
                        </h1>

                        <p className="dashboard__description">
                            {error}
                        </p>
                    </div>

                    <div className="dashboard__actions">

                        <button
                            className="btn btn--primary"
                            onClick={refresh}
                        >
                            <IconRefresh size={16} />
                            Reintentar
                        </button>

                    </div>

                </section>

            </main>
        );
    }

    return (
        <main className="dashboard">

            <section className="dashboard__header">

                <div>
                    <p className="dashboard__eyebrow">
                        Panel de administración
                    </p>

                    <h1 className="dashboard__title">
                        Hola, {profile?.full_name || 'Administrador'}
                    </h1>

                    <p className="dashboard__description">
                        Aquí tienes un resumen de lo que está pasando hoy.
                    </p>
                </div>

                <div className="dashboard__actions">

                    <button className="btn btn--primary">
                        <IconShoppingCart size={16} />
                        Nueva venta
                    </button>

                    <button className="btn btn--outline">
                        <IconClipboardList size={16} />
                        Nuevo pedido
                    </button>

                    <button className="btn btn--outline">
                        <IconPackage size={16} />
                        Nuevo ingreso
                    </button>

                </div>

            </section>

            <section className="dashboard__stats">

                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Ventas de hoy</p>
                        <p className="card__value">{formatCurrency(kpis.today_sales)}</p>
                        <p className={`card__trend ${getTrendClass(kpis.today_sales_change)}`}>
                            {getTrendIcon(kpis.today_sales_change)}
                            {getTrendText(kpis.today_sales_change, 'vs. ayer')}
                        </p>
                    </div>
                    <div className="card__icon"><IconShoppingCart size={16} /></div>
                </article>

                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Pedidos</p>
                        <p className="card__value">{kpis.today_orders}</p>
                        <p className={`card__trend ${getTrendClass(kpis.today_orders_change)}`}>
                            {getTrendIcon(kpis.today_orders_change)}
                            {getTrendText(kpis.today_orders_change, 'vs. ayer')}
                        </p>
                    </div>
                    <div className="card__icon">
                        <IconClipboardList size={16} />
                    </div>
                </article>

                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Ingresos del mes</p>
                        <p className="card__value">{formatCurrency(kpis.month_sales)}</p>
                        <p className={`card__trend ${getTrendClass(kpis.month_sales_change)}`}>
                            {getTrendIcon(kpis.month_sales_change)}
                            {getTrendText(kpis.month_sales_change, 'vs. mes anterior')}
                        </p>
                    </div>
                    <div className="card__icon"><IconTrendingUp size={16} /></div>
                </article>

                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Stock bajo</p>
                        <p className="card__value">{kpis.low_stock_count}</p>
                        <p className="card__trend card__trend--negative">
                            <IconAlertTriangle size={13} />
                            Requieren atención
                        </p>
                    </div>
                    <div className="card__icon"><IconAlertTriangle size={16} /></div>
                </article>

            </section>

            <section className="dashboard__grid">

                <article className="card dashboard__sales">

                    <div className="card__header">

                        <div>
                            <h2 className="card__title">
                                Resumen de ventas
                            </h2>

                            <p className="card__description">
                                Ventas realizadas durante los últimos días.
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--icon">
                            <IconRefresh size={18} onClick={refresh} title='Actualizar' />
                        </button>

                    </div>

                    <div className="dashboard__chart">
                        {sales_chart?.length > 0 ? (
                            <div className="dashboard__chart-bars">
                                {sales_chart.map((item) => {
                                    const maxValue = Math.max(...sales_chart.map((chartItem) => Number(chartItem.total) || 0), 1);
                                    const height = (Number(item.total) / maxValue) * 100;
                                    return (
                                        <div className="dashboard__chart-item" key={item.date}>
                                            <div className="dashboard__chart-bar-wrapper">
                                                <div className="dashboard__chart-bar" style={{height: `${Math.max(height, 4)}%`}} title={formatCurrency(item.total)}/>
                                            </div>
                                            <span className="dashboard__chart-label">{item.label}</span>
                                        </div>
                                    );

                                })}
                            </div>
                        ) : (
                            <div className="dashboard__chart-placeholder">
                                <IconTrendingUp size={24} />
                                <span>No hay ventas registradas</span>
                            </div>
                        )}
                    </div>

                </article>

                <article className="card dashboard__activity">
                    <div className="card__header">
                        <div>
                            <h2 className="card__title">Actividad reciente</h2>
                            <p className="card__description">Últimos movimientos.</p>
                        </div>
                    </div>
                    <div className="dashboard__activity-list">
                        {recent_activity?.length > 0 ? (
                            recent_activity.map((item, index) => (
                                <Activity
                                    key={`${item.type}-${item.created_at}-${index}`}
                                    icon={getActivityIcon(item.type)}
                                    title={item.title}
                                    description={item.description}
                                    amount={item.amount !== null && item.amount !== undefined ? formatCurrency(item.amount) : null}
                                    type={getActivityType(item.type)}
                                />
                            ))

                        ) : (
                            <div className="dashboard__chart-placeholder">
                                <span>No hay actividad reciente.</span>
                            </div>
                        )}
                    </div>
                </article>

            </section>

            <section className="card dashboard__stock">
                <div className="card__header">
                    <div>
                        <h2 className="card__title">Productos con stock bajo</h2>
                        <p className="card__description">Productos que necesitan reposición.</p>
                    </div>
                    <button className="btn btn--ghost">Ver almacén <IconArrowUpRight size={15} /></button>
                </div>
                <div className="dashboard__stock-list">
                    {low_stock_products?.length > 0 ? (
                        low_stock_products.map((item) => (
                            <StockItem key={`${item.id}-${item.store_id}`} name={item.name} category={item.category || 'Sin categoría'} stock={`${item.stock} ${item.unit_type || ''}`} status={item.status}/>
                        ))
                    ) : (
                        <div className="dashboard__chart-placeholder">
                            <IconPackage size={20} />
                            <span>No hay productos con stock bajo.</span>
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}