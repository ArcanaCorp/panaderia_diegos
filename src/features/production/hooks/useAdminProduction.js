'use client';

import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = {
    orders: [],
};

export function useAdminProduction() {

    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduction = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const { data: result, error: rpcError } = await db.rpc('get_admin_production');

            if (rpcError) {
                throw rpcError;
            }

            console.log('Producción:', result);

            setData({
                orders: Array.isArray(result?.orders)
                    ? result.orders
                    : [],
            });

        } catch (err) {

            console.error(
                'Error cargando producción:',
                err
            );

            setError(
                err?.message ||
                'No se pudo cargar producción'
            );

            setData(INITIAL_DATA);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {
        fetchProduction();
    }, [fetchProduction]);

    return {
        orders: data.orders,
        loading,
        error,
        refresh: fetchProduction,
    };
}