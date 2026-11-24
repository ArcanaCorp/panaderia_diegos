'use client';

import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = {
    notifications: [],
    auditLogs: [],
    stats: {
        active_alerts: 0,
        unread: 0,
        activities_today: 0,
        audits_today: 0,
    },
};

export function useAdminAlerts() {
    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const {
                data: result,
                error: rpcError,
            } = await db.rpc('get_admin_alerts');

            if (rpcError) throw rpcError;

            console.log('Alertas:', result);

            setData({
                notifications: Array.isArray(result?.notifications)
                    ? result.notifications
                    : [],

                auditLogs: Array.isArray(result?.audit_logs)
                    ? result.audit_logs
                    : [],

                stats: {
                    ...INITIAL_DATA.stats,
                    ...(result?.stats || {}),
                },
            });
        } catch (err) {
            console.error('Error cargando alertas:', err);

            setError(
                err?.message ||
                'No se pudieron cargar las alertas'
            );

            setData(INITIAL_DATA);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    return {
        notifications: data.notifications,
        auditLogs: data.auditLogs,
        stats: data.stats,
        loading,
        error,
        refresh: fetchAlerts,
    };
}