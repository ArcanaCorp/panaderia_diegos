'use client';

import {
    IconBuildingStore,
    IconCircleCheck,
    IconClock,
    IconCurrency,
    IconPackage,
    IconTruckDelivery,
    IconDotsVertical,
    IconArrowUpRight,
    IconChevronRight,
} from '@tabler/icons-react';

import { useState } from 'react';
import { useAdminStores } from '@/hooks/useAdminStores';

function formatCurrency(value) {
    return Number(value || 0).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString('es-PE');
}

function formatLastSale(date) {
    if (!date) return 'Sin ventas';

    const diff =
        Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `Hace ${hours} h`;

    const days = Math.floor(hours / 24);

    return `Hace ${days} día${days > 1 ? 's' : ''}`;
}

function isStoreOpen(store) {
    if (!store.is_active) return false;

    if (!store.opening_time || !store.closing_time) {
        return true;
    }

    const now = new Date();

    const current =
        now.getHours() * 60 +
        now.getMinutes();

    const [openHour, openMinute] =
        store.opening_time.split(':').map(Number);

    const [closeHour, closeMinute] =
        store.closing_time.split(':').map(Number);

    const opening =
        openHour * 60 + openMinute;

    const closing =
        closeHour * 60 + closeMinute;

    return current >= opening && current <= closing;
}

