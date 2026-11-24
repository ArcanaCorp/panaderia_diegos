'use client';

import { useEffect, useState } from 'react';

import {
    IconCreditCard,
    IconPlus,
    IconArrowLeft,
    IconLoader2,
    IconCash,
    IconBuildingBank,
    IconDeviceMobile,
    IconCircleCheck,
    IconWallet,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

import {
    getCompanyPaymentMethods,
    createPaymentMethod,
} from '@/services/paymentMethods.service';

export default function PaymentsSettings() {
    const { profile } = useAuth();

    const [paymentMethods, setPaymentMethods] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        name: '',
        type: 'cash',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        if (profile?.company_id) {
            loadPaymentMethods();
        }
    }, [profile?.company_id]);

    async function loadPaymentMethods() {
        try {
            setLoading(true);
            setError('');

            const data = await getCompanyPaymentMethods(
                profile.company_id
            );

            setPaymentMethods(data);
        } catch (err) {
            setError(
                err.message ||
                    'No se pudieron cargar los medios de pago.'
            );
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setForm({
            name: '',
            type: 'cash',
            description: '',
            isActive: true,
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

            const newPaymentMethod = await createPaymentMethod({
                companyId: profile.company_id,
                name: form.name,
                type: form.type,
                description: form.description,
                isActive: form.isActive,
            });

            setPaymentMethods((prev) =>
                [...prev, newPaymentMethod].sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '')
                )
            );

            resetForm();
            setShowForm(false);
            setSuccess('Medio de pago creado correctamente.');
        } catch (err) {
            setError(
                err.message ||
                    'No se pudo crear el medio de pago.'
            );
        } finally {
            setSaving(false);
        }
    }

    function getTypeName(type) {
        const types = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            digital_wallet: 'Billetera digital',
            transfer: 'Transferencia',
            other: 'Otro',
        };

        return types[type] || type;
    }

    function getTypeIcon(type) {
        if (type === 'cash') {
            return <IconCash size={19} />;
        }

        if (type === 'card') {
            return <IconCreditCard size={19} />;
        }

        if (type === 'digital_wallet') {
            return <IconDeviceMobile size={19} />;
        }

        if (type === 'transfer') {
            return <IconBuildingBank size={19} />;
        }

        return <IconWallet size={19} />;
    }

    return (
        <div className="settings__payments">

            {!showForm ? (
                <>
                    <div className="settings__section-header">
                        <div>
                            <h3>Medios de pago</h3>
                            <p>
                                Configura las formas de pago disponibles
                                para tu empresa.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openCreateForm}
                        >
                            <IconPlus size={18} />
                            Nuevo medio de pago
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

                    <div className="settings__payments-list">
                        <div className="settings__payments-list-header">
                            <div>
                                <strong>
                                    Medios de pago configurados
                                </strong>

                                <span>
                                    {paymentMethods.length}{' '}
                                    {paymentMethods.length === 1
                                        ? 'medio'
                                        : 'medios'}
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
                                    Cargando medios de pago...
                                </span>
                            </div>
                        ) : paymentMethods.length === 0 ? (
                            <div className="settings__empty-payments">
                                <div className="settings__empty-payments-icon">
                                    <IconCreditCard size={27} />
                                </div>

                                <strong>
                                    Aún no hay medios de pago
                                </strong>

                                <span>
                                    Crea los medios de pago que utilizarás
                                    para registrar tus ventas.
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={openCreateForm}
                                >
                                    <IconPlus size={17} />
                                    Crear medio de pago
                                </button>
                            </div>
                        ) : (
                            <div className="settings__payments-grid">
                                {paymentMethods.map((payment) => (
                                    <div
                                        className="settings__payment-card"
                                        key={payment.id}
                                    >
                                        <div className="settings__payment-card-top">
                                            <div className="settings__payment-icon">
                                                {getTypeIcon(
                                                    payment.type
                                                )}
                                            </div>

                                            <div className="settings__payment-title">
                                                <strong>
                                                    {payment.name}
                                                </strong>

                                                <span>
                                                    {getTypeName(
                                                        payment.type
                                                    )}
                                                </span>
                                            </div>

                                            <span
                                                className={
                                                    payment.is_active
                                                        ? 'settings__status settings__status--active'
                                                        : 'settings__status'
                                                }
                                            >
                                                <span className="settings__status-dot" />

                                                {payment.is_active
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </div>

                                        {payment.description && (
                                            <div className="settings__payment-description">
                                                {payment.description}
                                            </div>
                                        )}
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
                            Medios de pago
                        </button>

                        <div className="settings__create-heading">
                            <div className="settings__create-icon">
                                <IconCreditCard size={22} />
                            </div>

                            <div>
                                <h3>Nuevo medio de pago</h3>

                                <p>
                                    Configura una nueva forma de pago.
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
                        <div className="settings__form-card">
                            <div className="settings__form-card-header">
                                <div>
                                    <strong>
                                        Información del medio de pago
                                    </strong>

                                    <span>
                                        Define cómo aparecerá durante el
                                        registro de ventas.
                                    </span>
                                </div>
                            </div>

                            <div className="settings__form-grid">
                                <div className="settings__field">
                                    <label>
                                        Nombre
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ej. Efectivo"
                                        required
                                    />
                                </div>

                                <div className="settings__field">
                                    <label>
                                        Tipo
                                    </label>

                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                    >
                                        <option value="cash">
                                            Efectivo
                                        </option>

                                        <option value="card">
                                            Tarjeta
                                        </option>

                                        <option value="digital_wallet">
                                            Billetera digital
                                        </option>

                                        <option value="transfer">
                                            Transferencia
                                        </option>

                                        <option value="other">
                                            Otro
                                        </option>
                                    </select>
                                </div>

                                <div className="settings__field settings__field--full">
                                    <label>
                                        Descripción
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Descripción opcional..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="settings__form-card">
                            <label className="settings__user-active">
                                <div className="settings__user-active-info">
                                    <div className="settings__user-active-icon">
                                        <IconCircleCheck size={19} />
                                    </div>

                                    <div>
                                        <strong>
                                            Medio de pago activo
                                        </strong>

                                        <span>
                                            Podrá seleccionarse al registrar
                                            una venta.
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
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <IconPlus size={18} />
                                        Crear medio de pago
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