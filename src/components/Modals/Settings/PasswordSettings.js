'use client';

import { useState } from 'react';
import {
    IconCheck,
    IconEye,
    IconEyeOff,
    IconLoader2,
} from '@tabler/icons-react';

import { db } from '@/libs/supabase';

export default function PasswordSettings() {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

        const currentPassword = form.currentPassword;
        const newPassword = form.newPassword;
        const confirmPassword = form.confirmPassword;

        // =========================
        // VALIDACIONES
        // =========================

        if (!currentPassword) {
            setError('Ingresa tu contraseña actual.');
            return;
        }

        if (!newPassword) {
            setError('Ingresa una nueva contraseña.');
            return;
        }

        if (newPassword.length < 8) {
            setError(
                'La nueva contraseña debe tener al menos 8 caracteres.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                'Las nuevas contraseñas no coinciden.'
            );
            return;
        }

        if (currentPassword === newPassword) {
            setError(
                'La nueva contraseña debe ser diferente a la actual.'
            );
            return;
        }

        try {
            setSaving(true);

            // =========================
            // OBTENER USUARIO
            // =========================

            const {
                data: { user },
                error: userError,
            } = await db.auth.getUser();

            if (userError) {
                throw userError;
            }

            if (!user?.email) {
                throw new Error(
                    'No se pudo identificar el correo de tu cuenta.'
                );
            }

            // =========================
            // VERIFICAR CONTRASEÑA ACTUAL
            // =========================

            const { error: signInError } =
                await db.auth.signInWithPassword({
                    email: user.email,
                    password: currentPassword,
                });

            if (signInError) {
                throw new Error(
                    'La contraseña actual es incorrecta.'
                );
            }

            // =========================
            // CAMBIAR CONTRASEÑA
            // =========================

            const { error: updateError } =
                await db.auth.updateUser({
                    password: newPassword,
                });

            if (updateError) {
                throw updateError;
            }

            setForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setSuccess(
                'Tu contraseña fue cambiada correctamente.'
            );

        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                'No se pudo cambiar la contraseña.'
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

            {/* CONTRASEÑA ACTUAL */}
            <div className="settings__field">
                <label htmlFor="currentPassword">
                    Contraseña actual
                </label>

                <div className="settings__password">
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrent ? 'text' : 'password'}
                        value={form.currentPassword}
                        onChange={handleChange}
                        disabled={saving}
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        className="settings__password-toggle"
                        onClick={() =>
                            setShowCurrent((prev) => !prev)
                        }
                        tabIndex={-1}
                    >
                        {showCurrent ? (
                            <IconEyeOff size={18} />
                        ) : (
                            <IconEye size={18} />
                        )}
                    </button>
                </div>
            </div>

            {/* NUEVA CONTRASEÑA */}
            <div className="settings__field">
                <label htmlFor="newPassword">
                    Nueva contraseña
                </label>

                <div className="settings__password">
                    <input
                        id="newPassword"
                        name="newPassword"
                        type={showNew ? 'text' : 'password'}
                        value={form.newPassword}
                        onChange={handleChange}
                        disabled={saving}
                        autoComplete="new-password"
                    />
                    
                    <button
                        type="button"
                        className="settings__password-toggle"
                        onClick={() =>
                            setShowNew((prev) => !prev)
                        }
                        tabIndex={-1}
                    >
                        {showNew ? (
                            <IconEyeOff size={18} />
                        ) : (
                            <IconEye size={18} />
                        )}
                    </button>
                </div>

                <small>
                    Usa al menos 8 caracteres.
                </small>
            </div>

            {/* CONFIRMAR */}
            <div className="settings__field">
                <label htmlFor="confirmPassword">
                    Confirmar nueva contraseña
                </label>

                <div className="settings__password">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={saving}
                        autoComplete="new-password"
                    />

                    <button
                        type="button"
                        className="settings__password-toggle"
                        onClick={() =>
                            setShowConfirm((prev) => !prev)
                        }
                        tabIndex={-1}
                    >
                        {showConfirm ? (
                            <IconEyeOff size={18} />
                        ) : (
                            <IconEye size={18} />
                        )}
                    </button>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="settings__message settings__message--error">
                    {error}
                </div>
            )}

            {/* ÉXITO */}
            {success && (
                <div className="settings__message settings__message--success">
                    <IconCheck size={16} />
                    {success}
                </div>
            )}

            {/* ACTION */}
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
                            Cambiando...
                        </>
                    ) : (
                        'Cambiar contraseña'
                    )}
                </button>
            </div>

        </form>
    );
}