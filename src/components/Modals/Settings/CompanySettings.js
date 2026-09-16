export default function CompanySettings() {
    return (
        <div className="settings__form">
            <div className="settings__field">
                <label>Razón social</label>
                <input type="text" />
            </div>

            <div className="settings__field">
                <label>Nombre comercial</label>
                <input type="text" />
            </div>

            <div className="settings__field">
                <label>RUC</label>
                <input type="text" />
            </div>

            <div className="settings__field">
                <label>Dirección</label>
                <input type="text" />
            </div>

            <div className="settings__field">
                <label>Teléfono</label>
                <input type="tel" />
            </div>

            <div className="settings__field">
                <label>Correo</label>
                <input type="email" />
            </div>

            <div className="settings__modal-actions">
                <button type="button" className="button button--primary">
                    Guardar cambios
                </button>
            </div>
        </div>
    );
}