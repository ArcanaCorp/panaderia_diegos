'use client';

import { useEffect, useState } from 'react';

import {
    IconBuildingStore,
    IconPlus,
    IconArrowLeft,
    IconLoader2,
    IconMapPin,
    IconPhone,
    IconClock,
    IconUser,
    IconStar,
    IconCircleCheck,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

import {
    getCompanyStores,
    getStoreManagers,
    createStore,
} from '@/services/stores.service';

export default function StoresSettings() {
    const { profile } = useAuth();

    const [stores, setStores] = useState([]);
    const [managers, setManagers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        name: '',
        code: '',
        address: '',
        phone: '',
        managerId: '',
        isMain: false,
        isActive: true,
        openingTime: '',
        closingTime: '',
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

            const [storesData, managersData] = await Promise.all([
                getCompanyStores(profile.company_id),
                getStoreManagers(profile.company_id),
            ]);

            setStores(storesData);
            setManagers(managersData);
        } catch (err) {
            setError(
                err.message || 'No se pudieron cargar las tiendas.'
            );
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setForm({
            name: '',
            code: '',
            address: '',
            phone: '',
            managerId: '',
            isMain: false,
            isActive: true,
            openingTime: '',
            closingTime: '',
        });
    }

    function openCreateForm() {
        resetForm();
        setError('');
        setSuccess('');
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
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const newStore = await createStore({
                companyId: profile.company_id,
                name: form.name,
                code: form.code,
                address: form.address,
                phone: form.phone,
                managerId: form.managerId,
                isMain: form.isMain,
                isActive: form.isActive,
                openingTime: form.openingTime,
                closingTime: form.closingTime,
            });

            setStores((prev) =>
                [...prev, newStore].sort((a, b) => {
                    if (a.is_main !== b.is_main) {
                        return a.is_main ? -1 : 1;
                    }

                    return (a.name || '').localeCompare(
                        b.name || ''
                    );
                })
            );

            resetForm();
            setShowForm(false);
            setSuccess('Tienda creada correctamente.');
        } catch (err) {
            setError(
                err.message || 'No se pudo crear la tienda.'
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="settings__stores">

            {!showForm ? (
                <>
                    <div className="settings__section-header">
                        <div>
                            <h3>Tiendas</h3>
                            <p>
                                Administra las tiendas y puntos de venta de tu empresa.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openCreateForm}
                        >
                            <IconPlus size={18} />
                            Nueva tienda
                        </button>
                    </div>

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

                    <div className="settings__stores-list">
                        <div className="settings__stores-list-header">
                            <div>
                                <strong>Tiendas de la empresa</strong>
                                <span>
                                    {stores.length}{' '}
                                    {stores.length === 1
                                        ? 'tienda'
                                        : 'tiendas'}
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
                                    Cargando tiendas...
                                </span>
                            </div>
                        ) : stores.length === 0 ? (
                            <div className="settings__empty-stores">
                                <div className="settings__empty-stores-icon">
                                    <IconBuildingStore size={27} />
                                </div>

                                <strong>Aún no hay tiendas</strong>

                                <span>
                                    Crea la primera tienda para comenzar a
                                    gestionar tus puntos de venta.
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={openCreateForm}
                                >
                                    <IconPlus size={17} />
                                    Crear tienda
                                </button>
                            </div>
                        ) : (
                            <div className="settings__stores-grid">
                                {stores.map((store) => (
                                    <div
                                        className="settings__store-card"
                                        key={store.id}
                                    >
                                        <div className="settings__store-card-top">
                                            <div className="settings__store-icon">
                                                <IconBuildingStore size={21} />
                                            </div>

                                            <div className="settings__store-title">
                                                <strong>
                                                    {store.name}
                                                </strong>

                                                {store.code && (
                                                    <span>
                                                        Código: {store.code}
                                                    </span>
                                                )}
                                            </div>

                                            {store.is_main && (
                                                <span className="settings__store-main">
                                                    <IconStar size={13} />
                                                    Principal
                                                </span>
                                            )}
                                        </div>

                                        <div className="settings__store-info">
                                            {store.address && (
                                                <div>
                                                    <IconMapPin size={15} />
                                                    <span>
                                                        {store.address}
                                                    </span>
                                                </div>
                                            )}

                                            {store.phone && (
                                                <div>
                                                    <IconPhone size={15} />
                                                    <span>
                                                        {store.phone}
                                                    </span>
                                                </div>
                                            )}

                                            {store.manager?.full_name && (
                                                <div>
                                                    <IconUser size={15} />
                                                    <span>
                                                        {store.manager.full_name}
                                                    </span>
                                                </div>
                                            )}

                                            {(store.opening_time ||
                                                store.closing_time) && (
                                                <div>
                                                    <IconClock size={15} />
                                                    <span>
                                                        {store.opening_time
                                                            ?.slice(0, 5) ||
                                                            '--:--'}
                                                        {' - '}
                                                        {store.closing_time
                                                            ?.slice(0, 5) ||
                                                            '--:--'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="settings__store-card-footer">
                                            <span
                                                className={
                                                    store.is_active
                                                        ? 'settings__status settings__status--active'
                                                        : 'settings__status'
                                                }
                                            >
                                                <span className="settings__status-dot" />
                                                {store.is_active
                                                    ? 'Activa'
                                                    : 'Inactiva'}
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
                    <div className="settings__create-header">
                        <button
                            type="button"
                            className="settings__back-button"
                            onClick={closeCreateForm}
                            disabled={saving}
                        >
                            <IconArrowLeft size={18} />
                            Tiendas
                        </button>

                        <div className="settings__create-heading">
                            <div className="settings__create-icon">
                                <IconBuildingStore size={22} />
                            </div>

                            <div>
                                <h3>Nueva tienda</h3>
                                <p>
                                    Registra un nuevo punto de venta para tu empresa.
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="settings__message settings__message--error">
                            {error}
                        </div>
                    )}

                    <form
                        className="settings__user-form"
                        onSubmit={handleSubmit}
                    >
                        {/* INFORMACIÓN */}
                        <div className="settings__form-card">
                            <div className="settings__form-card-header">
                                <div>
                                    <strong>Información de la tienda</strong>
                                    <span>
                                        Datos principales del punto de venta.
                                    </span>
                                </div>
                            </div>

                            <div className="settings__form-grid">
                                <div className="settings__field">
                                    <label>Nombre de la tienda</label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ej. Tienda Principal"
                                        required
                                    />
                                </div>

                                <div className="settings__field">
                                    <label>Código</label>

                                    <input
                                        name="code"
                                        value={form.code}
                                        onChange={handleChange}
                                        placeholder="Ej. TIENDA-01"
                                    />

                                    <small>
                                        Opcional. Si no lo colocas, el sistema
                                        puede generar uno automáticamente.
                                    </small>
                                </div>

                                <div className="settings__field">
                                    <label>Dirección</label>

                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Ej. Jr. Grau 123"
                                    />
                                </div>

                                <div className="settings__field">
                                    <label>Teléfono</label>

                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Ej. 964 123 456"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* OPERACIÓN */}
                        <div className="settings__form-card">
                            <div className="settings__form-card-header">
                                <div>
                                    <strong>Configuración operativa</strong>
                                    <span>
                                        Define el encargado y horario de atención.
                                    </span>
                                </div>
                            </div>

                            <div className="settings__form-grid">
                                <div className="settings__field">
                                    <label>Encargado</label>

                                    <select
                                        name="managerId"
                                        value={form.managerId}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Sin encargado
                                        </option>

                                        {managers.map((manager) => (
                                            <option
                                                key={manager.id}
                                                value={manager.id}
                                            >
                                                {manager.full_name ||
                                                    manager.email}
                                            </option>
                                        ))}
                                    </select>

                                    <small>
                                        Puedes asignar un usuario activo de
                                        administración o ventas.
                                    </small>
                                </div>

                                <div className="settings__field">
                                    <label>Estado</label>

                                    <select
                                        name="isActive"
                                        value={form.isActive ? 'true' : 'false'}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                isActive:
                                                    e.target.value === 'true',
                                            }))
                                        }
                                    >
                                        <option value="true">
                                            Activa
                                        </option>

                                        <option value="false">
                                            Inactiva
                                        </option>
                                    </select>
                                </div>

                                <div className="settings__field">
                                    <label>Hora de apertura</label>

                                    <input
                                        type="time"
                                        name="openingTime"
                                        value={form.openingTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="settings__field">
                                    <label>Hora de cierre</label>

                                    <input
                                        type="time"
                                        name="closingTime"
                                        value={form.closingTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <label className="settings__user-active">
                                <div className="settings__user-active-info">
                                    <div className="settings__user-active-icon">
                                        <IconStar size={19} />
                                    </div>

                                    <div>
                                        <strong>Tienda principal</strong>

                                        <span>
                                            Identifica esta tienda como la
                                            principal de la empresa.
                                        </span>
                                    </div>
                                </div>

                                <div className="settings__switch">
                                    <input
                                        type="checkbox"
                                        name="isMain"
                                        checked={form.isMain}
                                        onChange={handleChange}
                                    />

                                    <span />
                                </div>
                            </label>
                        </div>

                        {/* ACCIONES */}
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
                                        Creando tienda...
                                    </>
                                ) : (
                                    <>
                                        <IconBuildingStore size={18} />
                                        Crear tienda
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