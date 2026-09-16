'use client';

import {
    IconBell,
    IconAlertTriangle,
    IconInfoCircle,
    IconCircleCheck,
    IconCircleX,
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
    IconRefresh,
} from '@tabler/icons-react';

import { useMemo, useState } from 'react';
import { useAdminAlerts } from '@/hooks/useAdminAlerts';

function getNotificationIcon(type) {
    switch (type) {
        case 'warning':
        case 'alert':
            return IconAlertTriangle;

        case 'error':
            return IconCircleX;

        case 'success':
            return IconCircleCheck;

        case 'info':
        default:
            return IconInfoCircle;
    }
}

function getNotificationType(type) {
    switch (type) {
        case 'warning':
        case 'alert':
            return 'warning';

        case 'error':
            return 'error';

        case 'success':
            return 'success';

        case 'info':
        default:
            return 'info';
    }
}

function formatRelativeTime(date) {
    if (!date) return '';

    const created = new Date(date);
    const now = new Date();

    const diff = now.getTime() - created.getTime();

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
        return 'Hace un momento';
    }

    if (minutes < 60) {
        return `Hace ${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `Hace ${hours} h`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }

    return created.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatDate(date) {
    if (!date) return '-';

    return new Date(date).toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AlertsAdmin() {
    const {
        notifications,
        auditLogs,
        stats,
        loading,
        error,
        refresh,
    } = useAdminAlerts();

    const [activeTab, setActiveTab] = useState('all');

    /*
     * =========================================
     * NOTIFICACIONES FILTRADAS
     * =========================================
     */

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'unread') {
            return notifications.filter(
                (notification) => !notification.is_read
            );
        }

        if (activeTab === 'alerts') {
            return notifications.filter((notification) =>
                ['warning', 'alert', 'error'].includes(
                    notification.type
                )
            );
        }

        if (activeTab === 'activity') {
            return notifications.filter((notification) =>
                ['info', 'success'].includes(
                    notification.type
                )
            );
        }

        return notifications;
    }, [notifications, activeTab]);

    /*
     * =========================================
     * MARCAR COMO LEÍDO
     * =========================================
     */

    async function handleMarkAsRead(notificationId) {
        // Lo conectaremos con el RPC de notificaciones.
        console.log(
            'Marcar como leída:',
            notificationId
        );
    }

    async function handleMarkAllAsRead() {
        // Lo conectaremos con el RPC correspondiente.
        console.log('Marcar todas como leídas');
    }

    /*
     * =========================================
     * LOADING
     * =========================================
     */

    if (loading) {
        return (
            <main className="alerts">
                <div className="card">
                    Cargando alertas y actividad...
                </div>
            </main>
        );
    }

    /*
     * =========================================
     * ERROR
     * =========================================
     */

    if (error) {
        return (
            <main className="alerts">
                <div className="card">
                    <strong>
                        No se pudieron cargar las alertas
                    </strong>

                    <p>{error}</p>

                    <button
                        className="btn btn--primary"
                        onClick={refresh}
                    >
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="alerts">

            {/* =========================================
                HEADER
            ========================================= */}

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
                            Notificaciones, alertas y registro
                            de actividad del sistema.
                        </p>
                    </div>

                </div>

                <div className="alerts__header-actions">

                    {stats.unread > 0 && (
                        <button
                            className="btn btn--outline btn--sm"
                            onClick={handleMarkAllAsRead}
                        >
                            <IconCheck size={15} />
                            Marcar todo como leído
                        </button>
                    )}

                    <button
                        className="btn btn--icon btn--ghost btn--sm"
                        onClick={refresh}
                        title="Actualizar"
                    >
                        <IconRefresh size={17} />
                    </button>

                </div>

            </header>

            {/* =========================================
                STATS
            ========================================= */}

            <section className="alerts__stats">

                <div className="card alerts__stat">

                    <span className="alerts__stat-icon alerts__stat-icon--warning">
                        <IconAlertTriangle size={16} />
                    </span>

                    <div>
                        <span>Alertas activas</span>

                        <strong>
                            {stats.active_alerts}
                        </strong>
                    </div>

                </div>

                <div className="card alerts__stat">

                    <span className="alerts__stat-icon alerts__stat-icon--info">
                        <IconBell size={16} />
                    </span>

                    <div>
                        <span>No leídas</span>

                        <strong>
                            {stats.unread}
                        </strong>
                    </div>

                </div>

                <div className="card alerts__stat">

                    <span className="alerts__stat-icon">
                        <IconFileDescription size={16} />
                    </span>

                    <div>
                        <span>Actividades hoy</span>

                        <strong>
                            {stats.activities_today}
                        </strong>
                    </div>

                </div>

                <div className="card alerts__stat">

                    <span className="alerts__stat-icon alerts__stat-icon--success">
                        <IconShieldCheck size={16} />
                    </span>

                    <div>
                        <span>Auditorías hoy</span>

                        <strong>
                            {stats.audits_today}
                        </strong>
                    </div>

                </div>

            </section>

            {/* =========================================
                TABS
            ========================================= */}

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

                    {stats.unread > 0 && (
                        <span>
                            {stats.unread}
                        </span>
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

            {/* =========================================
                NOTIFICACIONES
            ========================================= */}

            {activeTab !== 'audit' && (
                <section className="card alerts__panel">

                    <div className="alerts__panel-header">

                        <div>
                            <h2>
                                Notificaciones
                            </h2>

                            <p>
                                Alertas y eventos recientes
                                del sistema.
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--sm">
                            <IconFilter size={15} />
                            Filtrar
                        </button>

                    </div>

                    <div className="alerts__list">

                        {filteredNotifications.map(
                            (notification) => {

                                const Icon =
                                    getNotificationIcon(
                                        notification.type
                                    );

                                const visualType =
                                    getNotificationType(
                                        notification.type
                                    );

                                return (
                                    <div
                                        className={`alerts__item ${
                                            !notification.is_read
                                                ? 'alerts__item--unread'
                                                : ''
                                        }`}
                                        key={notification.id}
                                    >

                                        <div
                                            className={`alerts__item-icon alerts__item-icon--${visualType}`}
                                        >
                                            <Icon size={17} />
                                        </div>

                                        <div className="alerts__item-content">

                                            <div className="alerts__item-title">

                                                <strong>
                                                    {notification.title}
                                                </strong>

                                                {!notification.is_read && (
                                                    <span className="alerts__unread-dot" />
                                                )}

                                            </div>

                                            <p>
                                                {notification.message}
                                            </p>

                                            <span className="alerts__item-time">
                                                <IconClock size={12} />

                                                {formatRelativeTime(
                                                    notification.created_at
                                                )}
                                            </span>

                                        </div>

                                        {!notification.is_read ? (
                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Marcar como leída"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id
                                                    )
                                                }
                                            >
                                                <IconCheck size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Ver"
                                            >
                                                <IconEye size={16} />
                                            </button>
                                        )}

                                    </div>
                                );
                            }
                        )}

                        {filteredNotifications.length === 0 && (
                            <div className="alerts__empty">
                                <IconBell size={24} />

                                <strong>
                                    No hay notificaciones
                                </strong>

                                <span>
                                    No existen eventos para este filtro.
                                </span>
                            </div>
                        )}

                    </div>

                </section>
            )}

            {/* =========================================
                AUDITORÍA
            ========================================= */}

            {activeTab === 'audit' && (
                <section className="card alerts__panel">

                    <div className="alerts__panel-header">

                        <div>
                            <h2>
                                Auditoría
                            </h2>

                            <p>
                                Registro completo de acciones
                                realizadas por los usuarios.
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
                                    <th>Entidad</th>
                                    <th>Fecha</th>
                                    <th>IP</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {auditLogs.map((log) => (
                                    <tr key={log.id}>

                                        <td>
                                            <strong>
                                                {log.user}
                                            </strong>
                                        </td>

                                        <td>
                                            {log.description ||
                                                log.action ||
                                                '-'}
                                        </td>

                                        <td>
                                            <span className="badge badge--neutral">
                                                {log.module ||
                                                    'Sistema'}
                                            </span>
                                        </td>

                                        <td>
                                            {log.entity || '-'}
                                        </td>

                                        <td>
                                            {formatDate(
                                                log.created_at
                                            )}
                                        </td>

                                        <td className="alerts__ip">
                                            {log.ip || '-'}
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn--icon btn--ghost btn--sm"
                                                title="Ver detalle"
                                            >
                                                <IconEye size={16} />
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                        {auditLogs.length === 0 && (
                            <div className="alerts__empty">
                                <IconShieldCheck size={24} />

                                <strong>
                                    No hay registros de auditoría
                                </strong>

                                <span>
                                    Todavía no se han registrado
                                    acciones.
                                </span>
                            </div>
                        )}

                    </div>

                </section>
            )}

        </main>
    );
}