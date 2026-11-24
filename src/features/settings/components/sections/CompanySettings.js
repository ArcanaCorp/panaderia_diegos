'use client';

import { useEffect, useState } from 'react';
import {
    IconCheck,
    IconLoader2,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import {
    getCompany,
    updateCompany,
} from '@/services/companies.service';

export default function CompanySettings() {
    const { profile } = useAuth();

    const [form, setForm] = useState({
        businessName: '',
        tradeName: '',
        documentNumber: '',
        address: '',
        phone: '',
        email: '',
        website: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (profile?.company_id) {
            loadCompany();
        }
    }, [profile?.company_id]);

    async function loadCompany() {
        try {
            setLoading(true);
            setError('');

            const company = await getCompany(
                profile.company_id
            );

            setForm({
                businessName: company.business_name || '',
                tradeName: company.trade_name || '',
                documentNumber: company.document_number || '',
                address: company.address || '',
                phone: company.phone || '',
                email: company.email || '',
                website: company.website || '',
            });
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                'No se pudieron cargar los datos de la empresa.'
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError('');
        setSuccess('');
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!form.businessName.trim()) {
            setError('La razón social es obligatoria.');
            return;
        }

        try {
            setSaving(true);

            await updateCompany({
                companyId: profile.company_id,
                businessName: form.businessName,
                tradeName: form.tradeName,
                address: form.address,
                phone: form.phone,
                email: form.email,
                website: form.website,
            });

            setSuccess(
                'Los datos de la empresa fueron actualizados correctamente.'
            );
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                'No se pudieron guardar los cambios.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="settings__loading">
                <IconLoader2
                    size={20}
                    className="settings__spinner"
                />
                Cargando información de la empresa...
            </div>
        );
    }

    return (
        <form
            className="settings__form"
            onSubmit={handleSubmit}
        >

            <div className="settings__field">
                <label htmlFor="businessName">
                    Razón social
                </label>

                <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={form.businessName}
                    onChange={handleChange}
                    disabled={saving}
                />
            </div>

            <div className="settings__field">
                <label htmlFor="tradeName">
                    Nombre comercial
                </label>

                <input
                    id="tradeName"
                    name="tradeName"
                    type="text"
                    value={form.tradeName}
                    onChange={handleChange}
                    disabled={saving}
                />
            </div>

            <div className="settings__field">
                <label htmlFor="documentNumber">
                    RUC
                </label>

                <input
                    id="documentNumber"
                    name="documentNumber"
                    type="text"
                    value={form.documentNumber}
                    disabled
                />

                <small>
                    El RUC no puede modificarse desde esta sección.
                </small>
            </div>

            <div className="settings__field">
                <label htmlFor="address">
                    Dirección
                </label>

                <input
                    id="address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    disabled={saving}
                />
            </div>

            <div className="settings__field">
                <label htmlFor="phone">
                    Teléfono
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={saving}
                />
            </div>

            <div className="settings__field">
                <label htmlFor="email">
                    Correo
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={saving}
                />
            </div>

            <div className="settings__field">
                <label htmlFor="website">
                    Sitio web
                </label>

                <input
                    id="website"
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://..."
                    disabled={saving}
                />
            </div>

            {error && (
                <div className="settings__message settings__message--error">
                    {error}
                </div>
            )}

            {success && (
                <div className="settings__message settings__message--success">
                    <IconCheck size={16} />
                    {success}
                </div>
            )}

            <div className="settings__modal-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <IconLoader2
                                size={17}
                                className="settings__spinner"
                            />
                            Guardando...
                        </>
                    ) : (
                        'Guardar cambios'
                    )}
                </button>
            </div>

        </form>
    );
}