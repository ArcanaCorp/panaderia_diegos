'use client';

import {
    IconShield,
    IconLock,
    IconUser,
    IconHistory,
    IconCheck,
    IconAlertCircle,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

export default function SecuritySettings() {
    const { profile } = useAuth();

    return (
        <div className="settings__security">
            <div className="settings__section-header">
                <div>
                    <h3>Seguridad</h3>
                    <p>
                        Revisa la seguridad y el acceso de tu cuenta.
                    </p>
                </div>
            </div>

            {/* ESTADO DE LA CUENTA */}
            <div className="settings__security-card">
                <div className="settings__security-card-header">
                    <div className="settings__security-card-icon">
                        <IconShield size={20} />
                    </div>

                    <div>
                        <strong>Estado de seguridad</strong>
                        <span>
                            Información general sobre el acceso de tu cuenta.
                        </span>
                    </div>
                </div>

                <div className="settings__security-status">
                    <div className="settings__security-status-icon">
                        <IconCheck size={19} />
                    </div>

                    <div>
                        <strong>Cuenta activa</strong>
                        <span>
                            Tu cuenta puede acceder al sistema.
                        </span>
                    </div>

                    <span className="settings__security-badge">
                        Activa
                    </span>
                </div>
            </div>

            {/* INFORMACIÓN DE ACCESO */}
            <div className="settings__security-card">
                <div className="settings__security-card-header">
                    <div className="settings__security-card-icon">
                        <IconUser size={20} />
                    </div>

                    <div>
                        <strong>Información de acceso</strong>
                        <span>
                            Datos relacionados con tu cuenta dentro del sistema.
                        </span>
                    </div>
                </div>

                <div className="settings__security-info">
                    <div className="settings__security-info-item">
                        <span>Correo electrónico</span>
                        <strong>
                            {profile?.email || 'No disponible'}
                        </strong>
                    </div>

                    <div className="settings__security-info-item">
                        <span>Rol</span>
                        <strong>
                            {getRoleName(profile?.role)}
                        </strong>
                    </div>

                    <div className="settings__security-info-item">
                        <span>Estado</span>

                        <strong className="settings__security-active">
                            <span />
                            Activo
                        </strong>
                    </div>
                </div>
            </div>

            {/* CONTRASEÑA */}
            <div className="settings__security-card">
                <div className="settings__security-card-header">
                    <div className="settings__security-card-icon">
                        <IconLock size={20} />
                    </div>

                    <div>
                        <strong>Contraseña</strong>
                        <span>
                            Mantén protegida tu cuenta utilizando una
                            contraseña segura.
                        </span>
                    </div>
                </div>

                <div className="settings__security-action">
                    <div>
                        <strong>Contraseña de acceso</strong>

                        <span>
                            Puedes cambiar tu contraseña desde la sección
                            correspondiente.
                        </span>
                    </div>

                    <span className="settings__security-protected">
                        <IconCheck size={15} />
                        Protegida
                    </span>
                </div>
            </div>

            {/* ACTIVIDAD */}
            <div className="settings__security-card">
                <div className="settings__security-card-header">
                    <div className="settings__security-card-icon">
                        <IconHistory size={20} />
                    </div>

                    <div>
                        <strong>Actividad de seguridad</strong>
                        <span>
                            Registro de acciones importantes realizadas
                            en la cuenta.
                        </span>
                    </div>
                </div>

                <div className="settings__security-empty">
                    <div className="settings__security-empty-icon">
                        <IconHistory size={22} />
                    </div>

                    <strong>
                        Historial de actividad
                    </strong>

                    <span>
                        Aquí podrás revisar los accesos y acciones
                        importantes realizadas con tu cuenta.
                    </span>
                </div>
            </div>

            {/* AVISO */}
            <div className="settings__security-notice">
                <IconAlertCircle size={18} />

                <span>
                    Si detectas una actividad que no reconoces, cambia
                    inmediatamente tu contraseña y revisa los accesos
                    de tu cuenta.
                </span>
            </div>
        </div>
    );
}

function getRoleName(role) {
    const roles = {
        admin: 'Administrador',
        almacen: 'Almacén',
        produccion: 'Producción',
        ventas: 'Ventas',
    };

    return roles[role] || 'Sin rol';
}