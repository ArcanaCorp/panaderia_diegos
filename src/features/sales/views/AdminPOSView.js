'use client';

import { Fragment, useMemo, useState } from 'react';
import {
    IconAlertTriangle,
    IconCalendar,
    IconCash,
    IconChevronDown,
    IconChevronUp,
    IconEye,
    IconRefresh,
    IconSearch,
    IconShoppingBag,
    IconTrash,
    IconTrendingUp,
} from '@tabler/icons-react';

import FeatureSkeleton from '@/features/dashboard/components/FeatureSkeleton';
import { useAdminSales } from '@/features/sales/hooks/useAdminSales';

const currency = (value) => Number(value || 0).toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
});

const dateLabel = (day) => {
    if (!day) return 'Hoy';
    return new Date(`${day}T12:00:00-05:00`).toLocaleDateString('es-PE', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Lima',
    });
};

const dateTimeLabel = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/Lima',
    });
};

const timeLabel = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Lima',
    });
};

const saleCode = (sale) => sale.code || sale.sale_number || sale.id?.slice?.(0, 8) || 'Venta';
const saleTotal = (sale) => sale.total ?? sale.total_amount ?? sale.grand_total ?? 0;
const saleStatus = (sale) => String(sale.status || sale.payment_status || 'Registrada');
const statusLabel = (value) => ({
    completed: 'Completada',
    complete: 'Completada',
    paid: 'Pagada',
    pending: 'Pendiente',
    cancelled: 'Anulada',
    canceled: 'Anulada',
    partial: 'Pago parcial',
})[String(value).toLowerCase()] || value;
const paymentLabel = (value) => {
    const normalized = typeof value === 'object' && value !== null
        ? value.name || value.label || value.type || ''
        : value;

    return ({
        full: 'Pago completo',
        partial: 'Pago dividido',
        cash: 'Efectivo',
        card: 'Tarjeta',
        transfer: 'Transferencia',
        digital_wallet: 'Billetera digital',
    })[String(normalized || '').toLowerCase()] || normalized || '—';
};

