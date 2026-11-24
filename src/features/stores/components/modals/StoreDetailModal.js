'use client';

import { IconBuildingStore, IconClock, IconMail, IconMapPin, IconPhone, IconUser, IconUsers, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { getStoreSalesUsers } from '@/services/stores.service';
import { useAuth } from '@/context/AuthContext';

function formatTime(time) {
    if (!time) return '—';

    return String(time).slice(0, 5);
}

function getInitials(name) {
    if (!name) return 'U';

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function StoreDetailModal({ store, onClose }) {
    
    const { profile } = useAuth();

    const [salesUsers, setSalesUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSalesUsers();
    }, [store?.id]);

    async function loadSalesUsers() {
        if (!store?.id) return;

        try {
            setLoadingUsers(true);
            setError('');

            const data = await getStoreSalesUsers(
                store.id,
                profile?.company_id || store.company_id
            );

            setSalesUsers(data);
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                'No se pudieron cargar los usuarios de ventas.'
            );
        } finally {
            setLoadingUsers(false);
        }
    }

    if (!store) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal modal--lg">

                {/* HEADER */}
                <div className="modal__header">
                    <div className="modal__title-group">
                        <div className="modal__icon">
                            <IconBuildingStore size={20} />
                        </div>

                        <div>
                            <h2 className="modal__title">
                                {store.name}
                            </h2>

                            <p className="modal__subtitle">
                                Información y personal asignado
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                    >
                        <IconX size={20} />
                    </button>
                </div>

                {/* BODY */}
                <div className="modal__body">

                    {/* INFORMACIÓN */}
                    <section className="store-detail__section">

                        <div className="store-detail__section-header">
                            <div>
                                <h3>
                                    Información de la tienda
                                </h3>

                                <p>
                                    Datos generales y horario de atención.
                                </p>
                            </div>

                            <span
                                className={
                                    store.is_active
                                        ? 'store-detail__status store-detail__status--active'
                                        : 'store-detail__status store-detail__status--inactive'
                                }
                            >
                                {store.is_active
                                    ? 'Activa'
                                    : 'Inactiva'}
                            </span>
                        </div>

                        <div className="store-detail__info-grid">

                            <div className="store-detail__info">
                                <div className="store-detail__info-icon">
                                    <IconBuildingStore size={18} />
                                </div>

                                <div>
                                    <span>Nombre</span>
                                    <strong>
                                        {store.name || '—'}
                                    </strong>
                                </div>
                            </div>

                            <div className="store-detail__info">
                                <div className="store-detail__info-icon">
                                    <IconBuildingStore size={18} />
                                </div>

                                <div>
                                    <span>Código</span>
                                    <strong>
                                        {store.code || '—'}
                                    </strong>
                                </div>
                            </div>

                            <div className="store-detail__info">
                                <div className="store-detail__info-icon">
                                    <IconMapPin size={18} />
                                </div>

                                <div>
                                    <span>Dirección</span>
                                    <strong>
                                        {store.address || 'Sin dirección registrada'}
                                    </strong>
                                </div>
                            </div>

                            <div className="store-detail__info">
                                <div className="store-detail__info-icon">
                                    <IconPhone size={18} />
                                </div>

                                <div>
                                    <span>Teléfono</span>
                                    <strong>
                                        {store.phone || '—'}
                                    </strong>
                                </div>
                            </div>

                            <div className="store-detail__info">
                                <div className="store-detail__info-icon">
                                    <IconClock size={18} />
                                </div>

                                <div>
                                    <span>Horario</span>
                                    <strong>
                                        {formatTime(store.opening_time)}
                                        {' — '}
                                        {formatTime(store.closing_time)}
                                    </strong>
                                </div>
                            </div>

                            <div className="store-detail__info">
                                <div className="store-detail__info-icon">
                                    <IconUser size={18} />
                                </div>

                                <div>
                                    <span>Tipo</span>
                                    <strong>
                                        {store.is_main
                                            ? 'Tienda principal'
                                            : 'Sucursal'}
                                    </strong>
                                </div>
                            </div>

                        </div>

                    </section>

                    {/* PERSONAL DE VENTAS */}
                    <section className="store-detail__section">

                        <div className="store-detail__section-header">
                            <div>
                                <h3>
                                    Personal de ventas
                                </h3>

                                <p>
                                    Usuarios asignados a esta tienda.
                                </p>
                            </div>

                            <div className="store-detail__users-count">
                                <IconUsers size={16} />
                                <strong>
                                    {salesUsers.length}
                                </strong>
                            </div>
                        </div>

                        {error && (
                            <div className="modal__error">
                                {error}
                            </div>
                        )}

                        {loadingUsers ? (
                            <div className="store-detail__empty">
                                <IconUsers size={30} />

                                <p>
                                    Cargando personal...
                                </p>
                            </div>
                        ) : salesUsers.length === 0 ? (
                            <div className="store-detail__empty">
                                <IconUsers size={32} />

                                <strong>
                                    No hay personal de ventas asignado
                                </strong>

                                <p>
                                    Los usuarios con rol ventas vinculados
                                    a esta tienda aparecerán aquí.
                                </p>
                            </div>
                        ) : (
                            <div className="store-detail__users">

                                {salesUsers.map((user) => (
                                    <div
                                        className="store-detail__user"
                                        key={user.id}
                                    >

                                        <div className="store-detail__avatar">
                                            {getInitials(user.full_name)}
                                        </div>

                                        <div className="store-detail__user-info">

                                            <strong>
                                                {user.full_name ||
                                                    'Usuario sin nombre'}
                                            </strong>

                                            <div className="store-detail__user-meta">

                                                {user.email && (
                                                    <span>
                                                        <IconMail size={14} />
                                                        {user.email}
                                                    </span>
                                                )}

                                                {user.phone && (
                                                    <span>
                                                        <IconPhone size={14} />
                                                        {user.phone}
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                        <span
                                            className={
                                                user.is_active
                                                    ? 'store-detail__user-status store-detail__user-status--active'
                                                    : 'store-detail__user-status store-detail__user-status--inactive'
                                            }
                                        >
                                            {user.is_active
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </span>

                                    </div>
                                ))}

                            </div>
                        )}

                    </section>

                </div>

                {/* FOOTER */}
                <div className="modal__footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}