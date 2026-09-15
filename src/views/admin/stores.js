'use client';

import {
    IconBuildingStore,
    IconCircleCheck,
    IconCircleX,
    IconClock,
    IconCurrency,
    IconPackage,
    IconTruckDelivery,
    IconDotsVertical,
    IconArrowUpRight,
    IconChevronRight,
} from '@tabler/icons-react';

import { useState } from 'react';

const stores = [
    {
        id: 1,
        name: 'Tienda Principal',
        code: 'TDA-001',
        address: 'Jauja Centro',
        active: true,
        open: true,
        sales: 2450.00,
        salesCount: 38,
        stock: 1248,
        lowStock: 6,
        lastSale: 'Hace 5 min',
    },
    {
        id: 2,
        name: 'Tienda 2',
        code: 'TDA-002',
        address: 'Jauja Norte',
        active: true,
        open: true,
        sales: 1840.50,
        salesCount: 29,
        stock: 856,
        lowStock: 4,
        lastSale: 'Hace 12 min',
    },
    {
        id: 3,
        name: 'Tienda 3',
        code: 'TDA-003',
        address: 'Jauja Sur',
        active: true,
        open: false,
        sales: 920.00,
        salesCount: 16,
        stock: 423,
        lowStock: 9,
        lastSale: 'Hace 1 h',
    },
];

const recentSales = [
    {
        id: '#V-00482',
        store: 'Tienda Principal',
        total: 42.50,
        time: '14:18',
    },
    {
        id: '#V-00481',
        store: 'Tienda 2',
        total: 28.00,
        time: '14:12',
    },
    {
        id: '#V-00480',
        store: 'Tienda Principal',
        total: 65.80,
        time: '14:05',
    },
    {
        id: '#V-00479',
        store: 'Tienda 3',
        total: 31.50,
        time: '13:52',
    },
];

export default function StoresAdmin() {
    const [selectedStore, setSelectedStore] = useState(null);

    const activeStores = stores.filter((store) => store.active).length;
    const openStores = stores.filter((store) => store.open).length;

    const totalSales = stores.reduce(
        (total, store) => total + store.sales,
        0
    );

    const totalStock = stores.reduce(
        (total, store) => total + store.stock,
        0
    );

    function handleTransfer() {
        console.log('Abrir transferencia de productos');
    }

    return (
        <main className="stores">
            {/* Header */}
            <header className="stores__header">
                <div>
                    <div className="stores__title-row">
                        <div className="stores__title-icon">
                            <IconBuildingStore size={18} />
                        </div>

                        <div>
                            <h1 className="stores__title">Tiendas</h1>
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

            {/* Stats */}
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
                            S/ {totalSales.toLocaleString('es-PE', {
                                minimumFractionDigits: 2,
                            })}
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
                            {totalStock.toLocaleString('es-PE')}
                        </strong>
                    </div>
                </div>
            </section>

            {/* Stores */}
            <section className="stores__section">
                <div className="stores__section-header">
                    <div>
                        <h2>Resumen por tienda</h2>
                        <p>Estado y rendimiento de cada sucursal.</p>
                    </div>
                </div>

                <div className="stores__grid">
                    {stores.map((store) => (
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
                                        <h3>{store.name}</h3>
                                        <span>
                                            {store.code} · {store.address}
                                        </span>
                                    </div>
                                </div>

                                <button className="btn btn--icon btn--ghost btn--sm">
                                    <IconDotsVertical size={17} />
                                </button>
                            </div>

                            <div className="stores__status">
                                <span
                                    className={`badge ${
                                        store.open
                                            ? 'badge--success'
                                            : 'badge--neutral'
                                    }`}
                                >
                                    {store.open ? 'Abierta' : 'Cerrada'}
                                </span>

                                <span
                                    className={`badge ${
                                        store.active
                                            ? 'badge--primary'
                                            : 'badge--neutral'
                                    }`}
                                >
                                    {store.active ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>

                            <div className="stores__metrics">
                                <div>
                                    <span>Ventas hoy</span>
                                    <strong>
                                        S/ {store.sales.toLocaleString('es-PE', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </strong>
                                </div>

                                <div>
                                    <span>Ventas</span>
                                    <strong>{store.salesCount}</strong>
                                </div>

                                <div>
                                    <span>Stock</span>
                                    <strong>{store.stock}</strong>
                                </div>

                                <div>
                                    <span>Stock bajo</span>
                                    <strong className="stores__metric-danger">
                                        {store.lowStock}
                                    </strong>
                                </div>
                            </div>

                            <div className="stores__card-footer">
                                <span>
                                    Última venta: {store.lastSale}
                                </span>

                                <button
                                    className="btn btn--ghost btn--sm"
                                    onClick={() => setSelectedStore(store)}
                                >
                                    Ver tienda
                                    <IconChevronRight size={15} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Bottom */}
            <section className="stores__bottom">
                {/* Últimas ventas */}
                <div className="card stores__sales">
                    <div className="stores__panel-header">
                        <div>
                            <h2>Últimas ventas</h2>
                            <p>Ventas recientes de todas las tiendas.</p>
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
                                    <strong>{sale.id}</strong>
                                    <span>{sale.store}</span>
                                </div>

                                <div className="stores__sale-total">
                                    <strong>
                                        S/ {sale.total.toFixed(2)}
                                    </strong>
                                    <span>{sale.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acciones */}
                <div className="card stores__actions">
                    <div className="stores__panel-header">
                        <div>
                            <h2>Gestión de stock</h2>
                            <p>Distribuye productos entre tiendas.</p>
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
                            <strong>Enviar productos</strong>
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
                            <strong>Ver inventario</strong>
                            <small>
                                Consultar stock por tienda
                            </small>
                        </span>

                        <IconChevronRight size={16} />
                    </button>
                </div>
            </section>

            {selectedStore && (
                <div className="stores__selected">
                    Tienda seleccionada: {selectedStore.name}
                </div>
            )}
        </main>
    );
}