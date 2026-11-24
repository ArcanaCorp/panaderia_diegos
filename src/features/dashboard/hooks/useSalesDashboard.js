'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSalesDashboard } from '@/features/dashboard/services/sales-dashboard.service';

export function useSalesDashboard() {
    const { profile } = useAuth();
    const profileId = profile?.id;

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async () => {
        if (!profileId) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getSalesDashboard(profileId);

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
    }, [profileId]);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) loadDashboard();
        });
        return () => { active = false; };
    }, [loadDashboard]);

    return {
        dashboard,
        loading,
        error,
        reload: loadDashboard,
    };
}