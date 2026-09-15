'use client';

import { IconShoppingCart, IconClipboardList, IconPackage, IconTrendingUp, IconAlertTriangle, IconArrowUpRight, IconArrowDownRight, IconDotsVertical } from '@tabler/icons-react';

import { useAuth } from "@/context/AuthContext";

export default function DashboardAdmin() {

    const { profile } = useAuth();

    return (
        <main className="dashboard">

            {/* HEADER */}
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


            {/* KPIs */}
            <section className="dashboard__stats">

                <article className="card card--stat">

                    <div className="card__content">
                        <p className="card__label">
                            Ventas de hoy
                        </p>

                        <p className="card__value">
                            S/ 2,450
                        </p>

                        <p className="card__trend card__trend--positive">
                            <IconArrowUpRight size={13} />
                            12.5% vs. ayer
                        </p>
                    </div>

                    <div className="card__icon">
                        <IconShoppingCart size={16} />
                    </div>

                </article>


                <article className="card card--stat">

                    <div className="card__content">
                        <p className="card__label">
                            Pedidos
                        </p>

                        <p className="card__value">
                            24
                        </p>

                        <p className="card__trend card__trend--positive">
                            <IconArrowUpRight size={13} />
                            8.2% vs. ayer
                        </p>
                    </div>

                    <div className="card__icon">
                        <IconClipboardList size={16} />
                    </div>

                </article>


                <article className="card card--stat">

                    <div className="card__content">
                        <p className="card__label">
                            Ingresos del mes
                        </p>

                        <p className="card__value">
                            S/ 18,420
                        </p>

                        <p className="card__trend card__trend--positive">
                            <IconArrowUpRight size={13} />
                            5.4% este mes
                        </p>
                    </div>

                    <div className="card__icon">
                        <IconTrendingUp size={16} />
                    </div>

                </article>


                <article className="card card--stat">

                    <div className="card__content">
                        <p className="card__label">
                            Stock bajo
                        </p>

                        <p className="card__value">
                            6
                        </p>

                        <p className="card__trend card__trend--negative">
                            <IconAlertTriangle size={13} />
                            Requieren atención
                        </p>
                    </div>

                    <div className="card__icon">
                        <IconAlertTriangle size={16} />
                    </div>

                </article>

            </section>


            {/* CONTENT */}
            <section className="dashboard__grid">

                {/* VENTAS */}
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
                            <IconDotsVertical size={18} />
                        </button>

                    </div>

                    <div className="dashboard__chart">

                        <div className="dashboard__chart-placeholder">
                            <IconTrendingUp size={24} />

                            <span>
                                Gráfico de ventas
                            </span>
                        </div>

                    </div>

                </article>


                {/* ACTIVIDAD */}
                <article className="card dashboard__activity">

                    <div className="card__header">

                        <div>
                            <h2 className="card__title">
                                Actividad reciente
                            </h2>

                            <p className="card__description">
                                Últimos movimientos.
                            </p>
                        </div>

                    </div>


                    <div className="dashboard__activity-list">

                        <Activity
                            icon={<IconShoppingCart size={15} />}
                            title="Nueva venta"
                            description="Venta #00024"
                            amount="S/ 120.00"
                            type="positive"
                        />

                        <Activity
                            icon={<IconPackage size={15} />}
                            title="Ingreso de productos"
                            description="Ingreso #00012"
                            amount="+ 45 productos"
                            type="neutral"
                        />

                        <Activity
                            icon={<IconClipboardList size={15} />}
                            title="Nuevo pedido"
                            description="Pedido #00018"
                            amount="S/ 85.00"
                            type="positive"
                        />

                        <Activity
                            icon={<IconAlertTriangle size={15} />}
                            title="Stock bajo"
                            description="Harina sin preparar"
                            amount="6 unidades"
                            type="negative"
                        />

                    </div>

                </article>

            </section>


            {/* STOCK */}
            <section className="card dashboard__stock">

                <div className="card__header">

                    <div>
                        <h2 className="card__title">
                            Productos con stock bajo
                        </h2>

                        <p className="card__description">
                            Productos que necesitan reposición.
                        </p>
                    </div>

                    <button className="btn btn--ghost">
                        Ver almacén
                        <IconArrowUpRight size={15} />
                    </button>

                </div>


                <div className="dashboard__stock-list">

                    <StockItem
                        name="Harina de trigo"
                        category="Insumos"
                        stock="8 kg"
                        status="Bajo"
                    />

                    <StockItem
                        name="Azúcar"
                        category="Insumos"
                        stock="12 kg"
                        status="Bajo"
                    />

                    <StockItem
                        name="Mantequilla"
                        category="Insumos"
                        stock="4 kg"
                        status="Crítico"
                    />

                </div>

            </section>

        </main>
    );
}


/* ==========================================================================
   ACTIVITY
   ========================================================================== */

function Activity({
    icon,
    title,
    description,
    amount,
    type = 'neutral'
}) {
    return (
        <div className="dashboard__activity-item">

            <div className={`dashboard__activity-icon dashboard__activity-icon--${type}`}>
                {icon}
            </div>

            <div className="dashboard__activity-content">

                <p className="dashboard__activity-title">
                    {title}
                </p>

                <p className="dashboard__activity-description">
                    {description}
                </p>

            </div>

            <span className="dashboard__activity-amount">
                {amount}
            </span>

        </div>
    );
}


/* ==========================================================================
   STOCK ITEM
   ========================================================================== */

function StockItem({
    name,
    category,
    stock,
    status
}) {
    return (
        <div className="dashboard__stock-item">

            <div className="dashboard__stock-info">

                <p className="dashboard__stock-name">
                    {name}
                </p>

                <p className="dashboard__stock-category">
                    {category}
                </p>

            </div>

            <span className="dashboard__stock-quantity">
                {stock}
            </span>

            <span
                className={`badge ${
                    status === 'Crítico'
                        ? 'badge--danger'
                        : 'badge--warning'
                }`}
            >
                {status}
            </span>

        </div>
    );
}