export default function StoresAdmin() {
    const {
        stores,
        recentSales,
        loading,
        error,
        refresh,
    } = useAdminStores();

    const [selectedStore, setSelectedStore] = useState(null);

    const activeStores = stores.filter(
        (store) => store.is_active
    ).length;

    const openStores = stores.filter(
        (store) => isStoreOpen(store)
    ).length;

    const totalSales = stores.reduce(
        (total, store) =>
            total + Number(store.sales || 0),
        0
    );

    const totalStock = stores.reduce(
        (total, store) =>
            total + Number(store.stock || 0),
        0
    );

    function handleTransfer() {
        console.log('Abrir transferencia de productos');
    }

    if (loading) {
        return (
            <main className="stores">
                <div className="card">
                    Cargando tiendas...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="stores">
                <div className="card">
                    <strong>No se pudieron cargar las tiendas</strong>
                    <p>{error}</p>

                    <button
                        className="btn btn--primary"
                        onClick={refresh}
                    >
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="stores">

            {/* HEADER */}
            <header className="stores__header">
                <div>
                    <div className="stores__title-row">
                        <div className="stores__title-icon">
                            <IconBuildingStore size={18} />
                        </div>

                        <div>
                            <h1 className="stores__title">
                                Tiendas
                            </h1>

                            <p className="stores__description">
                                Controla tus tiendas, ventas y distribución de stock.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn--primary"
                    onClick={handleTransfer}
                >
                    <IconTruckDelivery size={16} />
                    Enviar productos
                </button>
            </header>

            {/* STATS */}
            <section className="stores__stats">

                <div className="card stores__stat">
                    <div className="stores__stat-icon">
                        <IconBuildingStore size={17} />
                    </div>

                    <div>
                        <span className="stores__stat-label">
                            Total tiendas
                        </span>

                        <strong className="stores__stat-value">
                            {stores.length}
                        </strong>
                    </div>
                </div>

                <div className="card stores__stat">
                    <div className="stores__stat-icon stores__stat-icon--success">
                        <IconCircleCheck size={17} />
                    </div>

                    <div>
                        <span className="stores__stat-label">
                            Tiendas activas
                        </span>

                        <strong className="stores__stat-value">
                            {activeStores}
                        </strong>
                    </div>
                </div>

                <div className="card stores__stat">
                    <div className="stores__stat-icon stores__stat-icon--info">
                        <IconClock size={17} />
                    </div>

                    <div>
                        <span className="stores__stat-label">
                            Abiertas ahora
                        </span>

                        <strong className="stores__stat-value">
                            {openStores}
                        </strong>
                    </div>
                </div>

                <div className="card stores__stat">
                    <div className="stores__stat-icon">
                        <IconCurrency size={17} />
                    </div>

                    <div>
                        <span className="stores__stat-label">
                            Ventas de hoy
                        </span>

                        <strong className="stores__stat-value">
                            S/ {formatCurrency(totalSales)}
                        </strong>
                    </div>
                </div>

                <div className="card stores__stat">
                    <div className="stores__stat-icon">
                        <IconPackage size={17} />
                    </div>

                    <div>
                        <span className="stores__stat-label">
                            Stock total
                        </span>

                        <strong className="stores__stat-value">
                            {formatNumber(totalStock)}
                        </strong>
                    </div>
                </div>

            </section>

            {/* STORES */}
            <section className="stores__section">

                <div className="stores__section-header">
                    <div>
                        <h2>Resumen por tienda</h2>
                        <p>
                            Estado y rendimiento de cada sucursal.
                        </p>
                    </div>
                </div>

                <div className="stores__grid">

                    {stores.map((store) => {
                        const open = isStoreOpen(store);

                        return (
                            <article
                                className="card stores__card"
                                key={store.id}
                            >

                                <div className="stores__card-header">

                                    <div className="stores__card-store">

                                        <div className="stores__card-icon">
                                            <IconBuildingStore size={18} />
                                        </div>

                                        <div>
                                            <h3>
                                                {store.name}
                                            </h3>

                                            <span>
                                                {store.code}
                                                {' · '}
                                                {store.address || 'Sin dirección'}
                                            </span>
                                        </div>

                                    </div>

                                    <button
                                        className="btn btn--icon btn--ghost btn--sm"
                                    >
                                        <IconDotsVertical size={17} />
                                    </button>

                                </div>

                                <div className="stores__status">

                                    <span
                                        className={`badge ${
                                            open
                                                ? 'badge--success'
                                                : 'badge--neutral'
                                        }`}
                                    >
                                        {open
                                            ? 'Abierta'
                                            : 'Cerrada'}
                                    </span>

                                    <span
                                        className={`badge ${
                                            store.is_active
                                                ? 'badge--primary'
                                                : 'badge--neutral'
                                        }`}
                                    >
                                        {store.is_active
                                            ? 'Activa'
                                            : 'Inactiva'}
                                    </span>

                                </div>

                                <div className="stores__metrics">

                                    <div>
                                        <span>Ventas hoy</span>

                                        <strong>
                                            S/ {formatCurrency(
                                                store.sales
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Ventas</span>

                                        <strong>
                                            {store.sales_count}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Stock</span>

                                        <strong>
                                            {formatNumber(
                                                store.stock
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Stock bajo</span>

                                        <strong className="stores__metric-danger">
                                            {store.low_stock}
                                        </strong>
                                    </div>

                                </div>

                                <div className="stores__card-footer">

                                    <span>
                                        Última venta:{' '}
                                        {formatLastSale(
                                            store.last_sale
                                        )}
                                    </span>

                                    <button
                                        className="btn btn--ghost btn--sm"
                                        onClick={() =>
                                            setSelectedStore(store)
                                        }
                                    >
                                        Ver tienda
                                        <IconChevronRight size={15} />
                                    </button>

                                </div>

                            </article>
                        );
                    })}

                </div>
            </section>

            {/* BOTTOM */}
            <section className="stores__bottom">

                {/* VENTAS */}
                <div className="card stores__sales">

                    <div className="stores__panel-header">
                        <div>
                            <h2>Últimas ventas</h2>
                            <p>
                                Ventas recientes de todas las tiendas.
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--sm">
                            Ver todas
                            <IconArrowUpRight size={15} />
                        </button>
                    </div>

                    <div className="stores__sales-list">

                        {recentSales.map((sale) => (
                            <div
                                className="stores__sale"
                                key={sale.id}
                            >

                                <div className="stores__sale-icon">
                                    <IconCurrency size={16} />
                                </div>

                                <div className="stores__sale-info">
                                    <strong>
                                        {sale.code}
                                    </strong>

                                    <span>
                                        {sale.store}
                                    </span>
                                </div>

                                <div className="stores__sale-total">
                                    <strong>
                                        S/ {formatCurrency(
                                            sale.total
                                        )}
                                    </strong>

                                    <span>
                                        {new Date(
                                            sale.created_at
                                        ).toLocaleTimeString(
                                            'es-PE',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }
                                        )}
                                    </span>
                                </div>

                            </div>
                        ))}

                        {recentSales.length === 0 && (
                            <div className="stores__empty">
                                No hay ventas registradas.
                            </div>
                        )}

                    </div>

                </div>

                {/* GESTIÓN */}
                <div className="card stores__actions">

                    <div className="stores__panel-header">
                        <div>
                            <h2>Gestión de stock</h2>

                            <p>
                                Distribuye productos entre tiendas.
                            </p>
                        </div>
                    </div>

                    <button
                        className="stores__action"
                        onClick={handleTransfer}
                    >
                        <span className="stores__action-icon">
                            <IconTruckDelivery size={18} />
                        </span>

                        <span>
                            <strong>
                                Enviar productos
                            </strong>

                            <small>
                                Transferir stock a una tienda
                            </small>
                        </span>

                        <IconChevronRight size={16} />
                    </button>

                    <button className="stores__action">
                        <span className="stores__action-icon">
                            <IconPackage size={18} />
                        </span>

                        <span>
                            <strong>
                                Ver inventario
                            </strong>

                            <small>
                                Consultar stock por tienda
                            </small>
                        </span>

                        <IconChevronRight size={16} />
                    </button>

                </div>

            </section>

            {/* SELECTED STORE */}
            {selectedStore && (
                <div className="stores__selected">
                    Tienda seleccionada:{' '}
                    {selectedStore.name}
                </div>
            )}

        </main>
    );
}