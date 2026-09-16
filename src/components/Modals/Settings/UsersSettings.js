'use client';

import { useEffect, useState } from 'react';
import {
    IconUsers,
    IconPlus,
    IconUserPlus,
    IconLoader2,
    IconArrowLeft,
    IconShield,
    IconBuildingStore,
    IconCircleCheck,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/libs/supabase';

import {
    getCompanyUsers,
    createCompanyUser,
} from '@/services/users.service';

export default function UsersSettings() {
    const { profile } = useAuth();

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'ventas',
        storeId: '',
        isActive: true,
    });

    useEffect(() => {
        if (profile?.company_id) {
            loadData();
        }
    }, [profile?.company_id]);

    async function loadData() {
        try {
            setLoading(true);
            setError('');

            const [usersData, storesResult] = await Promise.all([
                getCompanyUsers(profile.company_id),

                db
                    .from('stores')
                    .select('id, name, code')
                    .eq('company_id', profile.company_id)
                    .eq('is_active', true)
                    .order('name'),
            ]);

            if (storesResult.error) {
                throw storesResult.error;
            }

            setUsers(usersData);
            setStores(storesResult.data || []);
        } catch (err) {
            setError(
                err.message || 'No se pudieron cargar los usuarios.'
            );
        } finally {
            setLoading(false);
        }
    }

    function openCreateForm() {
        setError('');
        setSuccess('');

        setForm({
            fullName: '',
            email: '',
            password: '',
            role: 'ventas',
            storeId: '',
            isActive: true,
        });

        setShowForm(true);
    }

    function closeCreateForm() {
        if (saving) return;

        setShowForm(false);
        setError('');
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        setError('');
        setSuccess('');

        // Si deja de ser ventas, eliminamos la tienda
        if (name === 'role' && value !== 'ventas') {
            setForm((prev) => ({
                ...prev,
                role: value,
                storeId: '',
            }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            if (form.role === 'ventas' && !form.storeId) {
                throw new Error(
                    'Selecciona una tienda para el usuario de ventas.'
                );
            }

            const result = await createCompanyUser({
                companyId: profile.company_id,
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                role: form.role,
                storeId:
                    form.role === 'ventas'
                        ? form.storeId
                        : null,
                isActive: form.isActive,
            });

            setUsers((prev) =>
                [...prev, result.user].sort((a, b) =>
                    (a.full_name || '').localeCompare(
                        b.full_name || ''
                    )
                )
            );

            setForm({
                fullName: '',
                email: '',
                password: '',
                role: 'ventas',
                storeId: '',
                isActive: true,
            });

            setShowForm(false);
            setSuccess('Usuario creado correctamente.');
        } catch (err) {
            setError(
                err.message || 'No se pudo crear el usuario.'
            );
        } finally {
            setSaving(false);
        }
    }

    function getRoleName(role) {
        const roles = {
            admin: 'Administrador',
            almacen: 'Almacén',
            produccion: 'Producción',
            ventas: 'Ventas',
        };

        return roles[role] || role;
    }

    function getRoleIcon(role) {
        if (role === 'ventas') return <IconBuildingStore size={16} />;
        if (role === 'admin') return <IconShield size={16} />;
        return <IconUsers size={16} />;
    }

    return (
        <div className="settings__users">

            {!showForm ? (
                <>
                    {/* HEADER */}
                    <div className="settings__section-header">
                        <div>
                            <h3>Usuarios y roles</h3>
                            <p>
                                Administra los usuarios y permisos de tu empresa.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openCreateForm}
                        >
                            <IconUserPlus size={18} />
                            Nuevo usuario
                        </button>
                    </div>

                    {/* MENSAJES */}
                    {error && (
                        <div className="settings__message settings__message--error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="settings__message settings__message--success">
                            {success}
                        </div>
                    )}

                    {/* LISTADO */}
                    <div className="settings__users-list">

                        <div className="settings__users-list-header">
                            <div>
                                <strong>
                                    Usuarios de la empresa
                                </strong>

                                <span>
                                    {users.length}{' '}
                                    {users.length === 1
                                        ? 'usuario'
                                        : 'usuarios'}
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="settings__placeholder">
                                <IconLoader2
                                    size={30}
                                    className="spin"
                                />
                                <span>
                                    Cargando usuarios...
                                </span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="settings__empty-users">
                                <div className="settings__empty-users-icon">
                                    <IconUsers size={26} />
                                </div>

                                <strong>
                                    Aún no hay usuarios
                                </strong>

                                <span>
                                    Crea usuarios para asignarles
                                    diferentes funciones dentro de la empresa.
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={openCreateForm}
                                >
                                    <IconPlus size={17} />
                                    Crear usuario
                                </button>
                            </div>
                        ) : (
                            <div className="settings__users-table">

                                {/* CABECERA */}
                                <div className="settings__user-row settings__user-row--header">
                                    <span>Usuario</span>
                                    <span>Rol</span>
                                    <span>Tienda</span>
                                    <span>Estado</span>
                                </div>

                                {users.map((user) => (
                                    <div
                                        className="settings__user-row"
                                        key={user.id}
                                    >
                                        {/* USUARIO */}
                                        <div className="settings__user-info">
                                            <div className="settings__user-avatar">
                                                {user.full_name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || 'U'}
                                            </div>

                                            <div>
                                                <strong>
                                                    {user.full_name ||
                                                        'Sin nombre'}
                                                </strong>

                                                <span>
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ROL */}
                                        <div className="settings__user-role">
                                            <span className="settings__role">
                                                {getRoleIcon(user.role)}
                                                {getRoleName(user.role)}
                                            </span>
                                        </div>

                                        {/* TIENDA */}
                                        <div className="settings__user-store">
                                            {user.role === 'ventas' ? (
                                                user.stores?.name ||
                                                'Sin tienda'
                                            ) : (
                                                '—'
                                            )}
                                        </div>

                                        {/* ESTADO */}
                                        <div>
                                            <span
                                                className={
                                                    user.is_active
                                                        ? 'settings__status settings__status--active'
                                                        : 'settings__status'
                                                }
                                            >
                                                <span className="settings__status-dot" />

                                                {user.is_active
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* HEADER FORMULARIO */}
                    <div className="settings__create-header">

                        <button
                            type="button"
                            className="settings__back-button"
                            onClick={closeCreateForm}
                            disabled={saving}
                        >
                            <IconArrowLeft size={18} />
                            Usuarios
                        </button>

                        <div className="settings__create-heading">
                            <div className="settings__create-icon">
                                <IconUserPlus size={22} />
                            </div>

                            <div>
                                <h3>Nuevo usuario</h3>
                                <p>
                                    Crea una cuenta y asigna sus permisos.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="settings__message settings__message--error">
                            {error}
                        </div>
                    )}

                    {/* FORMULARIO */}
                    <form
                        className="settings__user-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="settings__form-card">

                            <div className="settings__form-card-header">
                                <div>
                                    <strong>
                                        Información del usuario
                                    </strong>

                                    <span>
                                        Datos necesarios para acceder al sistema.
                                    </span>
                                </div>
                            </div>

                            <div className="settings__form-grid">

                                <div className="settings__field">
                                    <label>
                                        Nombre completo
                                    </label>

                                    <input
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Ej. Juan Pérez"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className="settings__field">
                                    <label>
                                        Correo electrónico
                                    </label>

                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="usuario@empresa.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div className="settings__field">
                                    <label>
                                        Contraseña
                                    </label>

                                    <input
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                    />

                                    <small>
                                        Debe tener al menos 8 caracteres.
                                    </small>
                                </div>

                            </div>

                        </div>

                        {/* PERMISOS */}
                        <div className="settings__form-card">

                            <div className="settings__form-card-header">
                                <div>
                                    <strong>
                                        Acceso y permisos
                                    </strong>

                                    <span>
                                        Define qué funciones podrá utilizar.
                                    </span>
                                </div>
                            </div>

                            <div className="settings__form-grid">

                                <div className="settings__field">
                                    <label>
                                        Rol
                                    </label>

                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="admin">
                                            Administrador
                                        </option>

                                        <option value="almacen">
                                            Almacén
                                        </option>

                                        <option value="produccion">
                                            Producción
                                        </option>

                                        <option value="ventas">
                                            Ventas
                                        </option>
                                    </select>

                                    <small>
                                        El rol determina los módulos disponibles.
                                    </small>
                                </div>

                                {form.role === 'ventas' && (
                                    <div className="settings__field">
                                        <label>
                                            Tienda asignada
                                        </label>

                                        <select
                                            name="storeId"
                                            value={form.storeId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Seleccionar tienda
                                            </option>

                                            {stores.map((store) => (
                                                <option
                                                    key={store.id}
                                                    value={store.id}
                                                >
                                                    {store.name}
                                                    {store.code
                                                        ? ` (${store.code})`
                                                        : ''}
                                                </option>
                                            ))}
                                        </select>

                                        <small>
                                            El usuario podrá operar las ventas
                                            de esta tienda.
                                        </small>
                                    </div>
                                )}

                            </div>

                            {/* ESTADO */}
                            <label className="settings__user-active">

                                <div className="settings__user-active-info">
                                    <div className="settings__user-active-icon">
                                        <IconCircleCheck size={19} />
                                    </div>

                                    <div>
                                        <strong>
                                            Usuario activo
                                        </strong>

                                        <span>
                                            Permitirá iniciar sesión y utilizar
                                            el sistema.
                                        </span>
                                    </div>
                                </div>

                                <div className="settings__switch">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={form.isActive}
                                        onChange={handleChange}
                                    />

                                    <span />
                                </div>

                            </label>

                        </div>

                        {/* FOOTER */}
                        <div className="settings__form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeCreateForm}
                                disabled={saving}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <IconLoader2
                                            size={18}
                                            className="spin"
                                        />
                                        Creando usuario...
                                    </>
                                ) : (
                                    <>
                                        <IconUserPlus size={18} />
                                        Crear usuario
                                    </>
                                )}
                            </button>

                        </div>

                    </form>
                </>
            )}

        </div>
    );
}