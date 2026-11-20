import { IconShoppingCart, IconClipboardList, IconTrendingUp, IconAlertTriangle } from "@tabler/icons-react";

export default function StatCard () {
    return (
        <article className="card card--stat">
            <div className="card__content">
                <p className="card__label">Ventas de hoy</p>
                <p className="card__value">{formatCurrency(kpis.today_sales)}</p>
            </div>
            <div className="card__icon"><IconShoppingCart size={16} /></div>
        </article>
    )
}