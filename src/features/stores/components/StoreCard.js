import { IconBuildingStore, IconChevronRight } from "@tabler/icons-react";

export default function StoreCard ({ store, handleViewStore }) {

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

    const open = isStoreOpen(store);

    return (
        <article className="card stores__card">

            <div className="stores__card-header">
                <div className="stores__card-store">
                    <div className="stores__card-icon">
                        <IconBuildingStore size={18} />
                    </div>
                    <div>
                        <h3>{store.name}</h3>
                        <span>{store.code}{' · '}{store.address || 'Sin dirección'}</span>
                    </div>
                </div>
            </div>

            <div className="stores__status">
                <span className={`badge ${open ? 'badge--success' : 'badge--neutral'}`}>{open ? 'Abierta' : 'Cerrada'}</span>
                <span className={`badge ${store.is_active ? 'badge--primary' : 'badge--neutral'}`}>{store.is_active ? 'Activa' : 'Inactiva'}</span>
            </div>

            <div className="stores__metrics">
                <div>
                    <span>Ventas hoy</span>
                    <strong>S/ {formatCurrency(store.sales)}</strong>
                </div>
                <div>
                    <span>Ventas</span>
                    <strong>{store.sales_count}</strong>
                </div>
                <div>
                    <span>Stock</span>
                    <strong>{formatNumber(store.stock)}</strong>
                </div>
                <div>
                    <span>Stock bajo</span>
                    <strong className="stores__metric-danger">{store.low_stock}</strong>
                </div>
            </div>

            <div className="stores__card-footer">
                <span> Última venta:{' '} {formatLastSale(store.last_sale)}</span>
                <button className="btn btn--ghost btn--sm" onClick={handleViewStore}>Ver tienda <IconChevronRight size={15} /></button>
            </div>

        </article>
    )
}