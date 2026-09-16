export default function Activity({ icon, title, description, amount, type = 'neutral' }) {
    return (
        <div className="dashboard__activity-item">
            <div className={`dashboard__activity-icon dashboard__activity-icon--${type}`}>{icon}</div>
            <div className="dashboard__activity-content">
                <p className="dashboard__activity-title">{title}</p>
                <p className="dashboard__activity-description">{description}</p>
            </div>
            <span className="dashboard__activity-amount">{amount}</span>
        </div>
    );
}