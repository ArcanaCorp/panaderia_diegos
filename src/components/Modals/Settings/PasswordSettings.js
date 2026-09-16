export default function PasswordSettings() {
    return (
        <div className="settings__form">
            <div className="settings__field">
                <label>Contraseña actual</label>
                <input type="password" />
            </div>

            <div className="settings__field">
                <label>Nueva contraseña</label>
                <input type="password" />
            </div>

            <div className="settings__field">
                <label>Confirmar nueva contraseña</label>
                <input type="password" />
            </div>

            <div className="settings__modal-actions">
                <button type="button" className="button button--primary">
                    Cambiar contraseña
                </button>
            </div>
        </div>
    );
}