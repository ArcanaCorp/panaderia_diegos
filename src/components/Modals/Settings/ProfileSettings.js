import { useAuth } from "@/context/AuthContext";

export default function ProfileSettings() {
    const { profile } = useAuth();

    return (
        <div className="settings__form">
            <div className="settings__field">
                <label>Nombre completo</label>
                <input
                    type="text"
                    defaultValue={profile?.full_name || ''}
                />
            </div>

            <div className="settings__field">
                <label>Correo electrónico</label>
                <input
                    type="email"
                    defaultValue={profile?.email || ''}
                    disabled
                />
            </div>

            <div className="settings__field">
                <label>Teléfono</label>
                <input
                    type="tel"
                    defaultValue={profile?.phone || ''}
                />
            </div>

            <div className="settings__modal-actions">
                <button type="button" className="btn btn-primary">
                    Guardar cambios
                </button>
            </div>
        </div>
    );
}