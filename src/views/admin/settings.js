'use client';

import {
    IconUser,
    IconLock,
    IconUsers,
    IconBuildingStore,
    IconCreditCard,
    IconBell,
    IconChevronRight,
    IconShield,
    IconSettings,
    IconLogout,
    IconBuildingCommunity,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

const settingsGroups = [
    {
        title: 'Cuenta',
        items: [
            {
                icon: IconUser,
                title: 'Mi perfil',
                description: 'Actualiza tus datos personales y de contacto.',
                path: 'profile',
            },
            {
                icon: IconLock,
                title: 'Contraseña',
                description: 'Cambia tu contraseña y protege tu cuenta.',
                path: 'password',
            },
        ],
    },
    {
        title: 'Empresa',
        items: [
            {
                icon: IconBuildingCommunity,
                title: 'Datos de la empresa',
                description: 'Actualiza datos de la empresa y contacto',
                path: 'company',
            },
            {
                icon: IconUsers,
                title: 'Usuarios y roles',
                description: 'Crea usuarios y administra sus permisos.',
                path: 'users',
            },
            {
                icon: IconBuildingStore,
                title: 'Tiendas',
                description: 'Crea y administra las tiendas de la empresa.',
                path: 'stores',
            },
            {
                icon: IconCreditCard,
                title: 'Medios de pago',
                description: 'Configura los métodos de pago disponibles.',
                path: 'payments',
            },
        ],
    },
    {
        title: 'Sistema',
        items: [
            {
                icon: IconBell,
                title: 'Notificaciones',
                description: 'Configura avisos y alertas del sistema.',
                path: 'notifications',
            },
            {
                icon: IconShield,
                title: 'Seguridad',
                description: 'Revisa opciones de seguridad y acceso.',
                path: 'security',
            },
        ],
    },
];

export default function SettingsAdmin() {
    const { profile, role } = useAuth();

    function handleSetting(path) {
        console.log('Abrir configuración:', path);
    }

    return (
        <main className="settings">
            <header className="settings__header">
                <div>
                    <div className="settings__title-row">
                        <div className="settings__title-icon">
                            <IconSettings size={18} />
                        </div>

                        <div>
                            <h1 className="settings__title">Configuración</h1>
                            <p className="settings__description">
                                Administra tu cuenta, empresa y sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <section className="settings__profile card">
                <div className="settings__avatar">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="settings__profile-info">
                    <h2>{profile?.full_name || 'Usuario'}</h2>
                    <p>{profile?.email || 'Sin correo registrado'}</p>
                </div>

                <span className="badge badge--primary">
                    {role || 'Administrador'}
                </span>
            </section>

            <div className="settings__groups">
                {settingsGroups.map((group) => (
                    <section className="settings__group" key={group.title}>
                        <div className="settings__group-header">
                            <h2>{group.title}</h2>
                        </div>

                        <div className="settings__list card">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        type="button"
                                        className="settings__item"
                                        key={item.path}
                                        onClick={() => handleSetting(item.path)}
                                    >
                                        <span className="settings__item-icon">
                                            <Icon size={17} />
                                        </span>

                                        <span className="settings__item-content">
                                            <span className="settings__item-title">
                                                {item.title}
                                            </span>

                                            <span className="settings__item-description">
                                                {item.description}
                                            </span>
                                        </span>

                                        <IconChevronRight
                                            className="settings__item-arrow"
                                            size={17}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}