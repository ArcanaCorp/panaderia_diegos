'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { updateMyProfile } from '@/services/profiles.service';

export default function ProfileSettings() {
    const { profile } = useAuth();

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
    });

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!profile) return;

        setForm({
            fullName: profile.full_name || '',
            phone: profile.phone || '',
        });
    }, [profile]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSuccess('');
        setError('');
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');

        const fullName = form.fullName.trim();
        const phone = form.phone.trim();

        if (!fullName) {
            setError('El nombre completo es obligatorio.');
            return;
        }

        try {
            setSaving(true);

            await updateMyProfile({
                userId: profile.id,
                fullName,
                phone,
            });

            setSuccess('Tus datos de contacto fueron actualizados.');
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

    return (
        <form
            className="settings__form"
            onSubmit={handleSubmit}
        >
            <div className="settings__field">
                <label htmlFor="fullName">
                    Nombre completo
                </label>

                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    disabled={saving}
                />
            </div>

            <div className="settings__field">
                <label htmlFor="email">
                    Correo electrónico
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                />

                <small>
                    El correo electrónico no puede modificarse desde aquí.
                </small>
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
                    placeholder="Ingresa tu número de teléfono"
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