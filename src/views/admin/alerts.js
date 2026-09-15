'use client';

import {
    IconBell,
    IconAlertTriangle,
    IconInfoCircle,
    IconCircleCheck,
    IconPackage,
    IconBuildingStore,
    IconUserPlus,
    IconShoppingCart,
    IconShieldCheck,
    IconFileDescription,
    IconDotsVertical,
    IconCheck,
    IconEye,
    IconFilter,
    IconClock,
} from '@tabler/icons-react';

import { useState } from 'react';

const notifications = [
    {
        id: 1,
        type: 'warning',
        title: 'Stock bajo',
        description: 'La mantequilla tiene solo 4 unidades disponibles.',
        time: 'Hace 8 min',
        read: false,
        icon: IconPackage,
    },
    {
        id: 2,
        type: 'info',
        title: 'Nueva venta',
        description: 'Se registró la venta #V-00482 en Tienda Principal.',
        time: 'Hace 15 min',
        read: false,
        icon: IconShoppingCart,
    },
    {
        id: 3,
        type: 'success',
        title: 'Transferencia completada',
        description: 'Se enviaron 100 unidades a Tienda 2.',
        time: 'Hace 32 min',
        read: true,
        icon: IconCircleCheck,
    },
    {
        id: 4,
        type: 'info',
        title: 'Nuevo usuario',
        description: 'Se creó el usuario María Quispe.',
        time: 'Hace 1 h',
        read: true,
        icon: IconUserPlus,
    },
    {
        id: 5,
        type: 'warning',
        title: 'Tienda cerrada',
        description: 'Tienda 3 cerró operaciones.',
        time: 'Hace 2 h',
        read: true,
        icon: IconBuildingStore,
    },
];

const auditLogs = [
    {
        id: 1,
        user: 'Franco Pérez',
        action: 'Creó un nuevo usuario',
        module: 'Usuarios',
        date: '15 Sep 2026 · 14:12',
        ip: '192.168.1.10',
    },
    {
        id: 2,
        user: 'Carlos Ramos',
        action: 'Registró una venta',
        module: 'Ventas',
        date: '15 Sep 2026 · 14:05',
        ip: '192.168.1.15',
    },
    {
        id: 3,
        user: 'Franco Pérez',
        action: 'Actualizó un producto',
        module: 'Inventario',
        date: '15 Sep 2026 · 13:48',
        ip: '192.168.1.10',
    },
    {
        id: 4,
        user: 'Ana Torres',
        action: 'Realizó una transferencia',
        module: 'Tiendas',
        date: '15 Sep 2026 · 13:30',
        ip: '192.168.1.20',
    },
];

