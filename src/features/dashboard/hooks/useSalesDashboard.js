'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSalesDashboard } from '@/services/ventas/dashboard.service';

export function useSalesDashboard() {
    const { profile } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async () => {
        if (!profile?.id) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getSalesDashboard(profile.id);

            setDashboard(data);
        } catch (err) {
            console.error('useSalesDashboard:', err);
            setError(
                err?.message ||
                'No se pudo cargar el dashboard.'
            );
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return {
        dashboard,
        loading,
        error,
        reload: loadDashboard,
    };
}