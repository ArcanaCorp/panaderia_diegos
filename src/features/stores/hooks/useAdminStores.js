'use client';

import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = {
    stores: [],
    recent_sales: [],
};

export function useAdminStores() {
    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStores = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const {
                data: result,
                error: rpcError,
            } = await db.rpc('get_admin_stores');

            if (rpcError) throw rpcError;

            console.log('Tiendas:', result);

            setData({
                stores: Array.isArray(result?.stores)
                    ? result.stores
                    : [],

                recent_sales: Array.isArray(result?.recent_sales)
                    ? result.recent_sales
                    : [],
            });
        } catch (err) {
            console.error('Error cargando tiendas:', err);

            setError(
                err?.message ||
                'No se pudieron cargar las tiendas'
            );

            setData(INITIAL_DATA);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    return {
        stores: data.stores,
        recentSales: data.recent_sales,
        loading,
        error,
        refresh: fetchStores,
    };
}