export default function AlertsAdmin() {
    const [activeTab, setActiveTab] = useState('all');

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab === 'unread') return !notification.read;
        if (activeTab === 'alerts') {
            return (
                notification.type === 'warning'
            );
        }

        return true;
    });

    return (
        <main className="alerts">
            {/* Header */}
            <header className="alerts__header">
                <div className="alerts__title-row">
                    <div className="alerts__title-icon">
                        <IconBell size={18} />
                    </div>

                    <div>
                        <h1 className="alerts__title">
                            Alertas y actividad
                        </h1>

                        <p className="alerts__description">
                            Notificaciones, alertas y registro de actividad del sistema.
                        </p>
                    </div>
                </div>

                <div className="alerts__header-actions">
                    <button className="btn btn--outline btn--sm">
                        <IconCheck size={15} />
                        Marcar todo como leído
                    </button>

                    <button className="btn btn--icon btn--ghost btn--sm">
                        <IconDotsVertical size={17} />
                    </button>
                </div>
            </header>

            {/* Stats */}
            <section className="alerts__stats">
                <div className="card alerts__stat">
                    <span className="alerts__stat-icon alerts__stat-icon--warning">
                        <IconAlertTriangle size={16} />
                    </span>

                    <div>
                        <span>Alertas activas</span>
                        <strong>3</strong>
                    </div>
                </div>

                <div className="card alerts__stat">
                    <span className="alerts__stat-icon alerts__stat-icon--info">
                        <IconBell size={16} />
                    </span>

                    <div>
                        <span>No leídas</span>
                        <strong>{unreadCount}</strong>
                    </div>
                </div>

                <div className="card alerts__stat">
                    <span className="alerts__stat-icon">
                        <IconFileDescription size={16} />
                    </span>

                    <div>
                        <span>Actividades hoy</span>
                        <strong>48</strong>
                    </div>
                </div>

                <div className="card alerts__stat">
                    <span className="alerts__stat-icon alerts__stat-icon--success">
                        <IconShieldCheck size={16} />
                    </span>

                    <div>
                        <span>Auditorías hoy</span>
                        <strong>26</strong>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="alerts__tabs">
                <button
                    className={`alerts__tab ${
                        activeTab === 'all'
                            ? 'alerts__tab--active'
                            : ''
                    }`}
                    onClick={() => setActiveTab('all')}
                >
                    Todas
                </button>

                <button
                    className={`alerts__tab ${
                        activeTab === 'unread'
                            ? 'alerts__tab--active'
                            : ''
                    }`}
                    onClick={() => setActiveTab('unread')}
                >
                    No leídas
                    {unreadCount > 0 && (
                        <span>{unreadCount}</span>
                    )}
                </button>

                <button
                    className={`alerts__tab ${
                        activeTab === 'alerts'
                            ? 'alerts__tab--active'
                            : ''
                    }`}
                    onClick={() => setActiveTab('alerts')}
                >
                    Alertas
                </button>

                <button
                    className={`alerts__tab ${
                        activeTab === 'activity'
                            ? 'alerts__tab--active'
                            : ''
                    }`}
                    onClick={() => setActiveTab('activity')}
                >
                    Actividad
                </button>

                <button
                    className={`alerts__tab ${
                        activeTab === 'audit'
                            ? 'alerts__tab--active'
                            : ''
                    }`}
                    onClick={() => setActiveTab('audit')}
                >
                    Auditoría
                </button>
            </div>

            {/* Notifications */}
            {activeTab !== 'audit' && (
                <section className="card alerts__panel">
                    <div className="alerts__panel-header">
                        <div>
                            <h2>Notificaciones</h2>
                            <p>
                                Actividad y eventos recientes del sistema.
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--sm">
                            <IconFilter size={15} />
                            Filtrar
                        </button>
                    </div>

                    <div className="alerts__list">
                        {filteredNotifications.map((notification) => {
                            const Icon = notification.icon;

                            return (
                                <div
                                    className={`alerts__item ${
                                        !notification.read
                                            ? 'alerts__item--unread'
                                            : ''
                                    }`}
                                    key={notification.id}
                                >
                                    <div
                                        className={`alerts__item-icon alerts__item-icon--${notification.type}`}
                                    >
                                        <Icon size={17} />
                                    </div>

                                    <div className="alerts__item-content">
                                        <div className="alerts__item-title">
                                            <strong>
                                                {notification.title}
                                            </strong>

                                            {!notification.read && (
                                                <span className="alerts__unread-dot" />
                                            )}
                                        </div>

                                        <p>
                                            {notification.description}
                                        </p>

                                        <span className="alerts__item-time">
                                            <IconClock size={12} />
                                            {notification.time}
                                        </span>
                                    </div>

                                    <button className="btn btn--icon btn--ghost btn--sm">
                                        <IconEye size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Audit */}
            {activeTab === 'audit' && (
                <section className="card alerts__panel">
                    <div className="alerts__panel-header">
                        <div>
                            <h2>Auditoría</h2>
                            <p>
                                Registro de acciones realizadas por los usuarios.
                            </p>
                        </div>

                        <div className="alerts__audit-actions">
                            <button className="btn btn--outline btn--sm">
                                <IconFilter size={15} />
                                Filtrar
                            </button>

                            <button className="btn btn--ghost btn--sm">
                                Exportar
                            </button>
                        </div>
                    </div>

                    <div className="alerts__audit-table-wrapper">
                        <table className="alerts__audit-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>Módulo</th>
                                    <th>Fecha</th>
                                    <th>IP</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {auditLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <strong>{log.user}</strong>
                                        </td>

                                        <td>{log.action}</td>

                                        <td>
                                            <span className="badge badge--neutral">
                                                {log.module}
                                            </span>
                                        </td>

                                        <td>{log.date}</td>

                                        <td className="alerts__ip">
                                            {log.ip}
                                        </td>

                                        <td>
                                            <button className="btn btn--icon btn--ghost btn--sm">
                                                <IconEye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
}