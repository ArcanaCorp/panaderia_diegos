import { IconX } from "@tabler/icons-react";
import CompanySettings from "./sections/CompanySettings";
import NotificationsSettings from "./sections/NotificationsSettings";
import PasswordSettings from "./sections/PasswordSettings";
import PaymentsSettings from "./sections/PaymentsSettings";
import ProfileSettings from "./sections/ProfileSettings";
import StoresSettings from "@/features/stores/components/settings/StoresSettings";
import UsersSettings from "./sections/UsersSettings";
import SecuritySettings from "./sections/SecuritySettings";

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

