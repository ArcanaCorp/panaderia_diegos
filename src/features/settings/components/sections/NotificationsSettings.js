'use client';

import { useState } from 'react';

import {
    IconBell,
    IconPackage,
    IconShoppingCart,
    IconToolsKitchen2,
    IconArrowsTransferUp,
    IconUsers,
    IconMail,
    IconDeviceDesktop,
} from '@tabler/icons-react';

export default function NotificationsSettings() {
    const [settings, setSettings] = useState({
        lowStock: true,
        sales: true,
        production: true,
        transfers: true,
        users: false,
        email: false,
        system: true,
    });

    function handleChange(name) {
        setSettings((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    }

    return (
        <div className="settings__notifications">
            <div className="settings__section-header">
                <div>
                    <h3>Notificaciones</h3>
                    <p>
                        Configura las alertas que quieres recibir
                        en el sistema.
                    </p>
                </div>
            </div>

            <div className="settings__notifications-card">
                <div className="settings__notifications-card-header">
                    <div className="settings__notifications-card-icon">
                        <IconBell size={20} />
                    </div>

                    <div>
                        <strong>Alertas del sistema</strong>
                        <span>
                            Recibe avisos sobre eventos importantes
                            de tu empresa.
                        </span>
                    </div>
                </div>

                <div className="settings__notification-list">
                    <NotificationItem
                        icon={<IconPackage size={19} />}
                        title="Stock bajo"
                        description="Recibe una alerta cuando un producto llegue al stock mínimo."
                        checked={settings.lowStock}
                        onChange={() => handleChange('lowStock')}
                    />

                    <NotificationItem
                        icon={<IconShoppingCart size={19} />}
                        title="Nuevas ventas"
                        description="Recibe avisos cuando se registre una nueva venta."
                        checked={settings.sales}
                        onChange={() => handleChange('sales')}
                    />

                    <NotificationItem
                        icon={<IconToolsKitchen2 size={19} />}
                        title="Órdenes de producción"
                        description="Recibe alertas sobre nuevas órdenes y cambios de estado."
                        checked={settings.production}
                        onChange={() => handleChange('production')}
                    />

                    <NotificationItem
                        icon={<IconArrowsTransferUp size={19} />}
                        title="Transferencias"
                        description="Recibe avisos sobre transferencias de productos entre tiendas."
                        checked={settings.transfers}
                        onChange={() => handleChange('transfers')}
                    />

                    <NotificationItem
                        icon={<IconUsers size={19} />}
                        title="Actividad de usuarios"
                        description="Recibe avisos sobre eventos importantes relacionados con usuarios."
                        checked={settings.users}
                        onChange={() => handleChange('users')}
                    />
                </div>
            </div>

            <div className="settings__notifications-card">
                <div className="settings__notifications-card-header">
                    <div className="settings__notifications-card-icon">
                        <IconDeviceDesktop size={20} />
                    </div>

                    <div>
                        <strong>Canales de notificación</strong>
                        <span>
                            Elige dónde quieres recibir tus
                            notificaciones.
                        </span>
                    </div>
                </div>

                <div className="settings__notification-list">
                    <NotificationItem
                        icon={<IconDeviceDesktop size={19} />}
                        title="Notificaciones del sistema"
                        description="Muestra las alertas dentro del ERP."
                        checked={settings.system}
                        onChange={() => handleChange('system')}
                    />

                    <NotificationItem
                        icon={<IconMail size={19} />}
                        title="Correo electrónico"
                        description="Recibe alertas importantes directamente en tu correo."
                        checked={settings.email}
                        onChange={() => handleChange('email')}
                    />
                </div>
            </div>
        </div>
    );
}

function NotificationItem({
    icon,
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <label className="settings__notification-item">
            <div className="settings__notification-info">
                <div className="settings__notification-icon">
                    {icon}
                </div>

                <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                </div>
            </div>

            <div className="settings__switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span />
            </div>
        </label>
    );
}