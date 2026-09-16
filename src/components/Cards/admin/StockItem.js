export default function StockItem({ name, category, stock, status }) {
    return (
        <div className="dashboard__stock-item">
            <div className="dashboard__stock-info">
                <p className="dashboard__stock-name">{name}</p>
                <p className="dashboard__stock-category">{category}</p>
            </div>
            <span className="dashboard__stock-quantity">{stock}</span>
            <span className={`badge ${status === 'Crítico' ? 'badge--danger' : 'badge--warning'}`}>{status}</span>
        </div>
    );
}