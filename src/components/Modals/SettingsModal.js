import { IconX } from "@tabler/icons-react";
import CompanySettings from "./Settings/CompanySettings";
import NotificationsSettings from "./Settings/NotificationsSettings";
import PasswordSettings from "./Settings/PasswordSettings";
import PaymentsSettings from "./Settings/PaymentsSettings";
import ProfileSettings from "./Settings/ProfileSettings";
import StoresSettings from "./Settings/StoresSettings";
import UsersSettings from "./Settings/UsersSettings";

export default function SettingsModal({ item, onClose }) {
    if (!item) return null;

    const Icon = item.icon;

    const close = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    return (
        <div className="settings__modal-overlay" onMouseDown={(event) => close(event)}>
            <div className="settings__modal">
                <header className="settings__modal-header">
                    <div className="settings__modal-title-row">
                        <div className="settings__title-icon">
                            <Icon size={18} />
                        </div>

                        <div>
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="settings__modal-close"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <IconX size={18} />
                    </button>
                </header>

                <div className="settings__modal-body">
                    {item.path === 'profile' && (
                        <ProfileSettings />
                    )}

                    {item.path === 'password' && (
                        <PasswordSettings />
                    )}

                    {item.path === 'company' && (
                        <CompanySettings />
                    )}

                    {item.path === 'users' && (
                        <UsersSettings />
                    )}

                    {item.path === 'stores' && (
                        <StoresSettings />
                    )}

                    {item.path === 'payments' && (
                        <PaymentsSettings />
                    )}

                    {item.path === 'notifications' && (
                        <NotificationsSettings />
                    )}

                    {item.path === 'security' && (
                        <SecuritySettings />
                    )}
                </div>
            </div>
        </div>
    );
}