function SaleDetails({ sale }) {
    const details = [
        ['Fecha y hora', dateTimeLabel(sale.created_at)],
        ['Documento', sale.customer_dni],
        ['WhatsApp', sale.customer_whatsapp],
        ['Tipo de pago', paymentLabel(sale.payment_type)],
        ['Método de pago', paymentLabel(sale.payment_method)],
        ['Subtotal', sale.subtotal != null ? currency(sale.subtotal) : null],
        ['Descuento', sale.discount != null ? currency(sale.discount) : null],
        ['Impuesto', sale.tax != null ? currency(sale.tax) : null],
        ['Total', currency(saleTotal(sale))],
        ['Identificador', sale.id],
    ].filter(([, value]) => value !== null && value !== undefined && value !== '');

    return (
        <div className="sales-admin__details">
            <div className="sales-admin__details-grid">
                {details.map(([label, value]) => (
                    <div className="sales-admin__detail" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
            <p className="sales-admin__details-note">
                Se muestran los datos disponibles en el registro de la venta.
            </p>
        </div>
    );
}

export default function PosAdmin() {
    const {
        day,
        selectedDay,
        setSelectedDay,
        sales,
        stores,
        statuses,
        stats,
        loading,
        error,
        search,
        setSearch,
        storeId,
        setStoreId,
        status,
        setStatus,
        refresh,
    } = useAdminSales();

    const [expandedSaleId, setExpandedSaleId] = useState(null);

    const storeNames = useMemo(() => new Map(
        stores.map((store) => [String(store.id), store.name])
    ), [stores]);

    if (loading) return <FeatureSkeleton variant="table" />;

    if (error) {
        return (
            <main className="dashboard sales-admin">
                <div className="dashboard__error">
                    <IconAlertTriangle size={22} />
                    <div>
                        <strong>No se pudieron cargar las ventas</strong>
                        <p>{error}</p>
                    </div>
                    <button className="btn btn--outline btn--sm" onClick={refresh}>
                        <IconRefresh size={16} /> Reintentar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard sales-admin">
            <header className="dashboard__header">
                <div>
                    <p className="dashboard__eyebrow">Administración · Operaciones</p>
                    <h1 className="dashboard__title">Ventas</h1>
                    <p className="dashboard__description">
                        Consulta y supervisa las ventas registradas por todas las tiendas.
                    </p>
                    <p className="sales-admin__date">
                        <IconCalendar size={15} /> {dateLabel(day)} · Hora de Perú
                    </p>
                </div>
                <div className="dashboard__actions">
                    <button className="btn btn--outline" onClick={refresh}>
                        <IconRefresh size={16} /> Actualizar
                    </button>
                </div>
            </header>

            <section className="dashboard__stats">
                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Ventas del período</p>
                        <h3 className="card__value">{stats.count}</h3>
                        <span className="card__trend"><IconShoppingBag size={14} /> Registros encontrados</span>
                    </div>
                </article>
                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Importe total</p>
                        <h3 className="card__value">{currency(stats.total)}</h3>
                        <span className="card__trend"><IconCash size={14} /> Según filtros aplicados</span>
                    </div>
                </article>
                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Ticket promedio</p>
                        <h3 className="card__value">{currency(stats.average)}</h3>
                        <span className="card__trend"><IconTrendingUp size={14} /> Promedio por venta</span>
                    </div>
                </article>
                <article className="card card--stat">
                    <div className="card__content">
                        <p className="card__label">Tiendas con actividad</p>
                        <h3 className="card__value">
                            {new Set(sales.map((sale) => sale.store_id).filter(Boolean)).size}
                        </h3>
                        <span className="card__trend">Dentro del resultado filtrado</span>
                    </div>
                </article>
            </section>

            <section className="card sales-admin__panel">
                <div className="card__header">
                    <div>
                        <h2 className="card__title">Registro de ventas</h2>
                        <p className="card__description">
                            Consulta las operaciones por fecha, tienda, estado y cliente.
                        </p>
                    </div>
                    <span className="sales-admin__count">{sales.length} resultados</span>
                </div>

                <div className="sales-admin__filters">
                    <label className="sales-admin__search">
                        <IconSearch size={17} />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar código, cliente o documento..."
                        />
                    </label>
                    <select
                        value={selectedDay}
                        onChange={(event) => setSelectedDay(event.target.value)}
                        aria-label="Filtrar ventas por fecha"
                    >
                        <option value="today">Hoy</option>
                        <option value="yesterday">Ayer</option>
                    </select>
                    <select value={storeId} onChange={(event) => setStoreId(event.target.value)} aria-label="Filtrar por tienda">
                        <option value="all">Todas las tiendas</option>
                        {stores.map((store) => (
                            <option key={store.id} value={String(store.id)}>{store.name}</option>
                        ))}
                    </select>
                    <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar por estado">
                        <option value="all">Todos los estados</option>
                        {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div className="sales-admin__table-wrap">
                    <table className="sales-admin__table">
                        <thead>
                            <tr>
                                <th>Operación</th>
                                <th>Hora</th>
                                <th>Cliente</th>
                                <th>Tienda</th>
                                <th>Pago</th>
                                <th>Estado</th>
                                <th className="sales-admin__amount">Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="sales-admin__empty">
                                        <IconShoppingBag size={25} />
                                        <strong>No hay ventas que coincidan</strong>
                                        <span>Prueba cambiando los filtros o vuelve a actualizar los datos.</span>
                                    </td>
                                </tr>
                            ) : sales.map((sale) => {
                                const isExpanded = expandedSaleId === sale.id;

                                return (
                                    <Fragment key={sale.id}>
                                        <tr>
                                            <td>
                                                <strong>{saleCode(sale)}</strong>
                                                <small>{sale.id ? String(sale.id).slice(0, 8) : '—'}</small>
                                            </td>
                                            <td>{timeLabel(sale.created_at)}</td>
                                            <td>{sale.customer_name || 'Público general'}</td>
                                            <td>{storeNames.get(String(sale.store_id)) || '—'}</td>
                                            <td>{paymentLabel(sale.payment_type || sale.payment_method)}</td>
                                            <td><span className="sales-admin__status">{statusLabel(saleStatus(sale))}</span></td>
                                            <td className="sales-admin__amount">{currency(saleTotal(sale))}</td>
                                            <td>
                                                <div className="sales-admin__row-actions">
                                                    <button
                                                        type="button"
                                                        className="btn btn--outline btn--sm"
                                                        onClick={() => setExpandedSaleId(isExpanded ? null : sale.id)}
                                                        aria-expanded={isExpanded}
                                                        aria-label={isExpanded ? 'Cerrar detalle' : `Ver más de ${saleCode(sale)}`}
                                                    >
                                                        <IconEye size={15} />
                                                        {isExpanded ? 'Cerrar' : 'Ver más'}
                                                        {isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn--outline btn--sm sales-admin__delete-placeholder"
                                                        disabled
                                                        title="Acción pendiente. No elimina ni oculta ventas."
                                                        aria-label={`Eliminar ${saleCode(sale)} (no disponible)`}
                                                    >
                                                        <IconTrash size={15} /> Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr key={`${sale.id}-details`}>
                                                <td colSpan={8}><SaleDetails sale={sale} /></td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}